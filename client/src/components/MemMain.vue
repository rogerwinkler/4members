<template>
  <!-- <v-app id='main'> -->
  <div>
    <main-navigation-drawer/>
    <main-toolbar/>

    <v-content>
      <!-- <login v-if="this.$store.state.appState=='login'"/> -->
      <slot></slot>
    </v-content>

    <main-footer/>
  </div>
  <!-- </v-app> -->
</template>

<script>
import MainNavigationDrawer from '@/components/MainNavigationDrawer'
import MainToolbar from '@/components/MainToolbar'
import MainFooter from '@/components/MainFooter'

// import Login from '@/components/Login.vue'
export default {
  // data: () => ({
  //   drawer: null
  // }),
  // methods: {
  //   navigateTo (route) {
  //     this.$router.push(route)
  //   },
  //   logout () {
  //     this.$store.dispatch('setToken', null)
  //     this.$store.dispatch('setUser', null)
  //     this.$router.push({name: 'root'})
  //   },
  //   toggleDrawer () {
  //     console.log('toggleDrawer')
  //     MainNavigationDrawer.toggleDrawer()
  //   }
  // },
  // props: {
  //   source: String
  // },
  components: {
    MainNavigationDrawer,
    MainToolbar,
    MainFooter
    // Login
  }
}
</script>

<style scoped>
</style>
