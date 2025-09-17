/*
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 22:34:36
 * @Description: 选项
 */
import { requestPath } from "@/api/requestPath";
import { MenuTypeEnum, MenuVisibleStatusEnum } from "./types";

export const menuTypeOptions = [
  {
    label: "目录",
    labelKey: "menuManage.catalog",
    value: MenuTypeEnum.CATALOG,
    color: "blue",
  },
  {
    label: "菜单",
    labelKey: "menuManage.menu",
    value: MenuTypeEnum.MENU,
    color: "green",
  },
  {
    label: "按钮",
    labelKey: "menuManage.button",
    value: MenuTypeEnum.BUTTON,
    color: "orange",
  },
  {
    label: "接口",
    labelKey: "menuManage.interface",
    value: MenuTypeEnum.API,
    color: "purple",
  },
  {
    label: "外链",
    labelKey: "menuManage.externalLink",
    value: MenuTypeEnum.EXTERNAL,
    color: "cyan",
  },
];

/**菜单显示隐藏 */
export const menuVisibleStatusOptions = [
  {
    label: "显示",
    labelKey: "form.show",
    value: MenuVisibleStatusEnum.SHOW,
    color: "green",
  },
  {
    label: "隐藏",
    labelKey: "form.hide",
    value: MenuVisibleStatusEnum.HIDE,
    color: "red",
  },
];

/** 按钮权限标识 */
export const buttonPermissionOptions = [
  {
    label: "用户编辑",
    labelKey: "perm.user.edit",
    value: requestPath.USER_UPDATE,
  },
  {
    label: "用户删除",
    labelKey: "perm.user.delete",
    value: requestPath.USER_DELETE,
  },
  {
    label: "角色创建",
    labelKey: "perm.role.create",
    value: requestPath.ROLE_CREATE,
  },
  {
    label: "角色编辑",
    labelKey: "perm.role.edit",
    value: requestPath.ROLE_UPDATE,
  },
  {
    label: "角色删除",
    labelKey: "perm.role.delete",
    value: requestPath.ROLE_DELETE,
  },
  {
    label: "菜单创建",
    labelKey: "perm.menu.create",
    value: requestPath.MENU_CREATE,
  },
  {
    label: "菜单编辑",
    labelKey: "perm.menu.edit",
    value: requestPath.MENU_UPDATE,
  },
  {
    label: "菜单删除",
    labelKey: "perm.menu.delete",
    value: requestPath.MENU_DELETE,
  },
];
