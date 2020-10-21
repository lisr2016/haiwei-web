import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/screen',
    meta: { title: '报表', icon: 'el-icon-s-data' },
    children: [{
      path: 'screen',
      name: 'Screen',
      component: () => import('@/views/screen/index'),
      meta: { title: '数据大屏', icon: 'el-icon-s-marketing' }
    }, {
      path: 'summary',
      name: 'Summary',
      component: () => import('@/views/summary/index'),
      meta: { title: '数据汇总', icon: 'dashboard' }
    }, {
      path: 'list',
      name: 'List',
      component: () => import('@/views/reportList/index'),
      meta: { title: '报告详情', icon: 'el-icon-tickets' }
    }]
  },
  {
    path: '/inspect',
    component: Layout,
    redirect: '/inspect/index',
    name: 'Inspection',
    meta: {  title: '巡检考核', icon: 'el-icon-message-solid' },
    children: [
      {
        path: 'template',
        name: 'template',
        component: () => import('@/views/inspect/template'),
        meta: { title: '考核模板', icon: 'el-icon-tickets' }
      },
      {
        path: 'task',
        name: 'task',
        component: () => import('@/views/inspect/task'),
        meta: { title: '考核指派', icon: 'el-icon-s-help' }
      }
    ]
  },
  
  {
    path: '/orgList',
    component: Layout,
    redirect: '/orgList/index',
    meta: { icon: 'el-icon-s-grid' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/orgList/index'),
        meta: { title: '机构列表', icon: 'el-icon-s-home' }
      }
    ]
  },

  {
    path: '/userList',
    component: Layout,
    redirect: '/userList/index',
    meta: { icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/userList/index'),
        meta: { title: '用户列表', icon: 'el-icon-user-solid' }
      }
    ]
  },
  
  {
    path: '/file',
    component: Layout,
    redirect: '/fileList/index',
    meta: { icon: 'el-icon-folder' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/fileList/index'),
        meta: { title: '政策文件列表', icon: 'el-icon-upload' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  // mode: 'history'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
