<script>
import axios from 'axios';

export default {
  data() {
    return { 
      message: 'Main',
	  	slug: this.$route.query.slug,

    }
  },
  mounted() {
		this.getApartments();

		
  },
  computed: {
    selectedAppartamentoSlug() {
    return this.$route.query.slug;
 }
},
  methods: {
    getApartments() {
		axios
		  .get('http://127.0.0.1:8000/api/apartments' + '/' + this.slug)
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

    <div class="container">
      <div class="row">

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Il tuo Nome: <span>*</span> </label>
          <input type="text" class="form-control" id="exampleFormControlInput1" required minlength="5" maxlength="20" placeholder="nome">
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Il tuo indirizzo email: <span>*</span> </label>
          <input type="email" class="form-control" id="exampleFormControlInput1" required minlength="5" maxlength="20" placeholder="nome@esempio.com">
        </div>
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">Messaggio: <span>*</span> </label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" required minlength="3" maxlength="2000" placeholder="inserisci il tuo messaggio"></textarea>
      </div>
      <div>
        <p>
          <small>
            <span>*</span> i campi contrassegnati con l'asterisco sono obbligatori
          </small>
        </p>
      </div>

      </div>
    </div>

    <div class="container my-5">
      <div class="d-flex flex-row">
        <!-- <router-link :to="{ name: 'apartment-show', params: { slug: selectedAppartamentoSlug } }" class="btn btn-secondary btn-lg">Torna indietro</router-link>  -->
         <router-link :to="{ name: 'apartment-show', params: { slug: selectedAppartamentoSlug } }"  class="btn btn-secondary btn-lg">Torna indietro</router-link>
      </div>
      
      <div class="d-flex flex-row-reverse">
        <button type="button" class="btn btn-primary btn-lg">Invia email</button>
      </div>
    </div>

  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

main {
  height: calc(100vh - ($headerHeight + $footerHeight));
}

span {
  color: red;
}

</style>
