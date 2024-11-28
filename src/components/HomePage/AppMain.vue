<script>
import axios from 'axios';
export default {
  data() {
    return { 
      searchQuery: '',
      suggestions: [],
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1', // Inserisci la tua API Key qui
      apartments: [],
      filteredApartments: [],
    }
  },
  mounted() {
    this.getApartments();
    },
  methods: {
    // chiamata api apartments
    getApartments() {
        axios
          .get('http://127.0.0.1:8000/api/apartments')
          .then((res) => {
            // console.log(res.data.apartments);

            this.apartments = res.data.apartments;
            // console.log(this.apartments);
           
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
          },
        })
        .then((response) => {
          this.suggestions = response.data.results;
        })
        .catch((error) => {
          console.error("Errore nella ricerca:", error);
        });
    },
    selectSuggestion(suggestion) {
      const latitude = suggestion.position.lat;
      const longitude = suggestion.position.lon;

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
        .filter((apartment) => apartment.distance <= 50); // Filtra per raggio

      // Aggiorna la barra di ricerca con il risultato selezionato
      this.searchQuery = suggestion.address.freeformAddress;
      this.suggestions = [];
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
  },
}
</script>

<template>
  <main>

    <div class="container search-container mb-4">
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
				@click="selectSuggestion(suggestion)"
			>
				{{ suggestion.address.freeformAddress }}
			</li>
		</ul>

		<div v-if="filteredApartments.length">
		<h3>Appartamenti trovati entro 10 km:</h3>
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
								<div  class="mt-4 h-100">
									<ul class="service-list">
										<li>
											placeholder servizi
										</li>
									</ul>
								</div>
								<div>
									<router-link :to="{ name: 'apartment-show'}" class="btn btn-outline-success w-100">Dettagli</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		
		</div>
		<div v-else-if="!filteredApartments.length && !searchQuery == '' ">
			
			<h3>Nessun Appartamento trovato</h3>

		</div>
  </div>
    
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

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

ul {
    list-style: none;
    padding: 0;
    height: 100%;

    .badge {
        padding: 5px 10px;
        margin-bottom: 4px;
    }
    
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
main {
  height: calc(100vh - ($headerHeight + $footerHeight));
}
</style>
