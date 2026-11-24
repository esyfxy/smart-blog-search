// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/admin/verify.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/main',
    name: 'AdminLayout',
    component: () => import('../components/admin/admin.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Main',
        component: () => import('../components/admin/main.vue'),
        meta: { 
          title: '系统首页',
          requiresAuth: true
        }
      },
      {
        path: '/FlexiSite',
        name: 'FlexiSite',
        component: () => import('../components/admin/FlexiSite.vue'),
        meta: { 
          title: 'FlexiSite',
          requiresAuth: true
        }
      },
      {
        path: '/webEdit',
        name: 'WebEdit',
        component: () => import('../components/admin/webEdit.vue'),
        meta: { 
          title: '网站设置',
          requiresAuth: true
        }
      },
      {
        path: '/userList',
        name: 'UserList',
        component: () => import('../components/admin/userList.vue'),
        meta: { 
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: '/postList',
        name: 'PostList',
        component: () => import('../components/admin/postList.vue'),
        meta: { 
          title: '文章管理',
          requiresAuth: true
        }
      },
      {
        path: '/postShuoshuo',
        name: 'PostShuoshuo',
        component: () => import('../components/admin/postShuoshuo.vue'),
        meta: { 
          title: '动态管理',
          requiresAuth: true
        }
      },
      {
        path: '/postEdit',
        name: 'PostEdit',
        component: () => import('../components/admin/postEdit.vue'),
        meta: { 
          title: '文章编辑',
          requiresAuth: true
        }
      },
      {
        path: '/sortList',
        name: 'SortList',
        component: () => import('../components/admin/sortList.vue'),
        meta: { 
          title: '分类管理',
          requiresAuth: true
        }
      },
      {
        path: '/commentList',
        name: 'CommentList',
        component: () => import('../components/admin/commentList.vue'),
        meta: { 
          title: '评论管理',
          requiresAuth: true
        }
      },
      {
        path: '/treeHoleList',
        name: 'TreeHoleList',
        component: () => import('../components/admin/treeHoleList.vue'),
        meta: { 
          title: '留言管理',
          requiresAuth: true
        }
      },
      {
        path: '/resourceList',
        name: 'ResourceList',
        component: () => import('../components/admin/resourceList.vue'),
        meta: { 
          title: '资源管理',
          requiresAuth: true
        }
      },
      {
        path: '/resourcePathList',
        name: 'ResourcePathList',
        component: () => import('../components/admin/resourcePathList.vue'),
        meta: { 
          title: '资源路径管理',
          requiresAuth: true
        }
      },
      {
        path: '/cosConfigList',
        name: 'CosConfigList',
        component: () => import('../components/admin/cosConfigList.vue'),
        meta: { 
          title: '云存储配置',
          requiresAuth: true
        }
      },
      {
        path: '/adminInit',
        name: 'AdminInit',
        component: () => import('../components/admin/adminLogin.vue'),
        meta: { 
          title: '初始化超级管理员'
        }
      }
    ]
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue'),
    meta: { title: '404' }
  }
];

export { routes };
export default routes; 

// 路由守卫函数 - 可以被外部使用
export function setupRouterGuards(router, store) {
  router.beforeEach((to, from, next) => {
    // 获取Auth Center token
    const authToken = localStorage.getItem('userToken');
    // 获取旧版token（兼容）
    const userToken = localStorage.getItem('userToken');
    
    // 如果是登录页面，直接放行
    if (to.path === '/login') {
      next();
      return;
    }
    
    // 如果没有token，重定向到登录页
    if (!authToken && !userToken) {
      next('/login');
      return;
    }
    
    // 其他情况放行
    next();
  });
} 