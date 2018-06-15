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
        <!--
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>launch</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Register</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        -->
      </v-list>
    </v-navigation-drawer>
  <!-- </v-app> -->
</template>

<script>
export default {
  data: () => ({
    drawer: false
  }),
  methods: {
    navigateTo (route) {
      this.$store.state.appState = null
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
