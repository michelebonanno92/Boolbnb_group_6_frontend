<script>
import axios from 'axios';

export default {
  data() {
    return { 
		// address: '',
		// latitude: null,
		// longitude: null,
		searchQuery: this.$route.query.address || "",
		suggestions: [],
		apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1', // Inserisci la tua API Key qui
		apartments: [],
		radius: this.$route.query.radius || 20, // Raggio predefinito a 10 km
		filteredApartments: [],
    };
  },
  mounted() {
		this.getApartments();

		// Aggiunge l'ascoltatore per clic fuori dalla barra di ricerca o dalle suggestions
		document.addEventListener('click', this.handleClickOutside);

		
    },

beforeUnmount() {
    // Rimuove l'ascoltatore quando il componente viene distrutto
    document.removeEventListener('click', this.handleClickOutside);
},
methods: {
      

	  // suggerimento ricerca
      fetchSuggestions() {
      if (this.searchQuery.length < 1) {
        this.suggestions = [];
        return;
      }

      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        this.searchQuery
      )}.json`;

      axios
        .get(url, {
          params: {
            key: this.apiKey,
            limit: 5,
            language: "it-IT",
            // countrySet: "IT",
			radius: this.radius
          },
        })
        .then((response) => {
          this.suggestions = response.data.results;
        })
        .catch((error) => {
          console.error("Errore nella ricerca:", error);
        });
		},
		
		getApartments() {
		axios
		  .get('http://127.0.0.1:8000/api/apartments')
		  .then((res) => {
			// console.log(res.data.apartments);
	
			this.apartments = res.data.apartments;
			console.log(res);
			if (this.$route.query.lat && this.$route.query.lon) {
			this.selectSuggestion(
			parseFloat(this.$route.query.lat),
			parseFloat(this.$route.query.lon)
      		);
		 }
		   
		  });
	},

	// Filtra gli appartamenti in base alla distanza
    filterApartments() {
      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        this.searchQuery
      )}.json`;

      // Chiamata API TomTom per ottenere le coordinate
      axios
        .get(url, {
          params: {
            key: this.apiKey,
            limit: 1,
			radius: this.radius
          },
        })
        .then((response) => {
          if (response.data.results.length > 0) {
            const { lat, lon } = response.data.results[0].position;

            // Filtra appartamenti entro il raggio
            this.filteredApartments = this.apartments
              .map((apartment) => {
                const distance = this.calculateDistance(
                  lat,
                  lon,
                  apartment.latitude,
                  apartment.longitude
                );
                return { ...apartment, distance };
              })
              .filter((apartment) => apartment.distance <= this.radius);

			this.filteredApartments = [...this.filteredApartments].sort((a, b) => a.distance - b.distance);

          }
        })
        .catch((error) => {
          console.error("Errore nella chiamata TomTom:", error);
        });
    },

		selectSuggestion(latitude, longitude ) {

		// Filtra gli appartamenti entro 10 km
		this.filteredApartments = this.apartments
			.map((apartment) => {
			const distance = this.calculateDistance(
				latitude,
				longitude,
				apartment.latitude,
				apartment.longitude,
			);
			return { ...apartment, distance }; // Aggiunge la distanza all'appartamento
			})
			.filter((apartment) => apartment.distance <= this.radius); // Filtra per raggio

			this.filteredApartments = [...this.filteredApartments].sort((a, b) => a.distance - b.distance);

			// Pulisce la lista delle suggestions
			this.suggestions = [];

		// Aggiorna la barra di ricerca con il risultato selezionato
		// this.searchQuery = suggestion.address.freeformAddress;
		// this.suggestions = [];
		},
		calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // Raggio della Terra in km
		const dLat = this.degToRad(lat2 - lat1);
		const dLon = this.degToRad(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.degToRad(lat1)) *
			Math.cos(this.degToRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distanza in km
		},
		degToRad(deg) {
		return deg * (Math.PI / 180);
		},
		handleClickOutside(event) {
		const suggestionsList = this.$el.querySelector(".suggestions-list");
		const searchBar = this.$el.querySelector(".search-bar");
		
		if (
			suggestionsList &&
			!suggestionsList.contains(event.target) &&
			searchBar &&
			!searchBar.contains(event.target)
		) {
			this.suggestions = []; // Nasconde la lista delle suggestions
		}
		},

		search() {
			this.$router.push({
				name: "apartments",
				query: {  radius: this.radius },
			});
			// console.log(this.$router)
			this.filterApartments();
		},
	}
  }
