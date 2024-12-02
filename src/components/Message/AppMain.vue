<script>
import axios from 'axios';

export default {
  data() {
    return { 
      message: 'Main',
	  slug: this.$route.query.slug,
      userName: '',
      userEmail: '',
      userMessage: '',
	  apartmentId : 0
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
			console.log(res.data.apartment.id);
			console.log(res.data.apartment.slug);

			this.apartmentId  = res.data.apartment.id;
			this.apartment = res.data.apartment;
			// console.log(this.apartments);
    });
		},

		sendMessage() {

			console.log({
				name: this.userName,
				email: this.userEmail,
				message: this.userMessage,
				apartment_id: this.apartmentId,
			});
		axios
			.post('http://127.0.0.1:8000/api/new-message', {
			name: this.userName,
			email: this.userEmail.trim(),
			message: this.userMessage,
			apartment_id: this.apartmentId  
			})
			.then(res => {
				console.log(res.data);
			if (res.data.success) {
				alert('Messaggio inviato con successo!');
				
				// Reset dei campi del form
				this.userName = '';
				this.userEmail = '';
				this.userMessage = '';
			}
			})
			.catch(err => {
			console.error(err);
			alert('Errore durante l\'invio del messaggio.');
			});
	}
  }
}


</script>

<template>
  <main>

    <div class="container">
      <div class="row">

		<form @submit.prevent="sendMessage">
		<div class="mb-3">
			<label for="name" class="form-label">Il tuo Nome<span class="text-danger">*</span></label>
			<input
				type="text"
				class="form-control"
				id="name"
				v-model="userName"
				required
				minlength="3"
				maxlength="64"
				placeholder="Inserisci il tuo nome"
			/>
		</div>
		<div class="mb-3">
			<label for="email" class="form-label">Il tuo Email<span class="text-danger">*</span></label>
			<input
				type="email"
				class="form-control"
				id="email"
				v-model="userEmail"
				required
				placeholder="nome@esempio.com"
			/>
		</div>
		<div class="mb-3">
			<label for="message" class="form-label">Messaggio<span class="text-danger">*</span></label>
			<textarea
				class="form-control"
				id="message"
				v-model="userMessage"
				required
				minlength="5"
				maxlength="2000"
				placeholder="Scrivi il tuo messaggio qui"
			></textarea>
		</div>
		<div>
			<p>
			<small>
				<span>*</span> i campi contrassegnati con l'asterisco sono obbligatori
			</small>
			</p>
		</div>

		<button type="submit" class="btn btn-primary">Invia Messaggio</button>
	</form>
      
      

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
