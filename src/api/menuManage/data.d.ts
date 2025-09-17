import { MenuTypeEnum } from "@/views/menuManage/utils/types";

/** 菜单列表查询参数 */
export interface MenuListParams {
  name?: string;
  type?: MenuTypeEnum;
  visible_status?: number;
}

/** 菜单列表 */
export interface MenuListItem {
  /** 菜单ID */
  id: number;
  /** 父级菜单ID */
  parentId: number;
  /** 菜单名称 */
  name: string;
  /** 菜单类型 1:目录 2:菜单 3:按钮 4:接口 5:外链 */
  type: number;
  /** 路由名称 */
  routeName: string;
  /** 路由相对路径 src/views/**.vue*/
  routePath: string;
  /** 组件路径 */
  component: string;
  /** 显示状态 0: 隐藏 1：显示 */
  visibleStatus: number;
  /** 缓存页面 0: 关闭 1：开启 */
  keepAlive: number;
  /** 菜单排序(数字越小排名越靠前) */
  sort: number;
  /** 图标 */
  icon: string;
  /** 权限标识 */
  permission: string;
  /** 子菜单 */
  children?: MenuListItem[];
}

/** 树形列表 */
export interface TreeListItem {
  label: string;
  value: number;
  children: TreeListItem[];
}

/** 菜单表单 */
export interface MenuFormProps {
  id?: number;
  /** 父级菜单ID */
  parentId?: number;
  /** 菜单名称 */
  name: string;
  /** 菜单类型 1:目录 2:菜单 3:按钮 4:接口 5:外链 */
  type: number;
  routeName?: string;
  routePath?: string;
  component?: string;
  /** 显示状态 0: 隐藏 1：显示 */
  visibleStatus?: number;
  /** 缓存页面 0: 关闭 1：开启 */
  keepAlive?: number;
  /** 排序 */
  sort: number;
  /** 图标 */
  icon?: string;
  /** 权限标识 */
  permission?: string;
}
