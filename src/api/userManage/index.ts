/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-28 21:05:51
 * @Description: 用户管理API接口
 */
import alovaInstance from "@/utils/instance";
import { requestPath } from "../requestPath";
import type {
  UserEditParams,
  UserListParams,
  UserListItem,
  UserCreateParams,
  UserDeleteParams,
} from "./data.d";

/**
 * 用户管理API接口集合
 */
export default {
  /**
   * 获取用户列表
   * @param data 查询参数
   * @returns 用户列表数据
   */
  getList(data: UserListParams): Promise<InterfaceResult<PageResult<UserListItem>>> {
    return alovaInstance.Post(requestPath.USER_LIST, data);
  },

  /**
   * 编辑用户信息
   * @param data 编辑参数
   * @returns 操作结果
   */
  onEdit(data: UserEditParams): Promise<InterfaceResult<UserListItem>> {
    return alovaInstance.Put(requestPath.USER_UPDATE, data);
  },

  /**
   * 创建新用户
   * @param data 创建参数
   * @returns 操作结果
   */
  // onCreate(data: UserCreateParams): Promise<InterfaceResult<UserListItem>> {
  //   return alovaInstance.Post(requestPath.USER_CREATE, data);
  // },

  /**
   * 删除用户
   * @param data 删除参数
   * @returns 操作结果
   */
  onDelete(data: UserDeleteParams): Promise<InterfaceResult<null>> {
    return alovaInstance.Delete(requestPath.USER_DELETE, data);
  },
};
