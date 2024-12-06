<script>
import TomTomMap from '../components/TomTomMap.vue';

export default {
  components: {
    TomTomMap
  },
  data() {
    return {
      apiKey: 'KtAYjlAUfMLakTMNV7iootfwwERDicp1' // Sostituisci con la tua API Key
    };
  }
};
</script>

<template>
  <div>
    <TomTomMap
      :apiKey="apiKey"
      :center="{ lat: 40.73061, lng: -73.935242 }"  
    />
  </div>
  
</template>

<style lang="scss">
@use '../assets/scss/main' as *;
</style>
