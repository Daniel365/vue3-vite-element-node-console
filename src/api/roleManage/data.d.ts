/*
 * @Author: 350296245@qq.com
 * @Date: 2025-09-01 20:22:14
 * @Description:
 */
/** 角色列表查询参数 */
export interface RoleListParams extends PageQuery {
  name?: string;
  status?: number;
}
/** 角色列表查询参数 */
export interface RoleListItem {
  uuid: string;
  code: string;
  createdAt: Date;
  description: string;
  menuIds: any[];
  name: string;
  status: 1;
  updatedAt: Date;
}

/** 角色创建参数 */
export interface RoleAddParams {
  name: string;
  code: string;
  description?: string;
  status?: number;
}

/** 角色编辑参数 */
export interface RoleEditParams extends RoleAddParams {
  uuid: string;
}
