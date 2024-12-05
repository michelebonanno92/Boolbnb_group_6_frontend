<script>
export default {
  data() {
    return { 
      message: 'Footer'
    }
  }
}
</script>

<template>

<footer class="mt-2 bg-body-tertiary d-flex align-items-center">
  <div class="container text-center">
    <div class="row">
      <div class="col-12 col-md-3 d-flex align-items-center justify-content-center justify-content-md-start py-2">© 2024 Boolbnb</div>

    <div class="col-12 col-md-6 py-2">
      <ul class="ms-0 p-0">
        <li>Privacy</li>
        <li>Termini</li>
        <li>Mappa del sito</li>
      </ul>
    </div>
  
      <div class="col-12 col-md-3 d-flex align-items-center justify-content-center justify-content-md-end py-2"><i class="fa-solid fa-earth-europe me-2"></i><span>Italiano</span></div>
    </div>
  </div>
</footer>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

ul {
  list-style: none;
}

// footer {
//   background-color: red;
//   text-align: center;
//   padding: 20px 0;
// }
footer {
	height: $footerHeight;
  // position: absolute;
  // bottom: 0;
  // right: 0;
  // left:0;
}
</style>