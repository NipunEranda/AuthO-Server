import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Home from '../views/Home.vue';
import Auth from '../views/Auth.vue';
import Applications from '../views/Applications.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  {
    path: '/applications',
    name: 'applications',
    component: Applications
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to, from) => {
    if(to.name !== "index")
      localStorage.setItem('previousPage', JSON.stringify(to));
    if (!store.state.currentUser && to.name !== "index")
      return '/';
    if (store.state.currentUser) {
      if (((new Date() - new Date(store.state.currentUser.loggedIn)) / (1000 * 60 * 60)) > 6) {
        store.commit("logout", null);
      }
    }
});

export default router
