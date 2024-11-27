<script>
/* 
  Per importare ed utilizzare un componente dentro un altro devo SEMPRE seguire questi 3 passi:
  1) Importazione del componente
  2) Dichiarazione del componente
  3) Utilizzo del componente
*/
// 1) Importazione del componente
import AppHeaderApartmentShow from '../components/ApartmentShow/AppHeader.vue';
import AppMain from '../components/ApartmentShow/AppMain.vue';
import AppFooter from '../components/ApartmentShow/AppFooter.vue';

export default {
  data() {
    return { 
    }
  },
  // 2) Dichiarazione del componente
  components: {
    AppHeaderApartmentShow,
    AppMain,
	  AppFooter
  },

}
</script>

<template>
  <div>
    <!-- 3) Utilizzo del componente -->
    <AppHeaderApartmentShow />
    <AppMain />
	  <AppFooter />
    
  </div>
</template>

<style lang="scss">
@use '../assets/scss/main' as *;
</style>
