<script>
export default {
  data() {
    return { 
      message: '404 | Not Found'
    }
  }
}
</script>

<template>
  <div class="container text-center">
    <h1>
      {{ message }}
    </h1>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

</style>