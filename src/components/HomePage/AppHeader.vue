<script>
export default {
  	data() {
    	return { 
      
    	}
  	}
}
</script>

<template>
  	<header class="py-3">
		<div class="container">
			<div class="row align-items-center">
				<div class="col d-flex justify-content-start">
					<router-link :to="{ name: 'home'}" class="link-logo">
						<div class="d-flex align-items-center justify-content-center py-2">
							<i class="fa-solid fa-door-open me-1 text-warning fa-2x"></i><h4 class="text-dark m-0">BoolBnb</h4>
						</div>
						<!-- <img src="/src/assets/boolbnbnew.png" alt="boolbnb" class="img-fluid"> -->
					</router-link>
				</div>
				<div class="col d-flex justify-content-end align-items-center">
					<div class="d-flex align-items-center">
						<router-link :to="{ name: 'apartments'}" class="btn btn-apartment me-4">
							<i class="fa-solid fa-house-flag me-1 text-warning"></i>
							<span class="d-none d-md-inline-block fw-bold">Appartamenti</span>
						</router-link>
					</div>
					<div class="d-flex align-items-center">
						<a href="http://127.0.0.1:8000/login" target="_blank" rel="noopener noreferrer" class="btn btn-apartment">
							<i class="fa-solid fa-user me-1 text-warning"></i>
							<span class="d-none d-md-inline-block fw-bold">Login</span>
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

.link-logo {
	text-decoration: none;
	img {
		height: 80px;
	}
}

.btn-apartment {
	margin-left: -8px;
}

</style>
