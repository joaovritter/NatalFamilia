import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import FormView from '../views/FormView.vue';
import SucessView from '../views/SucessView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingPage.vue')
    },
    {
      path: '/modelo',
      name: 'model-home',
      component: HomeView
    },

    {
      path: '/configurar',
      name: 'configure',
      component: FormView
    },
    {
      path: '/sucesso/:familyName',
      name: 'success',
      component: SucessView
    },
    {
      path: '/familia/:familyName',
      name: 'personalized',
      component: HomeView
    }
  ]
});

export default router;
