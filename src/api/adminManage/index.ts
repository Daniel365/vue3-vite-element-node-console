/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-29 15:51:45
 * @Description: 登录、注册
 */

import alovaInstance from "@/utils/instance";
import { requestPath } from "../requestPath";
import type { RegisterProps, LoginProps, ResetPasswordProps } from "./data.d";

export default {
  // 登录
  onLogin(data: LoginProps): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ADMIN_LOGIN, data);
  },
  // 注册
  onRegister(data: RegisterProps): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ADMIN_REGISTER, data);
  },
  // 重置密码
  onResetPassword(data: ResetPasswordProps): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ADMIN_RESET_PASSWORD, data);
  },
  // 退出登录
  onLogout(): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ADMIN_LOGOUT);
  },
};
