import * as vueRouter from 'vue-router';

const _routes: Array<vueRouter.RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    name: 'home'
  },
  {
    path: '/demo',
    component: () => import('@/views/DemoPage.vue'),
    name: 'demo'
  }
]

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: _routes
})


export default router