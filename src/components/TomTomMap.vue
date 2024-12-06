<script>
import tt from '@tomtom-international/web-sdk-maps';

export default {
props: {
    apiKey: {
    type: String,
    required: true
    },
    center: {
    type: Object,
    required: true,
    default: () => ({ lat: 0, lng: 0 })
    }
},
mounted() {
    // Inizializza la mappa quando il componente è montato
    this.initializeMap();
},
methods: {
    initializeMap() {
    const map = tt.map({
        key: this.apiKey,
        container: 'map', // ID del div dove verrà montata la mappa
        center: this.center,
        zoom: 14
    });

    // Aggiungi un marker al centro
    tt.Marker({ draggable: false })
        .setLngLat([this.center.lng, this.center.lat])
        .addTo(map);
    }
}
};
</script>

<template>
    <div id="map" style="width: 100%; height: 500px;"></div>
</template>
  
  
<style>
/* Stile per garantire che il contenitore della mappa abbia le dimensioni */
#map {
    width: 100%;
    height: 100%;
}
</style>
