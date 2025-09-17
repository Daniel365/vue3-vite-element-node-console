import { RouterPath } from "./data.d";

export default [
  {
    path: RouterPath.LOGIN,
    component: () => import("@/views/admin/login/index.vue"),
  },
  {
    path: RouterPath.REGISTER,
    component: () => import("@/views/admin/register/index.vue"),
  },
  {
    path: RouterPath.FORGOT_PASSWORD,
    component: () => import("@/views/admin/forgotPassword/index.vue"),
  },
];
