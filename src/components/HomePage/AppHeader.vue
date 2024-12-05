<script>
export default {
  	data() {
    	return { 
      
    	}
  	}
}
</script>

<template>
  	<header class="py-1">
		<div class="container">
			<div class="row">
				<div class="col d-flex justify-content-start">
					<router-link :to="{ name: 'home'}" class="link-logo">
						<img src="/src/assets/boolbnbnew.png" alt="boolbnb" class="img-fluid">
					</router-link>
				</div>
				<div class="col d-flex justify-content-end align-items-center">
					<div class="d-flex align-items-center">
						<router-link :to="{ name: 'apartments'}" class="btn btn-apartment me-4">
							<i class="fa-solid fa-house-flag"></i>
							Appartamenti
						</router-link>
					</div>
					<div class="d-flex align-items-center">
						<a href="http://127.0.0.1:8000/login" target="_blank" rel="noopener noreferrer" class="btn btn-apartment">
							<i class="fa-solid fa-user"></i>
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
