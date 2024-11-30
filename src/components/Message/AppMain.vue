<script>
import axios from 'axios';

export default {
  data() {
    return { 
      message: 'Main',
	  	slug: this.$route.query.slug,

      userName: '',
      userEmail: '',
      userMessage: ''
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

    sendContact() {
      console.log('si'),
      axios
        .post('http://localhost:8000/api/new-message', {
          name: this.userName,
          email: this.userEmail,
          message: this.userMessage
        })
        .then(res => {
          if (res.data.success) {
            alert('Email inviata con successo!');
            
            this.userName = '';
            this.userEmail = '';
            this.userMessage = '';
          }
        });
    }
  }
}


</script>

<template>
  <main>

    <div class="container">
      <div class="row">

        <form @submit.prevent="sendContact()">

        <div class="mb-3">
          <label for="name" class="form-label">Il tuo Nome: <span>*</span> </label>
          <input type="text" class="form-control" id="name" name="name" v-model="userName" required minlength="5" maxlength="20" placeholder="nome">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Il tuo indirizzo email: <span>*</span> </label>
          <input type="email" class="form-control" id="email" name="email" v-model="userEmail" required minlength="5" maxlength="20" placeholder="nome@esempio.com">
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">Messaggio: <span>*</span> </label>
          <textarea class="form-control" id="message" name="message" rows="3" v-model="userMessage" required minlength="3" maxlength="2000" placeholder="inserisci il tuo messaggio"></textarea>
        </div>

        <div class="d-flex flex-row-reverse">
          <button type="submit" class="btn btn-primary btn-lg">Invia email</button>
        </div>

        </form>
      
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
      
      <!-- <div class="d-flex flex-row-reverse">
        <button type="button" class="btn btn-primary btn-lg">Invia email</button>
      </div> -->
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
