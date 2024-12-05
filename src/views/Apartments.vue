<script>
/* 
  Per importare ed utilizzare un componente dentro un altro devo SEMPRE seguire questi 3 passi:
  1) Importazione del componente
  2) Dichiarazione del componente
  3) Utilizzo del componente
*/
// 1) Importazione del componente
import AppHeader from '../components/Apartments/AppHeader.vue';
import AppMain from '../components/Apartments/AppMain.vue';
import AppFooter from '../components/Apartments/AppFooter.vue';

export default {
  data() {
    return { 
      count: 0
    }
  },
  // 2) Dichiarazione del componente
  components: {
    AppHeader,
    AppMain,
	  AppFooter
  },

}
</script>

<template>
  
    <!-- 3) Utilizzo del componente -->
    <AppHeader />
    <AppMain />
	  <AppFooter />
    
  
</template>

<style lang="scss">
@use '../assets/scss/main' as *;
</style>
