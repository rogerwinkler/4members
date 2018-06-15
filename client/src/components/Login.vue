<template>
  <!-- <v-app id="Login"> -->
  <mem-main>
    <!-- <v-content> -->
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex md6>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    id="username"
                    prepend-icon="person"
                    name="username"
                    label="Username"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
            <p/>
            <span>
              Or <a href="/#/register">register</a> to create a new 4members instance.
            </span>
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
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  components: {
    MemMain
  }
}
</script>

<style scoped>

</style>
