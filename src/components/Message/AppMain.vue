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
	  apartmentId : 0,
	  success: 'Messaggio inviato con successo!',
	  fail: 'Errore durante l\'invio del messaggio.',
	  sendResult: null
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
				// alert('Messaggio inviato con successo!');
				this.sendResult = 1;
				// Reset dei campi del form
				this.userName = '';
				this.userEmail = '';
				this.userMessage = '';
			}
			})
			.catch(err => {
			console.error(err);
			this.sendResult = 0;
			// alert('Errore durante l\'invio del messaggio.');
			});
	}
  }
}


</script>

<template>
  <main>

    <div class="container">
		<div class="row">
			<div class="col-12 col-md-6 offset-md-3">
				<form @submit.prevent="sendMessage" class="needs-validation">
					<div v-if="this.sendResult == 1" class="alert alert-success">
						{{ this.success }}
					</div>
					<div v-else-if="this.sendResult == 0"  class="alert alert-danger">
						{{ this.fail }}
					</div>
					<div v-else>

					</div>
					<div class="mb-3">
						<label for="name" class="form-label">Il tuo Nome <span class="text-danger">*</span></label>
						<div class="input-group has-validation">
							<input
							type="text"
							class="form-control"
							name="name"
							id="name"
							v-model="userName"
							required
							minlength="3"
							maxlength="64"
							placeholder="Inserisci il tuo nome"
							/>
						</div>
					</div>
					<div class="mb-3">
						<label for="email" class="form-label">La tua Email <span class="text-danger">*</span></label>
						<div class="input-group has-validation">
							<input
							type="email"
							class="form-control"
							name="email"
							id="email"
							v-model="userEmail"
							required
							placeholder="nome@esempio.com"
							/>
						</div>
					</div>
					<div class="mb-3">
						<label for="message" class="form-label">Messaggio <span class="text-danger">*</span></label>
						<textarea
							class="form-control"
							id="message"
							name="message"
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
					
					<router-link :to="{ name: 'apartment-show', params: { slug: selectedAppartamentoSlug } }"  class="btn btn-outline-secondary me-4">Annulla</router-link>

					<button type="submit" class="btn btn-outline-danger">Invia Messaggio</button>
				</form>
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
span {
  color: red;
}

</style>
