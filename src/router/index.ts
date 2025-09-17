/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:27:04
 * @Description:
 */
/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:27:04
 * @Description: 路由初始化
 */

import type { App } from "vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import admin from "./admin";
import { RouterPath } from "./data.d";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    redirect: RouterPath.HONE,
    component: import("@/layouts/index.vue"),
    children: [
      {
        path: RouterPath.HONE,
        name: "首页",
        component: () => import("@/views/home/index.vue"),
      },
      // {
      //   path: RouterPath.ROLE_MANAGE_LIST,
      //   name: "角色管理",
      //   component: () => import("@/views/roleManage/list.vue"),
      // },
      // {
      //   path: RouterPath.MENU_MANAGE_LIST,
      //   name: "菜单管理",
      //   component: () => import("@/views/menuManage/list.vue"),
      // },
      {
        path: "/404",
        component: () => import("@/views/errorPage/404.vue"),
        meta: { hidden: true },
      },
      {
        path: RouterPath.ACCOUNT_PROFILE,
        name: "个人中心",
        component: () => import("@/views/account/profile.vue"),
      },
    ],
  },

  ...admin,
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
