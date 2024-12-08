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

<footer class="py-4 mt-2 bg-body-tertiary d-flex align-items-center">
  <div class="container text-center">
    <div class="row">
      <div class="col-12 col-md-3 d-flex align-items-center justify-content-center justify-content-md-start py-2">© 2024 Boolbnb</div>

    <div class="col-12 col-md-6 py-2">
      <ul class="m-0 p-0">
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
}
</style>

<!-- <footer class="py-4 mt-2 bg-body-tertiary d-flex align-items-center">

  <div class="container">

    <div class="row justify-content-between align-items-center">

      <div class="col-12 col-md-3">
        © 2024 Boolbnb
      </div>
      <div class="col-12 col-md-6">
        <div class="d-flex align-items-center justify-content-center">
          <div class="px-3">
            Privacy
          </div>
          <div class="px-3">
            Termini
          </div>
          <div class="px-3">
            Mappa del sito
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 text-end">
        <i class="fa-solid fa-earth-europe me-2"></i><span>Italiano</span>
      </div>

    </div>
    
  </div>
  
</footer> -->