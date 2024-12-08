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
	//   myCarousel: null,
    }
  },
  mounted() {
    this.getApartments();
	// this.startCarousel(),
    },
  methods: {
    // chiamata api apartments
    getApartments() {
        axios
          .get('http://127.0.0.1:8000/api/apartments')
          .then((res) => {
            console.log(res);

            this.apartments = res.data.apartments;
            // console.log(this.apartments);
            this.apartments = this.apartments.sort((a, b) => {
					// Primo ordinamento: sponsorizzati in cima
              if (a.sponsorships.length > 0 && b.sponsorships.length === 0) {
                return -1; // a viene prima di b
              } 
            });
           
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
      const address = suggestion.address.freeformAddress;

      
      // Reindirizza alla pagina `search-results` con i dati passati come query
      
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
        .filter((apartment) => apartment.distance <= 20); // Filtra per raggio
        

        this.$router.push({
          name: 'apartments',
          query: {
            lat: latitude,
            lon: longitude,
            address: address,
          },
        });
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

	// startCarousel() {
	// 	this.myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
	// 		ride: 'carousel' // Avvia automaticamente
	// 		});
	// }

    
  },
}
</script>

<template>
	<main>
		
		<div id="carouselExample" class="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="5000">
			<div class="carousel-inner">
				<div class="carousel-item active">
				<img src="/src/assets/bnb-hd-3.jpg" class="d-block w-100" alt="...">
				</div>
				<div class="carousel-item">
				<img src="/src/assets/bnb-hd-4.jpg" class="d-block w-100" alt="...">
				</div>
				<div class="carousel-item">
				<img src="/src/assets/bnb-hd-5.jpg" class="d-block w-100" alt="...">
				</div>
			</div>
			<button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>

		
    	<!-- <div id="jumbotron" class="mb-4">
		</div> -->

		<div class="container search-container">
			<input
			v-model="searchQuery"
			@input="fetchSuggestions"
			placeholder="Cerca un indirizzo..."
			class="search-bar "
			/>
			<ul v-if="suggestions.length" class="suggestions-list text-start list-group">
				<li 
			class="list-group-item"
					v-for="(suggestion, index) in suggestions"
					:key="index"
					@click="selectSuggestion(suggestion)"
				>
					{{ suggestion.address.freeformAddress }}
				</li>
			</ul>

		<div >
		<h3 class="my-4">Appartamenti in evidenza</h3>
			<div class="container">
			<div class="row">
				
				<div  v-for="apartment in apartments.filter(a => a.sponsorships && a.sponsorships.length )" :key="apartment.id" class="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
					<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="apartment-card-link text-dark">
						<div class="my-card p-3">
							<div class="text-center my-img-container mb-2">
								<img :src=" apartment.full_image_url " class="img-fluid my-img mb-2" :alt=" apartment.title ">
							</div>
							<h4 class="fw-bold mb-1">
								{{ apartment.title }} 
							</h4>
							<strong class="mb-1">
								{{ apartment.address }} 
							</strong>
							<div class="d-flex align-items-center justify-content-start text-start">
								<div>
									<!-- <span class="me-2">Stanze </span> -->
									<i class="fa-solid fa-door-closed my-icon me-2"></i>
									<strong class="fs-5 me-3">{{ apartment.rooms }}</strong>
								</div>
								<div>
									<!-- <span class="me-2">Letti </span> -->
									<i class="fa-solid fa-bed my-icon me-2"></i>
									<strong class="fs-5 me-3">{{ apartment.beds }}</strong>
								</div>
								<div>
									<!-- <span class="me-2">Bagni </span> -->
									<i class="fa-solid fa-toilet my-icon me-2"></i>
									<strong class="fs-5 me-3">{{ apartment.toilets }}</strong>
								</div>
							</div>
							<!-- <div class="text-start h-100">
								<ul class="mt-2">
									<li v-for="service, index in apartment.services" :key="index" class="btn btn-outline-warning fw-bold text-dark me-2 m-1 my-lable" style="--bs-btn-padding-y: .20rem; --bs-btn-padding-x: .3rem; --bs-btn-font-size: .70rem;">
										{{ service.service_name }}
									</li>
								</ul>
							</div> -->

							<!-- <div>
								<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="btn btn-danger w-100">Dettagli</router-link>
							</div> -->
						</div>
					</router-link>
				</div>
			</div>
			</div>
			
			</div>
	</div>
    
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

main {
  flex-grow: 1;
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

.my-icon {
	color: #FAB12F;
}
.my-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 10px;
//   box-shadow: 5px 5px 10px 3px lightgray;
  &:hover{
    box-shadow: 5px 5px 10px 12px lightgray;
    
  }
  img {
	border-radius: 10px;

  }
	
}
.apartment-card-link {
	text-decoration: none;

}
.search-bar {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.my-img-container {
  height: 200px;
  .my-img {
    width: 100%; /* L'immagine occupa tutta la larghezza */
    height: 100%; /* L'immagine occupa tutta l'altezza del carosello */
    object-fit: cover; /* Riempi il contenitore mantenendo le proporzioni */
    object-position: center; /* Centra l'immagine */
  }
}

#carouselExample {
  max-height: 600px; /* Altezza massima del carosello */
  width: 100%; /* Larghezza piena */
}

#carouselExample .carousel-item {
  height: 600px; /* Altezza uniforme per ogni slide */
}

#carouselExample .carousel-item img {
  width: 100%; /* L'immagine occupa tutta la larghezza */
  height: 100%; /* L'immagine occupa tutta l'altezza del carosello */
  object-fit: cover; /* Riempi il contenitore mantenendo le proporzioni */
  object-position: center; /* Centra l'immagine */
}

</style>
