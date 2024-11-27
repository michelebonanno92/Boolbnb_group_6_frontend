<script>
import axios from 'axios';
export default {
  data() {
    return { 
      searchQuery: '',
      suggestions: [],
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1', // Inserisci la tua API Key qui
    }
  },
  methods: {
    fetchSuggestions() {
      // Effettua una chiamata API solo se l'utente ha digitato almeno 3 caratteri
      if (this.searchQuery.length < 0) {
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
            limit: 5, // Numero massimo di suggerimenti
            language: "it-IT", // Lingua dei suggerimenti
            // countrySet: "IT", // Limita ai risultati italiani
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
      console.log("Suggerimento selezionato:", suggestion);

      // Aggiorna la barra di ricerca con il risultato selezionato
      this.searchQuery = suggestion.address.freeformAddress;

      // Esegui ulteriori azioni come salvarlo o usarlo in un'altra funzione
      this.suggestions = [];
    },
  },
}
</script>

<template>
  <main>

    <div class="container">

      <div class="row">
        
        <div>
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
        </div>

      </div>
      
    </div>
    
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
</style>