</script>

<template>

	<main>

  	<div class="container">

		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">Ricerca appartamenti</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
				</button>
				<input
					type="number"
					v-model="radius"
					placeholder="Raggio (km)"
					
				/>
				<button @click="search">Cerca</button>
			</div>
		</nav>
		<div class="" >
		<input
		v-model="searchQuery"
		@input="fetchSuggestions"
		placeholder="Cerca un indirizzo..."
		class="search-bar"
		/>
		<ul v-if="suggestions.length" class="suggestions-list text-start">
			<li
				v-for="(suggestion, index) in suggestions"
				:key="index"
				@click="suggestion.position ? selectSuggestion(suggestion.position.lat, suggestion.position.lon) : null"
			>
				{{ suggestion.address.freeformAddress }}
			</li>
		</ul>
		</div>

  	</div>
	  <!-- <div> {{ apartments }} </div> -->

		<div v-if="filteredApartments.length">
		<h3>Appartamenti trovati entro {{ radius }} km:</h3>
			<div class="container">
				<div class="row">
					
					<div v-for="apartment in filteredApartments" :key="apartment.id" class="col-12 col-sm-6 col-md-6 col-lg-4 mb-3">
						
						<div>
							<div class="card my-card p-3">
								<div class="text-center">
									<img :src=" apartment.full_image_url " class="card-img-top img-fluid" :alt=" apartment.title ">
								</div>
								<h4 class="mb-2">
									{{ apartment.title }} ({{ apartment.distance.toFixed(2) }} km) 
								</h4>
								<ul class="text-start h-100">
									<li>
										Stanze: {{ apartment.rooms }}
									</li>
									<li>
										Letti: {{ apartment.beds }}
									</li>
									<li>
										Bagni: {{ apartment.toilets }}
									</li>
								</ul>
								<div class="text-start">
									<span class="mb-2">Servizi:</span>
									<ul>
										<li v-for="service, index in apartment.services" :key="index" class="badge my-services text-bg-primary rounded-pill">
											{{ service.service_name }}
										</li>
									</ul>
								</div>
								<div>
									<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="btn btn-outline-success w-100">Dettagli</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		
		</div>
		

		<div v-else-if="apartments.length && searchQuery == '' ">
			
			<div class="container">

			<div class="row">
				
				<div  v-for="apartment in apartments" :key="apartment.id" class="col-12 col-sm-6 col-md-6 col-lg-4 mb-3">

					<div class="card my-card p-3">
						<img :src="apartment.full_image_url " class="card-img-top img-fluid" :alt=" apartment.title ">
						<div class="card-body">
							<h5 class="card-title">
								{{ apartment.title }}
							</h5>
						
							<ul class="text-start">
								<li>
									Stanze: {{ apartment.rooms }}
								</li>
								<li>
									Letti: {{ apartment.beds }}
								</li>
								<li>
									Bagni: {{ apartment.toilets }}
								</li>
							</ul>
							
						</div>
							<div class="text-start">
								<span class="mb-2">Servizi:</span>
								<ul>
									<li v-for="service, index in apartment.services" :key="index" class="badge my-services text-bg-primary rounded-pill">
										{{ service.service_name }}
									</li>
								</ul>
							</div>
							<div>
								<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="btn btn-outline-success w-100">Dettagli</router-link>
							</div>
					</div>
				
				
				</div>

			</div>

			</div>

		</div>

		

		<div v-else>
			
			<h3>Nessun Appartamento trovato</h3>

		</div>
		
	</main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

main {
  text-align: center;
  padding: 20px 0;
  height: calc(300vh - ($headerHeight + $footerHeight));
}
.my-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 5px 5px 10px 3px lightgray;
    &:hover{
        box-shadow: 5px 5px 10px 12px lightgray;

    }
	
}
ul {
    list-style: none;
    padding: 0;
    height: 100%;

    .badge {
        padding: 5px 10px;
        margin-bottom: 4px;
    }
    
}

h1 {
  color: red;
}

.search-bar {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 1200px;
  z-index: 10;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background: #f0f0f0;
}
</style>
