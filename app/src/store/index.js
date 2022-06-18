import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import router from '../router';
const store = createStore({
  state() {
    return {
      currentUser: null,
      applications: null,
      previousPage: null,
    }
  },
  getters: {

  },
  mutations: {
    updateCurrentUser(state, data) {
      state.currentUser = { ...data };
    },
    updatePreviousPage(state, data) {
      state.applications = { ...data };
    },
    updateApplications(state, data) {
      state.applications = { ...data };
    },
    logout(state, data) {
      sessionStorage.clear();
      //localStorage.clear();
      state.currentUser = data;
      router.push("/");
    }
  },
  actions: {
    updateCurrentUser(context, data) {
      context.commit("updateCurrentUser", data);
    },
    updatePreviousPage(context, data) {
      context.commit("updatePreviousPage", data);
    },
    updateApplications(context, data) {
      context.commit("updateApplications", data);
    },
  },
  plugins: [createPersistedState()]

});

export default store;