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
          <label for="exampleFormControlInput1" class="form-label">Tuo indirizzo email:</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="nome@esempio.com">
        </div>
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">Messaggio:</label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>

      </div>
    </div>

    <div class="container my-5">
      <!-- deve tornare indietro nell'appartamento giusto -->
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

// .search-bar {
//   width: 100%;
//   padding: 10px;
//   font-size: 16px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// }

// .suggestions-list {
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   background: white;
//   border: 1px solid #ccc;
//   max-height: 200px;
//   overflow-y: auto;
//   position: absolute;
//   width: 1200px;
//   z-index: 10;
// }

// .suggestions-list li {
//   padding: 8px;
//   cursor: pointer;
// }

// .suggestions-list li:hover {
//   background: #f0f0f0;
// }

// ul {
//     list-style: none;
//     padding: 0;
//     height: 100%;

//     .badge {
//         padding: 5px 10px;
//         margin-bottom: 4px;
//     }
    
// }

// .my-card {
//     display: flex;
//     flex-direction: column;
//     height: 100%;
//     box-shadow: 5px 5px 10px 3px lightgray;
//     &:hover{
//         box-shadow: 5px 5px 10px 12px lightgray;

//     }
	
// }

main {
  height: calc(100vh - ($headerHeight + $footerHeight));
}
</style>
