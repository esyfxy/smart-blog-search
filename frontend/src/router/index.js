import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../store'

const routes = [
  {
    path: '/',
    component: () => import('../components/home.vue'),
    children: [{
      path: "",
      name: "index",
      component: () => import('../components/index.vue')
    }, {
      path: "sort",
      name: "sort",
      component: () => import('../components/sort.vue')
    }, {
      path: "article",
      name: "article",
      component: () => import('../components/article.vue')
    }, {
      path: "weiYan",
      name: "weiYan",
      component: () => import('../components/weiYan.vue')
    }, {
      path: "message",
      name: "message",
      component: () => import('../components/message.vue')
    }, {
      path: "friend",
      name: "friend",
      component: () => import('../components/friend.vue')
    },{
      path: "bangumi",
      name: "bangumi",
      component: () => import('../components/bangumi.vue')
    },{
      path: "izone",
      name: "izone",
      component: () => import('../components/izone.vue')
    },{
      path: "album",
      name: "album",
      component: () => import('../components/album.vue')
    }, {
      path: "about",
      name: "about",
      component: () => import('../components/about.vue')
    }, {
      path: "user",
      name: "user",
      component: () => import('../components/user.vue')
    }, {
      path: "letter",
      name: "letter",
      component: () => import('../components/letter.vue')
    },{
      path: "calendar",
      name: "calendar",
      component: () => import('../components/calendar.vue')
    },{
      path: "favorite",
      name: "favorite",
      component: () => import('../components/favorite.vue')
    },
    // {
    //   path: "love",
    //   name: "love",
    //   component: () => import('../components/love.vue')
    // }
  ]
  },
  {
    // 微前端入口点 - 所有/admin开头的路径都由微应用处理
    path: '/admin/:pathMatch(.*)*',
    name: 'Admin',
    component: () => import('../views/AdminEntry.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/user.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('../components/user.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 博客系统'
  }
  
  if (to.meta.requiresAuth) {
    const store = useMainStore()
    const isLoggedIn = store.currentUser && store.currentUser.id
    
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
