import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import FormView from '../views/FormView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/configurar',
      name: 'configure',
      component: FormView
    },
    {
      path: '/familia/:familyName',
      name: 'personalized',
      component: HomeView
    }
  ]
});

export default router;
