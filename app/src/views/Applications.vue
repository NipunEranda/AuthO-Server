<template>
  <div>
    <div class="container pt-3 pl-2 pr-2">
      <div class="row operations p-0 m-0 mb-3">
        <div class="col col-2 pl-0 pr-0">
          <button class="btn btn-sm btn-primary add-btn w-100 pointer">
            <i class="fa fa-plus"></i> Add Project
          </button>
        </div>
      </div>
      <div class="row p-0 m-0">
        <table class="table table-borderless table-hover table-sm">
          <thead class="bg-dark" style="color: white; text-align: left">
            <tr>
              <th class="col-3">Application</th>
              <th class="col-2">Status</th>
              <th class="col-2">Created</th>
              <th class="col-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr class="pointer" v-for="(application, a) in applications" :key="a">
              <td class="col-3 text-left" v-html="`${application.name}<br/>${application.apiKey}`"></td>
              <td class="col-2 text-left" v-text="application.isActive === 1 ? 'active' : 'inactive'"></td>
              <td class="col-2 text-left" v-text="dateFormat(application.created, 'YYYY-MM-DD')"></td>
              <td class="col-2 text-left" v-text="dateFormat(application.updated, 'YYYY-MM-DD')"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
import { computed } from "vue";
import { useStore } from "vuex";
import helper from "../mixin/helper";
export default {
  data() {
    return {
      store: useStore(),
      user: computed(() => store.state.currentUser),
      applications: null,
    };
  },
  methods: {
    getApplications: function () {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/application/all`, {
          headers: {
            Authroization: `bearer ${this.user.token.toString()}`,
          },
        })
        .then((response) => {
          store.dispatch("updateApplications", response.data.data);
          this.applications = helper.methods.objectToArray(computed(() => store.state.applications).value);
        });
    },
    dateFormat: function(date, format){
        return helper.methods.dateFormat(date, format);
    }
  },
  mounted: function(){
      this.getApplications();
  }
};
</script>