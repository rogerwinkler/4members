<template>
  <!-- <v-app id='main_footer'> -->
    <v-footer color="primary" app>
      <v-layout justify-center align-center>
        <span class="white--text">
          |
          <v-btn class="footer-button" flat @click="navigateTo('/')">Home</v-btn>
          |
          <v-btn class="footer-button" flat @click="navigateTo('/Contact')">Contact</v-btn>
          |
          <v-btn class="footer-button" flat @click="navigateTo('/Legal')">Legal</v-btn>
          |
          <v-btn class="footer-button" flat @click="navigateTo('/Privacy')">Privacy</v-btn>
          |
        </span>
      </v-layout>
    </v-footer>
  <!-- </v-app> -->
</template>

<script>
export default {
  methods: {
    navigateTo (route) {
      this.$store.state.appState = null
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.footer-button {
  color: white;
  font-size: 10px;
}
</style>
