/*
 * @Author: 350296245@qq.com
 * @Date: 2025-09-01 20:22:21
 * @Description: 角色管理
 */

import alovaInstance from "@/utils/instance";
import { requestPath } from "../requestPath";
import { RoleAddParams, RoleEditParams, RoleListParams } from "./data.d";

export default {
  // 获取角色列表
  getList(data: RoleListParams): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ROLE_LIST, data);
  },
  // 新增角色
  onCreate(data: RoleAddParams): Promise<InterfaceResult> {
    return alovaInstance.Post(requestPath.ROLE_CREATE, data);
  },
  // 编辑角色
  onEdit(data: RoleEditParams): Promise<InterfaceResult> {
    return alovaInstance.Put(requestPath.ROLE_UPDATE, data);
  },
  // 分配权限
  onAssignPerm(data: {
    uuid: string;
    menuIds: any[];
  }): Promise<InterfaceResult> {
    return alovaInstance.Put(requestPath.ROLE_ASSIGN_PERM, data);
  },
  // 删除角色
  onDelete(data: { uuid: string }): Promise<InterfaceResult> {
    return alovaInstance.Delete(requestPath.ROLE_DELETE, data);
  },
};
