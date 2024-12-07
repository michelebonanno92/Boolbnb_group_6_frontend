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
		if (this.searchQuery) {
			const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
				this.searchQuery
			)}.json`;

			axios
				.get(url, {
					params: {
						key: this.apiKey,
						limit: 1,
						radius: this.radius,
					},
				})
				.then((response) => {
					if (response.data.results.length > 0) {
						const { lat, lon } = response.data.results[0].position;
						this.applyFilters(lat, lon);
					}
				})
				.catch((error) => {
					console.error("Errore nella chiamata TomTom:", error);
				});
		} else {
			// Usa una posizione di default se non c'è un indirizzo
			this.applyFilters(null, null);
		}
	},

	applyFilters(lat, lon) {
		this.filteredApartments = this.apartments
			.map((apartment) => {
				const distance = lat && lon
					? this.calculateDistance(
						lat,
						lon,
						apartment.latitude,
						apartment.longitude
					)
					: 0; // Nessuna distanza se lat e lon sono null
				return { ...apartment, distance };
			})
			.filter((apartment) => {
				const matchesBasicCriteria =
					(lat && lon ? apartment.distance <= this.radius : true) &&
					(this.rooms === null || apartment.rooms >= this.rooms) &&
					(this.beds === null || apartment.beds >= this.beds) &&
					(this.toilets === null || apartment.toilets >= this.toilets);

				const matchesServices =
					this.myFilterServices.length === 0 || // Nessun filtro selezionato
					this.myFilterServices.every((serviceId) =>
						apartment.services.some((service) => service.id === serviceId)
					);

				return matchesBasicCriteria && matchesServices;
			});

		// Ordina i risultati
		this.filteredApartments = [...this.filteredApartments].sort((a, b) => {
			if (a.sponsorships.length > 0 && b.sponsorships.length === 0) {
				return -1;
			} else if (a.sponsorships.length === 0 && b.sponsorships.length > 0) {
				return 1;
			} else {
				return a.distance - b.distance;
			}
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
			if (
				this.searchQuery !== "" || 
				this.radius > 0 || 
				this.rooms !== null || 
				this.beds !== null || 
				this.toilets !== null || 
				this.myFilterServices.length > 0
			) {
				this.$router.push({
					name: "apartments",
					query: { radius: this.radius },
				});
				this.filterApartments();
			} else {
				console.log("Inserisci almeno un filtro per cercare.");
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
		<div class="row  mb-4">
			<div class="col-12 col-sm-12 col-md-4 col-lg-3 d-flex align-items-center py-2 mb-2 mb-2">
				<a class="navbar-brand align-items-center me-5 me-md-3" href="#">Ricerca appartamenti</a>
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
			<div class="col-12 col-sm-12 col-md-6  col-lg-2 justify-content-start align-items-center d-flex flex-grow-1 py-0 mb-2  ms-md-5 ">
				
					<label for="input-address" class="me-2">Distanza</label>
					<input
						class="form-control my-input me-2"
						id="input-address"
						type="number"
						min="0"
						v-model="radius"
						placeholder="Raggio (km)"
						
					/>
				
					
					<!-- <label for="beds" class="me-2">Letti</label>
					<input type="number" class="form-control  my-input me-2" name="beds" min="0"  id="beds" v-model="beds">
					
					
					<label for="toilets" class="me-2">Bagni</label>
					<input type="number" class="form-control my-input me-2" name="toilets" min="0"  id="toilets" v-model="toilets">
					-->
				</div>
				<div class="col-12 col-sm-12 col-md-12  col-lg-4 justify-content-start align-items-center d-flex py-2">
				
					<label for="rooms" class=" me-2">Stanze</label>
					<input type="number" class="form-control my-input me-2" name="rooms" min="0"  id="rooms" v-model="rooms">
				
					<label for="beds" class="me-2">Letti</label>
					<input type="number" class="form-control  my-input me-2" name="beds" id="beds" v-model="beds">
				
				
					<label for="toilets" class="me-2">Bagni</label>
					<input type="number" class="form-control my-input me-2" name="toilets" id="toilets" v-model="toilets">
				
			</div>
			<div class="col-12 col-sm-12 col-lg-2  justify-self-end pe-0 mt-2">
				<button type="submit" @click="search" class="btn btn-warning w-100">Cerca</button>
			</div>

		</div>
		<div class="row ">
			<div class="my-2 me-3 mb-5 ">
			<input
			v-model="searchQuery"
			@input="fetchSuggestions"
			placeholder="Cerca un indirizzo..."
			class="search-bar"
			/>
				<ul v-if="suggestions.length" class="suggestions-list text-start list-group">
					<li
						class="list-group-item"
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
						<router-link :to="{ name: 'apartment-show' , params: { slug: apartment.slug }}" class="apartment-card-link text-dark">
							<div class="my-card p-3">
								<div class="text-center my-img-container mb-2">
									<img :src=" apartment.full_image_url " class="img-fluid my-img mb-2" :alt=" apartment.title ">
								</div>
								<h4 class="fw-bold mb-1">
									{{ apartment.title }} ({{ apartment.distance.toFixed(2) }} km) 
								</h4>
								<strong class="mb-1">
									{{ apartment.address }} 
								</strong>
								<div class="d-flex align-items-center justify-content-start text-start mb-2">
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
								<div class="text-start h-100">
								<ul class="p-0 d-flex flex-wrap">
									<li v-for="service, index in apartment.services" :key="index" class="fw-bold text-secondary me-3 p-0 my-lable">
										{{ service.service_name }}
									</li>
								</ul>
							</div>
								
							</div>
						</router-link>
					</div>
				</div>
			</div>
		
		</div>
		

		<div v-else-if="apartments.length && searchQuery == '' ">
			
			<div class="container">

			<div class="row">
				
				<div  v-for="apartment in apartments" :key="apartment.id" class="col-12 col-sm-6 col-md-6 col-lg-4 mb-3">

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
								<div class="d-flex align-items-center justify-content-start text-start mb-1">
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
								<div class="text-start h-100">
									<ul class="p-0 d-flex flex-wrap">
										<li v-for="service, index in apartment.services" :key="index" class="fw-bold text-secondary me-3 p-0 my-lable">
											{{ service.service_name }}
										</li>
									</ul>
								</div>
								
						</div>
					</router-link>
				
				
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
  flex-grow: 1;
}

.my-input {
	max-width: 250px;

}

.my-icon {
	color: #FAB12F;
}

.my-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 20px;
//   box-shadow: 5px 5px 10px 3px lightgray;
  &:hover{
    box-shadow: 5px 5px 10px 12px lightgray;
    
  }
  img {
	border-radius: 20px;

  }
	
}
.apartment-card-link {
	text-decoration: none;

}
.my-lable {
			text-transform: capitalize;
			padding: 5px 10px;
			
}
ul {
		list-style: none;
		padding: 0;
		// height: 100%;
			.my-lable {
			text-transform: capitalize;
			// padding: 5px 10px;
			
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

.my-img-container {
  height: 250px;
  min-height: 250px;
  .my-img {
    width: 100%; /* L'immagine occupa tutta la larghezza */
    height: 100%; /* L'immagine occupa tutta l'altezza del carosello */
    object-fit: cover; /* Riempi il contenitore mantenendo le proporzioni */
    object-position: center; /* Centra l'immagine */
  }
}

</style>
