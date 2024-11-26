<script>
export default {
  data() {
    return { 
      message: 'Main'
    }
  }
}
</script>

<template>
  <main>

    <div class="container">

      <div class="row">
        
        <div class="container text-center">
          <h1>
            appartamento
          </h1>
        </div>

      </div>
      
    </div>
    
  </main>

</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

main {
  text-align: center;
  padding: 20px 0;
}


h1 {
  color: black;
}
</style>
