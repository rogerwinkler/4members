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
    user: null,
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
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    setAppState ({commit}, appState) {
      commit('setAppState', appState)
    },
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    }
  }
})
