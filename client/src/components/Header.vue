<template>
	<v-toolbar fixed dark color="primary">
	    <v-toolbar-side-icon></v-toolbar-side-icon>
		<v-toolbar-title class="mr-4">
				<!-- @click="navigateTo({name: 'root'})"> -->
			<span
			    class="home"
				@click="logout">
				4members
			</span>
		</v-toolbar-title>

		<v-toolbar-items>
			<v-btn flat dark>
				Browse
			</v-btn>
		</v-toolbar-items>

		<v-spacer></v-spacer>

		<v-toolbar-items>
			<v-btn 
				v-if="!$store.state.isUserLoggedIn"
				flat 
				dark
				@click="navigateTo({name: 'login'})">
				Login
			</v-btn>
			
			<v-btn 
				v-if="!$store.state.isUserLoggedIn"
				flat 
				dark
				@click="navigateTo({name: 'register'})">
				Sign Up
			</v-btn>

			<v-btn 
				v-if="$store.state.isUserLoggedIn"
				flat 
				dark
				@click="logout">
				Log Out
			</v-btn>			
		</v-toolbar-items>
	</v-toolbar>
</template>


<script>
export default {
	methods: {
		navigateTo (route) {
			this.$router.push(route)
		},
		logout () {
			this.$store.dispatch('setToken', null)
			this.$store.dispatch('setUser', null)
			this.$router.push({name: 'root'})
		}
	}
}
</script>


<style scoped>
.home {
	cursor: pointer;
}

.home:hover {
	color: #E9E;
}
</style>