<script>
/* 
  Per importare ed utilizzare un componente dentro un altro devo SEMPRE seguire questi 3 passi:
  1) Importazione del componente
  2) Dichiarazione del componente
  3) Utilizzo del componente
*/
// 1) Importazione del componente
import HomePage from './views/HomePage.vue';

export default {
  data() {
    return { 
      count: 1
    }
  },
  // 2) Dichiarazione del componente
  components: {
	HomePage
  },

}
</script>

<template>
  <div>
    <!-- 3) Utilizzo del componente -->
    <HomePage />
    
  </div>
</template>

<style lang="scss">
@use 'assets/scss/main' as *;
</style>
