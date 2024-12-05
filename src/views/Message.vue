<script>
/* 
  Per importare ed utilizzare un componente dentro un altro devo SEMPRE seguire questi 3 passi:
  1) Importazione del componente
  2) Dichiarazione del componente
  3) Utilizzo del componente
*/
// 1) Importazione del componente
import AppHeader from '../components/Message/AppHeader.vue';
import AppMain from '../components/Message/AppMain.vue';
import AppFooter from '../components/Message/AppFooter.vue';

export default {
  data() {
    return { 
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
