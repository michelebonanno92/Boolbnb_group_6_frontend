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
  <footer>

    <div class="container">

      <div class="row">
        
        <div class="container text-center">
          <div class="row align-items-start">
            <div class="col">
              Chi siamo
            </div>
            <div class="col">
              Contatti
            </div>
            <div class="col">
              F.A.Q.
            </div>
          </div>
        </div>

      </div>
      
    </div>
    
  </footer>

</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

footer {
  background-color: red;
  text-align: center;
  padding: 20px 0;
}

h1 {
  color: black;
}
</style>
