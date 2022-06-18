<template>
  <div>
    <div class="container-loader hidden"><div class="loader"></div></div>
    <Header v-if="showHeader" />
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import store from './store';
import { computed } from 'vue';
import { useStore } from "vuex";

export default {
  data() {
    return {
      store: useStore(),
      user: computed(() => store.state.currentUser),
      showHeader: false,
    };
  },
  watch: {
    $route: function (to, from) {
      if (to.name === "index" || to.name === "auth") this.showHeader = false;
      else this.showHeader = true;
    },
  },
  components: {
    Header,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.nav-item {
  text-decoration: none !important;
}

@import url("./assets/css/index.css");
</style>