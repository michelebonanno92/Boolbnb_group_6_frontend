<script>
import axios from 'axios';

export default {
  data() {
    return { 
      message: 'Main',
	  	apartment: [],

    }
  },
  mounted() {
		this.getApartments();

  },
  methods: {
    getApartments() {
		axios
		  .get('http://127.0.0.1:8000/api/apartments' + '/' + this.$route.params.slug)
		  .then((res) => {
			console.log(res.data.apartment);
			console.log(res.data.apartment.slug);

	
			this.apartment = res.data.apartment;
			// console.log(this.apartments);
    });

    
  },
  
  getPush(apartment) {
    this.$router.push({
      name: 'message',
      query: {
        slug: this.$route.params.slug
      }
    })
    
     }

  }
}
</script>

<template>
  <main>

    <div class="container  text-center"   style="width: 1000px;">
		<div class="row ">
			<div  class="col-12 col-md-6 offset-md-3">
				<div class="card p-4">
					<div v-if="apartment.image">
						  <img :src="apartment.full_image_url" :alt="apartment.title" class="img-fluid rounded">
					</div>
					<h4 class="mt-4">
						{{ apartment.title }}
					</h4>
					<div class="mb-3">
            <div v-if="apartment.visible">
              <p class="badge text-bg-success">
								Pubblicato
							</p>
					  </div>
            <div class="badge text-bg-warning" v-else>
              <p>
								Non pubblicato
							</p>
          </div>
          </div>
					
					</div>
					<p>
						{{ apartment.address }}
					</p>
					<p>
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

					<!-- <div class="text-start">
						<span class="mb-2">Servizi:</span>
						<ul>
								<li foreach (service in apartment.services) class="badge my-services text-bg-primary rounded-pill">
									{{ service.service_name }}
								</li>
						</ul>
					</div> -->

          <div class="container my-5">
          <div class="d-flex flex-row">
            <router-link :to="{ name: 'apartments'}" class="btn btn-secondary btn-lg">Torna indietro</router-link>
          </div>
          <div class="d-flex flex-row-reverse">
            <router-link :to="{ name: 'message'}" @click="getPush" class="btn btn-primary btn-lg">Invia Email</router-link>
          </div>
    </div>

					
				</div>
			</div>
		</div>
	
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;


</style>
