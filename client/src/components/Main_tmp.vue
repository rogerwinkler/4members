<template>
  <v-app id='main'>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="logout">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed dark color="primary" app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-4">
        <!-- @click="navigateTo({name: 'root'})"> -->
        <span
          class="home"
          @click="logout">
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

    <v-content>
      <login/>
    </v-content>

    <v-footer color="primary" app>
      <v-layout justify-center align-center>
        <span class="white--text">
          |
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/">Home</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          |
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#">Contact</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          |
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#">Legal</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          |
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#">Privacy</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          |
        </span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Login from '@/components/Login.vue'
export default {
  data: () => ({
    drawer: null
  }),
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({name: 'root'})
    }
  },
  props: {
    source: String
  },
  components: {
    Login
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
a {
  color: white;
  text-decoration: none;
  font-size: 12px;
}
</style>
