<script>
import axios from 'axios';
export default {
  data() {
    return { 
      searchQuery: '',
      suggestions: [],
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1', // Inserisci la tua API Key qui
      apartments: [],
      filteredApartments: [],
    }
  },
  mounted() {
    this.getApartments();
    },
  methods: {
    // chiamata api apartments
    getApartments() {
        axios
          .get('http://127.0.0.1:8000/api/apartments')
          .then((res) => {
            // console.log(res.data.apartments);

            this.apartments = res.data.apartments;
            // console.log(this.apartments);
           
          });
      },

      // suggerimento ricerca
      fetchSuggestions() {
      if (this.searchQuery.length < 1) {
        this.suggestions = [];
        return;
      }

      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        this.searchQuery
      )}.json`;

      axios
        .get(url, {
          params: {
            key: this.apiKey,
            limit: 5,
            language: "it-IT",
            // countrySet: "IT",
          },
        })
        .then((response) => {
          this.suggestions = response.data.results;
        })
        .catch((error) => {
          console.error("Errore nella ricerca:", error);
        });
    },
    selectSuggestion(suggestion) {
      const latitude = suggestion.position.lat;
      const longitude = suggestion.position.lon;

      // Filtra gli appartamenti entro 10 km
      this.filteredApartments = this.apartments
        .map((apartment) => {
          const distance = this.calculateDistance(
            latitude,
            longitude,
            apartment.latitude,
            apartment.longitude,
          );
          return { ...apartment, distance }; // Aggiunge la distanza all'appartamento
        })
        .filter((apartment) => apartment.distance <= 50); // Filtra per raggio

      // Aggiorna la barra di ricerca con il risultato selezionato
      this.searchQuery = suggestion.address.freeformAddress;
      this.suggestions = [];
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Raggio della Terra in km
      const dLat = this.degToRad(lat2 - lat1);
      const dLon = this.degToRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degToRad(lat1)) *
          Math.cos(this.degToRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distanza in km
    },
    degToRad(deg) {
      return deg * (Math.PI / 180);
    },
  },
}
</script>

<template>
  <main>

    <div class="search-container">
    <input
      v-model="searchQuery"
      @input="fetchSuggestions"
      placeholder="Cerca un indirizzo..."
      class="search-bar"
    />
    <ul v-if="suggestions.length" class="suggestions-list">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion.address.freeformAddress }}
      </li>
    </ul>

    <div v-if="filteredApartments.length">
      <h3>Appartamenti trovati entro 10 km:</h3>
      <ul>
        <li v-for="apartment in filteredApartments" :key="apartment.id">
          {{ apartment.title }} ({{ apartment.distance.toFixed(2) }} km)
          <div class="card">
              <img :src=" apartment.full_image_url " class="card-img-top" :alt=" apartment.title ">
              <div class="card-body">
                <h5 class="card-title">{{ apartment.title }}</h5>
                <p class="card-text">{{ apartment.description }}</p>
              </div>
            </div>
        </li>

      </ul>
    </div>
  </div>

    <!-- <div class="container">

      <div class="row">
        <div class="search-container">
          <input
            v-model="searchQuery"
            @input="fetchSuggestions"
            placeholder="Cerca un indirizzo..."
            class="search-bar"
          />
          <ul v-if="suggestions.length" class="suggestions-list">
            <li
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion.address.freeformAddress }}
            </li>
          </ul>

          <div v-if="filteredApartments.length">
            <h3>Appartamenti trovati entro 10 km:</h3>
            <ul>
              <li v-for="apartment in filteredApartments" :key="apartment.id">
                {{ apartment.title }} ({{ apartment.distance.toFixed(2) }} km)
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div class="row">
        
        <div  v-for="apartment in apartments" :key="apartment.id"
        class="col-12 col-sm-6 col-md-4 col-lg-2">

          <div class="card">
            <img :src=" apartment.full_image_url " class="card-img-top" :alt=" apartment.title ">
            <div class="card-body">
              <h5 class="card-title">{{ apartment.title }}</h5>
              <p class="card-text">{{ apartment.description }}</p>
            </div>
          </div>
          
        </div>

      </div>
      
    </div> -->
    
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

.search-bar {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 10;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background: #f0f0f0;
}

ul {
  margin: 10px 0;
  padding: 0;
  list-style: none;
}

ul li {
  padding: 5px;
  background: #f8f8f8;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>
