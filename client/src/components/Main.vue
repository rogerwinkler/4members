<template>
  <!-- <v-app id="Main"> -->
  <mem-main>
    <!-- <v-content> -->
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex md8>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Welcome</v-toolbar-title>
              </v-toolbar>
              <v-layout row wrap>
                <v-flex>
                  <v-card-text>
                    Welcome to the 4members Membership Managemnt Solution!
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    <!-- </v-content> -->
  </mem-main>
  <!-- </v-app> -->
</template>

<script>
import MemMain from '@/components/MemMain'
export default {
  // name: 'Register',
  data () {
    return {
      organization: ''
    }
  },
  created: function () {
    this.$store.dispatch('setAppState', 'main')
  },
  methods: {
  },
  components: {
    MemMain
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
