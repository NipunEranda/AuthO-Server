<template>
  <div class="container">
    <div class="row" style="padding-top: 150px; padding-bottom: 30px">
      <div class="col-12">
        <img class="login-logo" src="../assets/typefi_login.svg" />
      </div>
    </div>
    <div class="container">
      <div id="loginChoices">
        <center>
          <div
            class="btn btn-dark mb-2 pt-2 pb-2 pointer typefiLogin"
            @click="showTypefiLogin()"
          >
            Sign in with Typefi
          </div>
          <div id="googleBtn" style="margin: auto"></div>
        </center>
      </div>
      <center>
        <div id="loginDiv" style="display: none; width: 350px">
          <div class="form-group">
            <input
              type="email"
              class="form-control form-control-sm"
              id="email"
              placeholder="Email"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control form-control-sm"
              id="password"
              placeholder="Password"
            />
          </div>
          <div class="btn btn-info w-100 mb-2 pointer">LOGIN</div>
          <div
            class="btn btn-secondary w-100 pointer"
            @click="showLoginOptions()"
          >
            BACK
          </div>
        </div>
      </center>
    </div>
  </div>
</template>

<style>
.login-logo {
  width: 200px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}

.container {
  text-align: center;
  display: grid;
}

.typefiLogin {
  width: 250px;
}
</style>

<script>
import router from "../router";
import { useStore } from "vuex";
import { computed } from "vue";
import store from "../store";

export default {
  name: "HomeView",
  setup: () => {},
  data() {
    return {
      store: useStore(),
      user: computed(() => store.state.currentUser),
      api_url: process.env.VUE_APP_API_BASE_URL,
    };
  },
  methods: {
    showLoginOptions: function () {
      $("#loginChoices").show();
      $("#loginDiv").hide();
    },
    showTypefiLogin: function () {
      $("#loginChoices").hide();
      $("#loginDiv").show();
    },
  },
  mounted: function () {
    if (this.user) {
      if (this.user.token) this.$router.push("/home");
    } else {
      google.accounts.id.initialize({
        client_id:
          "74833185299-r3bqlaqa50gt6jtieidi09fsskvplclq.apps.googleusercontent.com",
        callback: onSignIn,
      });
      google.accounts.id.prompt();
      google.accounts.id.renderButton(document.getElementById("googleBtn"), {
        theme: "outline",
        size: "large",
        text: "signin_with",
        type: "standard",
        shape: "rectangle",
        logo_alignment: "left",
        width: "250",
      });

      function onSignIn(googleUser) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleUser.credential}`
          )
          .then((response) => {
            if (
              response.data.email.split("@")[
                response.data.email.split(".").length - 1
              ] === "typefi.com"
            ) {
              axios
                .post(
                  `${process.env.VUE_APP_API_BASE_URL}/user/google`,
                  response.data
                )
                .then((res) => {
                  if (!res.data.error) {
                    store.dispatch("updateCurrentUser", {
                      email: response.data.email,
                      name: response.data.name,
                      sub: response.data.sub,
                      token: res.data.data.token,
                      loggedIn: new Date(),
                    });
                    router.push(localStorage.getItem("previousPage") ? location.href=`${JSON.parse(localStorage.getItem("previousPage")).fullPath}` : "/home");
                  }
                });
            } else {
              router.push("/");
            }
          });
      }
    }
  },
};
</script>
