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
  }
}
</script>

<template>
  <main>

    <div class="container my-5" style="width: 1000px;">

      <div class="row">
        
        <div class="container text-center">
          <div class="card mb-3">
            <img src="https://www.bnbinrome.com/images/261428888.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{{ apartment.slug }}</h5>
              <p class="card-text">Breve descrizione</p>
              <p class="card-text"><small class="text-body-secondary">servizi</small></p>
           </div>
          </div>
        </div>

        

      </div>

      
      

      
    </div>
    <div class="container my-5">
      <div class="d-flex flex-row">
        <router-link :to="{ name: 'apartments'}" class="btn btn-secondary btn-lg">Torna indietro</router-link>
      </div>
      <div class="d-flex flex-row-reverse">
        <button type="button" class="btn btn-primary btn-lg">Invia email</button>
      </div>
    </div>
    
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;


</style>
