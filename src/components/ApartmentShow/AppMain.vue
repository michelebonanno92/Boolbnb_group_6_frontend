<script>
import axios from 'axios';

export default {
  data() {
    return { 
		message: 'Main',
		apartment: [],
		apartmentId: null
    }
  },
  mounted() {
	setTimeout(() => {

		this.getApartments();

		
	}, 1000);
	// const apartmentId = this.apartment.id;
	// console.log(this.apartmentId);
	setTimeout(() => {
		this.recordView(this.apartmentId);
		
	}, 2000);


  },
  methods: {
    getApartments() {
		axios
		  .get('http://127.0.0.1:8000/api/apartments' + '/' + this.$route.params.slug)
		  .then((res) => {
			
			// console.log(res.data.apartment.id);
			// console.log(res.data.apartment.slug);
			this.apartmentId = res.data.apartment.id;
			this.apartment = res.data.apartment;
			// console.log(this.apartments);
    })},
  
  getPush(apartment) {
    this.$router.push({
      name: 'message',
      query: {
        slug: this.$route.params.slug
      }
    })},

	recordView(apartmentId) {
        const ipAddress = this.getClientIp(); // Funzione per ottenere l'IP del client
        // Esegui una chiamata API per registrare la visualizzazione
        axios.post('http://127.0.0.1:8000/api/new-view', {
            apartment_id: apartmentId,
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
		const randIpAddress =  (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
        return randIpAddress; // Fai in modo che venga restituito l'IP dell'utente
    },

  }
}
</script>

<template>
  <main>

	<div class="container  text-center mb-5">
		<div class="row ">
			<div  class="col-12 col-md-6 offset-md-3">
				<div class="card p-4">
					<div v-if="apartment.image">
							<img :src="apartment.full_image_url" :alt="apartment.title" class="img-fluid rounded">
					</div>
					<h4 class="mt-4">
						{{ apartment.title }}
					</h4>
					
					
					<p>
						{{ apartment.address }}
					</p>
					<p class="text-start">
						{{ apartment.description }}
					</p>
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

					<!-- <div  class="mt-4 h-100">
						<ul class="service-list">
							<li v-for="service, index in apartment.services" :key="index">
								{{ service.service_name }}
							</li>
						</ul>
					</div> -->

					<div class="text-start">
						<span class="mb-2 ">Servizi:</span>
						<ul>
							<li v-for="service, index in apartment.services" :key="index" class="badge text-bg-secondary me-2 my-lable">
								{{ service.service_name }}
							</li>
						</ul>
					</div>
					<div class="container d-flex justify-content-around mt-4">
						<div>
							<router-link :to="{ name: 'apartments'}" class="btn btn-outline-secondary">Torna indietro</router-link>
						</div>
						<div>
							<router-link :to="{ name: 'message'}" @click="getPush" class="btn btn-outline-warning">Invia messaggio</router-link>
						</div>
    				</div>

				</div>

			</div>	
		</div>
	</div>

  </main>


 	

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

ul {
	list-style: none;
	padding: 0;
	height: 100%;
		.my-lable {
		text-transform: capitalize;
		padding: 5px 10px;
		
		}
  
}

</style>
