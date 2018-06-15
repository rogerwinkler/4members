<template>
  <!-- <v-app id="Login"> -->
  <mem-main>
    <!-- <v-content> -->
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex md8>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register</v-toolbar-title>
              </v-toolbar>
              <v-layout row wrap>
                <v-flex>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        v-model="organization"
                        :rules="[rules.required]"
                        prepend-icon="supervisor_account"
                        name="organization"
                        label="Organization"
                        type="text"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="fullname"
                        :rules="[rules.required]"
                        prepend-icon="person"
                        name="fullname"
                        label="Full name"
                        type="text"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="email"
                        :rules="[rules.required, rules.email]"
                        prepend-icon="email"
                        name="email"
                        label="Email"
                        type="email"
                        required
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-flex>
                <v-flex>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        v-model="username"
                        :rules="[rules.required]"
                        prepend-icon="account_box"
                        name="username"
                        label="Username"
                        type="text"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="password1"
                        :rules="[rules.password]"
                        id="password1"
                        prepend-icon="lock"
                        name="password1"
                        label="Password"
                        type="password"
                        min="8"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="password2"
                        :rules="[rules.password]"
                        id="password2"
                        prepend-icon="lock"
                        name="password2"
                        label="Repeat password"
                        type="password"
                        min="8"
                        required
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="register">Register</v-btn>
                  </v-card-actions>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex>
                  <v-alert
                    v-model="alert"
                    type="error"
                  >
                    {{ errMsg }}
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-card>
            <p/>
            <span>
              Or <a href="/#/login">login</a> if you already have an account.
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
// import AuthenticationService from '@/services/AuthenticationService'
// import axios from 'axios'
import Api from '@/services/Api'
export default {
  // name: 'Register',
  data () {
    return {
      organization: '',
      fullname: '',
      email: '',
      username: '',
      password1: '',
      password2: '',
      alert: false,
      errMsg: '',
      errMsgs: [],
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        password: (value) => {
          return value.length > 8 || 'At least 8 characters.'
        }
      }
    }
  },
  methods: {
    validate () {
      // console.log('validate()')
      this.errMsgs = []
      if (this.organization === '') {
        this.errMsgs.push('Organization required!')
      }
      if (this.fullname === '') {
        this.errMsgs.push('Full name required!')
      }
      if (this.email === '') {
        this.errMsgs.push('Email required!')
      }
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!pattern.test(this.email)) {
        this.errMsgs.push('Email not valid!')
      }
      if (this.username === '') {
        this.errMsgs.push('Username required!')
      }
      if (this.password1 === '' || this.passwords2 === '') {
        this.errMsgs.push('Passwords required!')
      }
      if (this.password1 !== this.password2) {
        this.errMsgs.push('Passwords don\'t match!')
      }
      if (this.password1.length < 8) {
        this.errMsgs.push('Password must be at least 8 characters long!')
      }
    },
    async register () {
      // console.log('register()')
      // validation
      this.validate()
      this.errMsg = ''
      for (var i = 0; i < this.errMsgs.length; i++) {
        this.errMsg = this.errMsg + this.errMsgs[i] + ' '
      }
      if (this.errMsgs.length > 0) {
        this.alert = true
        return
      } else {
        this.alert = false
      }

      try {
        // const response = await AuthenticationService.register({
        const response = await Api().post('/register', {
          organization: this.organization,
          fullname: this.fullname,
          email: this.email,
          username: this.username,
          password: this.password1
        })
        console.log('response.status=', response.status)
        if (response.status === 'error') {
          console.log('response.message=', response.message)
          this.errMsg = response.message
          return
        }
        console.log('response.data=', JSON.stringify(response.data))
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (error) {
        if (error.response === undefined) {
          this.errMsg = error.message
        } else {
          this.errMsg = error.response.data.message + '. ' + error.response.data.detail
        }
        this.alert = true
      }
    }
  },
  components: {
    MemMain
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
