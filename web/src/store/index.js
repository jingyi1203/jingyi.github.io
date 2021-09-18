import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    path: "/",
    isLogin: false
  },
  mutations: {
    pathEdit(state, payload) {
      state.path = payload;
    },
    isLogin(state, payload) {
      state.isLogin = payload;
    }
  },
  actions: {},
  modules: {}
});
