<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';



export default {
  data() {
    return { 
      message: 'Main',
      apartment: [],
      marker: null,
      map: null,
	  apartmentTitle: null,
      apartamentLat: null,
      apartmentLong: null,
      apartmentId: null,
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1' // Sostituisci con la tua API Key
    }
  },
  mounted() {
    this.getApartments(); // Chiamata per recuperare gli appartamenti e inizializzare la mappa
	setTimeout(() => {
		this.recordView()
	}, 1000);
  },
  methods: {
    getApartments() {
      axios
        .get('http://127.0.0.1:8000/api/apartments' + '/' + this.$route.params.slug)
        .then((res) => {
          this.apartmentId = res.data.apartment.id;
          this.apartment = res.data.apartment;
		  this.apartmentTitle = res.data.apartment.title
          this.apartamentLat = parseFloat(res.data.apartment.latitude);
          this.apartmentLong = parseFloat(res.data.apartment.longitude);
          console.log("Latitudine:", this.apartamentLat, "Longitudine:", this.apartmentLong);

          this.initializeMap(); // Inizializza la mappa dopo aver ricevuto i dati dell'appartamento
        });
    },

    initializeMap() {
      const map = tt.map({
        key: this.apiKey,
        container: 'map', // ID del div dove verrà montata la mappa
        center: [this.apartmentLong, this.apartamentLat], // Centro iniziale della mappa
        zoom: 14,
      });

      console.log('Mappa inizializzata:', map);

      // Aggiungi il marker al centro della mappa
      map.on('load', () => {
		const popup = new tt.Popup({ offset: 30 }).setText(this.apartmentTitle);
        this.marker = new tt.Marker({ draggable: false }) // Marker non trascinabile
          .setLngLat([this.apartmentLong, this.apartamentLat]) // Passa correttamente la longitudine e latitudine
		  .setPopup(popup) // Mostra il popup al clic
          .addTo(map);
        console.log('Marker aggiunto:', this.marker);
      });
    },

    getPush(apartment) {
      this.$router.push({
        name: 'message',
        query: {
          slug: this.$route.params.slug
        }
      });
    },

    recordView() {
      const ipAddress = this.getClientIp(); // Funzione per ottenere l'IP del client
      axios.post('http://127.0.0.1:8000/api/new-view', {
          apartment_id: this.apartmentId,
          ip_address: ipAddress
        })
        .then(response => {
          console.log('Visualizzazione registrata con successo:', response);
        })
        .catch(error => {
          console.error('Errore nella registrazione della visualizzazione:', error);
        });
    },

    getClientIp() {
      // Nota: in un'applicazione reale dovresti usare un servizio per ottenere l'IP del client.
      const randIpAddress = (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255));
      return randIpAddress; // Restituisce un IP generato casualmente
    }
  }
}
</script>

<template>
  <main>

	<div class="container text-center mb-5">
		<div class="row">
			<div class="col-12">
				<h4 class="fs-2 fw-bold">
					{{ apartment.title }}
				</h4>
					
				<p class="mt-1">
					<i class="fa-solid me-1 fa-location-dot text-danger"></i>
					<span>{{ apartment.address }}</span>
				</p>
			</div>
		</div>
		<div class="row">
			<div  class="col-12 col-md-6">
				<div class="p-4">

					<div v-if="apartment.image" class="my-img-container mb-4">
							<img :src="apartment.full_image_url" :alt="apartment.title" class="img-fluid my-img rounded">
					</div>
					
					

				</div>

			</div>
			<div class="col-12 col-md-6">
				<div class="p-4">
					<div class="map w-100" id="map"></div>
				</div>
			</div>
		</div>
		<div class="row p-4">
			<div class="col-12">
				<p class="text-start text-secondary fs-5">
					{{ apartment.description }}
				</p>
					
				<div class="d-flex align-items-center justify-content-around fs-4 text-start my-4">
					<div>
						<span class="me-2">Stanze </span>
						<i class="fa-solid fa-door-closed my-icon me-2"></i>
						<strong class="fs-5">{{ apartment.rooms }}</strong>
					</div>
					<div>
						<span class="me-2">Letti </span>
						<i class="fa-solid fa-bed my-icon me-2"></i>
						<strong class="fs-5">{{ apartment.beds }}</strong>
					</div>
					<div>
						<span class="me-2">Bagni </span>
						<i class="fa-solid fa-toilet my-icon me-2"></i>
						<strong class="fs-5">{{ apartment.toilets }}</strong>
					</div>
				</div>


				<div class="text-start">
					<h4>
						Servizi:
					</h4>
					<ul class="p-0">
						<li v-for="service, index in apartment.services" :key="index" class="fw-bold text-secondary me-3 p-0 my-lable">
							{{ service.service_name }}
						</li>
					</ul>
				</div>
			</div>
		</div>
			<div class="row">
				<div class="col-12">
					<div class="container d-flex justify-content-around my-4">
						<div class="w-50 px-2">
							<router-link :to="{ name: 'apartments'}" class="btn btn-outline-secondary btn-lg w-100">Torna indietro</router-link>
						</div>
						<div class="w-50 px-2">
							<router-link :to="{ name: 'message'}" @click="getPush" class="btn btn-danger btn-lg w-100">Invia messaggio</router-link>
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
.my-icon {
	color: #FAB12F;
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

.my-img-container {
  height: 400px;
  .my-img {
    width: 100%; /* L'immagine occupa tutta la larghezza */
    height: 100%; /* L'immagine occupa tutta l'altezza del carosello */
    object-fit: cover; /* Riempi il contenitore mantenendo le proporzioni */
    object-position: center; /* Centra l'immagine */
  }
}

#map {
  width: 100%;
  height: 400px;
  position: relative; /* Garantisce che il marker sia posizionato correttamente */
}

</style>
