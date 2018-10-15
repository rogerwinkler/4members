<template>
  <!-- <v-app id='main_navigation_drawer'> -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="navigateTo('/')">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider ></v-divider>

        <v-list-tile @click="navigateTo('login')" v-bind:disabled="isLogin">
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="navigateTo('register')" v-bind:disabled="isRegister">
          <v-list-tile-action>
            <v-icon>note_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Register</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  <!-- </v-app> -->
</template>

<script>
export default {
  data: () => ({
    drawer: false
    // isLogin: false,
    // isRegister: false
  }),
  computed: {
    isLogin: function () {
      return (this.$store.state.appState === 'login')
    },
    isRegister: function () {
      return (this.$store.state.appState === 'register')
    }
  },
  methods: {
    navigateTo (route) {
      if (this.$store.state.appState === route) {
        return
      }
      this.$router.push(route)
    },
    toggleDrawer () {
      this.drawer = !this.drawer
    }
  },
  mounted: function () {
    // console.log('mounted')
    this.$root.$on('show-hide-drawer', () => {
      // console.log('I am listening : ', this.drawer)
      this.drawer = true
    })
  }
}
</script>

<style scoped>
</style>
