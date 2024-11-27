<script>
import axios from 'axios';

export default {
  data() {
    return { 
      apartments: [],
    };
  },
  mounted() {
      this.getApartments();
    },
    methods: {
      getApartments() {
        axios
          .get('http://127.0.0.1:8000/api/apartments')
          .then((res) => {
            // console.log(res.data.apartments);

            this.apartments = res.data.apartments;
            // console.log(this.apartments);
           
          });
      },
    }
  }
</script>

<template>

  <div class="container">

    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Ricerca appartamenti</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Filtri
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
            <form class="d-flex col order-5" role="search">
              <input class="form-control me-2" type="search" placeholder="Via..." aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Cerca</button>
          </form>
        </div>
      </div>
    </nav>

  </div>

  
  <main>

    <div class="container">

      <div class="row">
        
        <div  v-for="apartment in apartments" :key="apartment.id"
        class="col-12 col-sm-6 col-md-4 col-lg-2">

          <div class="card">
            <img :src="apartment.full_image_url " class="card-img-top" :alt=" apartment.title ">
            <div class="card-body">
              <h5 class="card-title">{{ apartment.title }}</h5>
              <p class="card-text">{{ apartment.description }}</p>
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
  text-align: center;
  padding: 20px 0;
}


h1 {
  color: red;
}
</style>
