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
	// 	services: [
    //     { service_name: "Service 1", checked: false },
    //     { service_name: "Service 2", checked: false },
    //     { service_name: "Service 3", checked: false }
    //   ],
		myServices: [],
		myFilterServices: [],
		rooms: this.$route.query.rooms || null,
		beds: this.$route.query.beds || null,
		toilets: this.$route.query.toilets || null,
    };
},
mounted() {
	this.getServices();
	this.getApartments();

},

beforeUnmount() {
    // Rimuove l'ascoltatore quando il componente viene distrutto
    document.removeEventListener('click', this.handleClickOutside);
},
methods: {


      
	getServices() {
		axios
		  .get('http://127.0.0.1:8000/api/services')
		  .then((res) => {
			// console.log(res.data.services);
	
			this.myServices = res.data.services;
			console.log(res);

			this.myServices.forEach(servicex => {
				servicex.checked = false;
			}); 
			console.log(this.myServices);

		  });
		},

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

			this.apartments = this.apartments.sort((a, b) => {
					// Primo ordinamento: sponsorizzati in cima
					if (a.sponsorships.length > 0 && b.sponsorships.length === 0) {
						return -1; // a viene prima di b
					} 
			});
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
			  .filter((apartment) => {

				const matchesBasicCriteria =
				apartment.distance <= this.radius &&
				(this.rooms === null || apartment.rooms >= this.rooms) &&
				(this.beds === null || apartment.beds >= this.beds) &&
				(this.toilets === null || apartment.toilets >= this.toilets);

				// Verifica se tutti i servizi selezionati sono inclusi nell'appartamento
				const matchesServices =
				this.myFilterServices.length === 0 || // Nessun filtro selezionato
				this.myFilterServices.every((serviceId) =>
					apartment.services.some((service) => service.id === serviceId)
				);

				return matchesBasicCriteria && matchesServices;
				// return (
				// 	apartment.distance <= this.radius &&
				// 	(this.rooms === null || apartment.rooms >= this.rooms) &&
				// 	(this.beds === null || apartment.beds >= this.beds) &&
				// 	(this.toilets === null || apartment.toilets >= this.toilets)
				// );
			});
            //   .filter((apartment) => apartment.distance <= this.radius);

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

			// this.filteredApartments = [...this.filteredApartments].sort((a, b) => a.distance - b.distance);
			this.filteredApartments = [...this.filteredApartments]
				.sort((a, b) => {
					// Primo ordinamento: sponsorizzati in cima
					if (a.sponsorships.length > 0 && b.sponsorships.length === 0) {
						return -1; // a viene prima di b
					} else if (a.sponsorships.length === 0 && b.sponsorships.length > 0) {
						return 1; // b viene prima di a
					} else {
						// Secondo ordinamento: per distanza
						return a.distance - b.distance;
					}
			});

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
			if (this.searchQuery != '' ) {
				
				this.$router.push({
					name: "apartments",
					query: {  radius: this.radius },
				});
				console.log(this.rooms)
				this.filterApartments();
			}
		},

		clickFilterService(index) {
			this.myServices[index].checked = !this.myServices[index].checked;
			// this.services[index].checked =
       		// 	this.services[index].checked === "checked" ? "" : "checked";
			
			// Trova l'indice del numero da rimuovere
			let indice = this.myFilterServices.indexOf(this.myServices[index].id);

			if (indice !== -1) {
				this.myFilterServices.splice(indice, 1);
			}
			else {
				this.myFilterServices.push(this.myServices[index].id);
				console.log(this.myFilterServices)
				console.log(this.myServices[index])

			}
		},
	}
  }
</script>

<template>

	<main>

  	<div class="container mt-4">
		<div class="row mb-4">
			<div class="col-12 col-lg-3 d-flex align-items-center py-2">
				<a class="navbar-brand align-items-center" href="#">Ricerca appartamenti</a>
					<div class="btn-group">
						<button type="button" class="btn btn-outline-dark mx-2 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
							Servizi
						</button>
						<ul class="dropdown-menu px-2">
							<li v-for="(servicex, index) in this.myServices" :key="index" @click.stop="clickFilterService(index)" class="">
								<input type="checkbox"  :name="servicex.service_name" :id="servicex.service_name" v-model="servicex.checked"  > {{servicex.service_name}}
							</li>
						</ul>
					</div>
			</div>
			<div class="col-12 col-lg-3 justify-content-start align-items-center d-flex py-2">
				
					<label for="input-address" class="me-2">Distanza:</label>
					<input
						class="form-control my-input me-2"
						id="input-address"
						type="number"
						v-model="radius"
						placeholder="Raggio (km)"
						
					/>
				
				
					<label for="rooms" class=" me-2">Stanze</label>
					<input type="number" class="form-control my-input me-2" name="rooms"  id="rooms" v-model="rooms">
				
			</div>
			<div class="col-12 col-lg-3 justify-content-start align-items-center d-flex py-2">
				
					<label for="beds" class="me-2">Letti</label>
					<input type="number" class="form-control  my-input me-2" name="beds" id="beds" v-model="beds">
				
				
					<label for="toilets" class="me-2">Bagni</label>
					<input type="number" class="form-control my-input me-2" name="toilets" id="toilets" v-model="toilets">
				
			</div>
			<div class="col-12 col-lg-3 py-2">
				<button @click="search" class="btn btn-warning w-100">Cerca</button>
			</div>

		</div>
		<div class="row">
			<div class="my-2 mb-5">
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
		

  	</div>
	  <!-- <div> {{ apartments }} </div> -->

		<div v-if="filteredApartments.length">
			<div class="container">
				<h3 class="mb-4">Appartamenti trovati entro {{ radius }} km:</h3>

				<div class="row">
					<div v-for="apartment in filteredApartments" :key="apartment.id" class="col-12 col-sm-6 col-md-6 col-lg-4 mb-3">
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
								<span class="">Servizi:</span>
								<ul class="mt-2">
									<li v-for="service, index in apartment.services" :key="index" class="badge text-bg-secondary me-2 m-1  my-lable">
										{{ service.service_name }}
									</li>
								</ul>
							</div>

							<div>
								<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="btn btn-outline-warning w-100">Dettagli</router-link>
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
								<span class="">Servizi:</span>
								<ul class="mt-2 ">
									<li v-for="service, index in apartment.services" :key="index"  class="badge text-bg-secondary me-2 m-1 my-lable">
										{{ service.service_name }}
									</li>
								</ul>
							</div>
								
							<div>
								<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="btn btn-outline-warning w-100">Dettagli</router-link>
							</div>
					</div>
				
				
				</div>

			</div>

			</div>

		</div>

		

		<div v-else>
			
			<div class="container">
				<h3>Nessun Appartamento trovato</h3>
			</div>

		</div>
		
	</main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

main {
  height: calc(100% - ($headerHeight + $footerHeight));
}

.my-input {
	max-width: 100px;

}

.my-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 5px 5px 10px 3px lightgray;
    &:hover{
        box-shadow: 5px 5px 10px 12px lightgray;

    }
	
	ul {
		list-style: none;
		padding: 0;
		height: 100%;
			.my-lable {
			text-transform: capitalize;
			padding: 5px 10px;
			
			}
	
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

// .completed {
//   text-decoration: line-through;
// }
</style>
