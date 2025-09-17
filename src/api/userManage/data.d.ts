/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-28 21:05:51
 * @Description: 用户管理
 */
/** 用户列表查询参数 */
export interface UserListParams extends PageQuery {
  username?: string;
  email?: string;
  status?: number;
}

/** 用户数据结构 */
export interface UserListItem {
  uuid: string;
  username: string;
  email: string;
  status: number;
  role_uuid: string;
  created_at: string;
  updated_at: string;
}

/** 用户编辑参数 */
export interface UserEditParams {
  uuid: string;
  username: string;
  role_uuid: string;
}
