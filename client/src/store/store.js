import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: true,
  // plugins: [
  //   createPersistedState()
  // ],
  state: {
    appState: null,
    token: null,
    userId: null,
    username: null,
    fullname: null,
    email: null,
    buId: null,
    buName: null,
    isUserLoggedIn: false
  },
  mutations: {
    setAppState (state, appState) {
      state.appState = appState
    },
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, payload) {
      console.log('payload=', JSON.stringify(payload))
      state.userId = payload.user_id
      state.username = payload.username
      state.fullname = payload.fullname
      state.email = payload.email
      state.buId = payload.bu_id
      state.buName = payload.bu_name
    },
    setIsUserLoggedIn (state, loginStatus) {
      state.isUserLoggedIn = loginStatus
    }
  },
  actions: {
    setAppState ({commit}, appState) {
      commit('setAppState', appState)
    },
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, payload) {
      console.log('setUser payload=', JSON.stringify(payload))
      commit('setUser', payload)
    },
    setIsUserLoggedIn ({commit}, loginStatus) {
      commit('setIsUserLoggedIn', loginStatus)
    }
  }
})
