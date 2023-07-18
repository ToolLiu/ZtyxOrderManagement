import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    destination: null
  },
  mutations: {
    setDestination(state, destination) {
      state.destination = destination;
    }
  },
  actions: {
    setDestination({ commit }, destination) {
      commit('setDestination', destination);
    }
  },
  getters: {
    destination: (state) => state.destination
  }
});
