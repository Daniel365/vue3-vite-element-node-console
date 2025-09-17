/*
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 15:11:11
 * @Description: 账号相关
 */

import alovaInstance from "@/utils/instance";
import { requestPath } from "../requestPath";
import type {
  AccountInfo,
  AccountMenu,
  EditPasswordProps,
  EditProfileProps,
} from "./data.d";

export default {
  // 修改密码
  editPassword(data: EditPasswordProps): Promise<InterfaceResult> {
    return alovaInstance.Put(requestPath.ACCOUNT_EDIT_PASSWORD, data);
  },
  // 编辑个人资料
  editProfile(data: EditProfileProps): Promise<InterfaceResult> {
    return alovaInstance.Put(requestPath.ACCOUNT_EDIT_PROFILE, data);
  },
  // 获取当前账号信息
  getAccountInfo(): Promise<InterfaceResult<AccountInfo>> {
    return alovaInstance.Get(requestPath.ACCOUNT_GET_ACCOUNT_INFO);
  },
  // 获取当前账号信息
  getAccountMenu(): Promise<InterfaceResult<{ list: AccountMenu[] }>> {
    return alovaInstance.Get(requestPath.ACCOUNT_GET_ACCOUNT_MENU);
  },
};
