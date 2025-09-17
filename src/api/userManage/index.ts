/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-28 21:05:51
 * @Description: 用户管理
 */
import alovaInstance from "@/utils/instance";
import { requestPath } from "../requestPath";
import { UserEditParams, UserListParams } from "./data.d";

export default {
  // 获取用户列表
  getList(data: UserListParams): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.USER_LIST, data);
  },
  // 编辑用户
  onEdit(data: UserEditParams): Promise<InterfaceResult> {
    return alovaInstance.Put(requestPath.USER_UPDATE, data);
  },
  // 删除用户
  onDelete(data: { uuid: string }): Promise<InterfaceResult> {
    return alovaInstance.Delete(requestPath.USER_DELETE, data);
  },
};
