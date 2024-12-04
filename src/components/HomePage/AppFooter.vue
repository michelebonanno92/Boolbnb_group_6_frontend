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
  <footer class="py-4 mt-2 bg-body-tertiary d-flex align-items center">

    <div class="container">

      <div class="row justify-content-between align-items center">

        <div class="col-12 col-md-3">
          © 2024 Airbnb, Inc
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
    
  </footer>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

// footer {
//   background-color: red;
//   text-align: center;
//   padding: 20px 0;
// }
// footer {
// 	height: $footerHeight;
// }
</style>
