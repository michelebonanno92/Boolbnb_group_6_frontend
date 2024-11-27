<script>
export default {
  	data() {
    	return { 
      
    	}
  	}
}
</script>

<template>
  	<header>
		<div class="container">
			<div class="row">
				<div class="col d-flex justify-content-start">
					<h1 class="text-black  mb-0">BoolBnb</h1>
				</div>
				<div class="col d-flex justify-content-end align-items-center ">
					<div>
						<router-link :to="{ name: 'home'}" class="btn btn-success me-4">
							Homepage
						</router-link>
					</div>
					<div>
						<router-link :to="{}" class="btn btn-warning">
							Login
						</router-link>
					</div>
				</div>
			</div>
		</div>
  	</header>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;

header {
  	background-color: lightblue;
  	text-align: center;
  	padding: 20px 0;
}
</style>
