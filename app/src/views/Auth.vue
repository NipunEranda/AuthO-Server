<template>
  <div>Loading</div>
</template>

<script>
import store from "../store";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  data() {
    return {
      store: useStore(),
      user: computed(() => store.state.currentUser),
    };
  },
  methods: {},
  mounted: async function () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);
    axios.get(`/.netlify/functions/auth/v1/authorize?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&state=${params.state}&user=${this.user.sub}`);
  },
};
</script>