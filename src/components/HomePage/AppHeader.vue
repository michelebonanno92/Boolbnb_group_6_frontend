<script>
export default {
  	data() {
    	return { 
      
    	}
  	}
}
</script>

<template>
  	<header class="bg-body-tertiary py-2 mb-4">
		<div class="container">
			<div class="row">
				<div class="col d-flex justify-content-start">
					<h1 class="text-black mb-0">BoolBnb</h1>
				</div>
				<div class="col d-flex justify-content-end align-items-center ">
					<div>
						<!-- , params: { slug: project.slug}  -->
						<router-link :to="{ name: 'apartments'}" class="btn btn-success me-4">
							Appartamenti
						</router-link>
					</div>
					<div>
						<a href="http://127.0.0.1:8000/login" target="_blank" rel="noopener noreferrer" class="btn btn-warning">
							Login
						</a>
					</div>
				</div>
			</div>
		</div>
  	</header>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/partials/variables' as *;
header {
	height: $headerHeight;
}
</style>
