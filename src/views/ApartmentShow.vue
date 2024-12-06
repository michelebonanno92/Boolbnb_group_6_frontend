<script>
/* 
  Per importare ed utilizzare un componente dentro un altro devo SEMPRE seguire questi 3 passi:
  1) Importazione del componente
  2) Dichiarazione del componente
  3) Utilizzo del componente
*/
// 1) Importazione del componente
import AppHeader from '../components/ApartmentShow/AppHeader.vue';
import AppMain from '../components/ApartmentShow/AppMain.vue';
import AppFooter from '../components/ApartmentShow/AppFooter.vue';
import TomTomMap from '../components/TomTomMap.vue';


export default {
  data() {
    return { 
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1' // Sostituisci con la tua API Key
    }
  },
  // 2) Dichiarazione del componente
  components: {
    AppHeader,
    AppMain,
	  AppFooter,
    TomTomMap
  },

}
</script>

<template>
  
    <!-- 3) Utilizzo del componente -->
    <AppHeader />
    <AppMain />
    <TomTomMap
      :apiKey="apiKey"
      :center="{ lat: 40.73061, lng: -73.935242 }"  
    />
	  <AppFooter />
    
  
</template>

<style lang="scss">
@use '../assets/scss/main' as *;
</style>
