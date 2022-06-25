<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link class="navbar-brand" href="#" to="/home">
      <img
        src="../assets/favicon.png"
        width="30"
        height="30"
        class="d-inline-block align-top"
        alt=""
      />
      Auth Portal
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <router-link class="nav-item" to="/applications"><a class="nav-link" href="#">Applications</a></router-link>
      </ul>
      <ul class="navbar-nav d-flex ml-auto">
        <router-link class="nav-item" to="/home"><a class="nav-link" href="#">{{ (user) ? user.name : "" }}</a></router-link>
        <li class="nav-item">
          <a
            class="nav-link"
            aria-current="page"
            @click="$store.commit('logout', null)"
            style="cursor: pointer"
            >Logout</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import store from '../store';
import { computed } from 'vue';
import { useStore } from "vuex";
export default {
  data() {
    return {
      store: useStore(),
      user: computed(() => store.state.currentUser),
    };
  },
  watch: {
    user: function () {
      if (!this.user) this.$router.push("/");
    }
  },
  methods: {
  },
};
</script>