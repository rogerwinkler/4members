<template>
  <!-- <v-app id='main_toolbar'> -->
    <v-toolbar fixed dark color="primary" app>
      <v-toolbar-side-icon @click.stop="sideIconClicked()"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-4">
        <!-- @click="navigateTo({name: 'root'})"> -->
        <span
          class="home"
          @click="navigateTo('/')">
          4members
        </span>
      </v-toolbar-title>

      <!--
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
      -->
    </v-toolbar>
  <!-- </v-app> -->
</template>

<script>
export default {
  // data: () => ({
  //   drawer: null
  // }),
  methods: {
    navigateTo (route) {
      this.$store.state.appState = null
      this.$router.push(route)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({name: 'root'})
    },
    sideIconClicked () {
      // console.log('sideIconClicked')
      this.$root.$emit('show-hide-drawer')
    }
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
</style>
