/*
 * @Author: 350296245@qq.com
 * @Date: 2025-09-07 19:52:13
 * @Description: 配置项
 */
import { FormTypeEnum } from "@/enums";
import { MenuTypeEnum, MenuVisibleStatusEnum } from "./types";
import { buttonPermissionOptions, menuTypeOptions, menuVisibleStatusOptions } from "./options";

// 默认表单
export const defaultFormData = {
  id: 0,
  parentId: 0,
  name: "",
  type: MenuTypeEnum.CATALOG,
  routeName: "",
  routePath: "",
  component: "Layout",
  visibleStatus: MenuVisibleStatusEnum.SHOW,
  keepAlive: 0,
  sort: 0,
  icon: "",
  permission: "",
};

// 表单字段配置
export const formFieldsConfig: Record<any, FormFieldConfig[]> = {
  // 公共字段 - 所有类型都需要
  common: [
    {
      key: "parentId",
      labelKey: "form.parentMenu",
      type: FormTypeEnum.TREE_SELECT,
      required: false,
      order: 1,
    },
    {
      key: "name",
      labelKey: "form.menuName",
      type: FormTypeEnum.INPUT,
      required: true,
      order: 2,
    },
    {
      key: "type",
      labelKey: "form.menuType",
      type: FormTypeEnum.RADIO_GROUP,
      required: true,
      options: menuTypeOptions,
      order: 3,
    },
    {
      key: "sort",
      labelKey: "form.sort",
      type: FormTypeEnum.INPUT_NUMBER,
      required: true,
      order: 99,
    },
    {
      key: "visibleStatus",
      labelKey: "form.visibleStatus",
      type: FormTypeEnum.RADIO_GROUP,
      required: false,
      options: menuVisibleStatusOptions,
      order: 98,
    },
  ],

  // 目录特有字段
  [MenuTypeEnum.CATALOG]: [
    {
      key: "routePath",
      labelKey: "form.routePath",
      type: FormTypeEnum.INPUT,
      required: true,
      order: 5,
    },
    {
      key: "icon",
      labelKey: "form.icon",
      type: FormTypeEnum.CUSTOM,
      required: false,
      order: 10,
    },
  ],

  // 菜单特有字段
  [MenuTypeEnum.MENU]: [
    {
      key: "routeName",
      labelKey: "form.routeName",
      type: FormTypeEnum.INPUT,
      required: true,
      order: 4,
      helpTips: "UserMange || UserMangeList",
    },
    {
      key: "routePath",
      labelKey: "form.routePath",
      type: FormTypeEnum.INPUT,
      required: true,
      order: 5,
      helpTips: "/system/userMange/list",
    },
    {
      key: "component",
      labelKey: "form.component",
      type: FormTypeEnum.INPUT,
      inputPrepend: "src/views/",
      inputAppend: ".vue",
      required: true,
      order: 6,
    },
    {
      key: "icon",
      labelKey: "form.icon",
      type: FormTypeEnum.CUSTOM,
      required: false,
      order: 10,
    },
  ],

  // 按钮特有字段
  [MenuTypeEnum.BUTTON]: [
    {
      key: "permission",
      labelKey: "form.permission",
      type: FormTypeEnum.SELECT,
      options: buttonPermissionOptions,
      required: true,
      order: 4,
    },
  ],

  // 接口特有字段
  [MenuTypeEnum.API]: [
    {
      key: "permission",
      labelKey: "form.permission",
      type: FormTypeEnum.SELECT,
      options: buttonPermissionOptions,
      required: true,
      order: 4,
    },
  ],

  // 外链特有字段
  [MenuTypeEnum.EXTERNAL]: [
    {
      key: "routePath",
      labelKey: "form.externalLink",
      type: FormTypeEnum.INPUT,
      required: true,
      order: 4,
    },
    {
      key: "icon",
      labelKey: "form.icon",
      type: FormTypeEnum.CUSTOM,
      required: false,
      order: 10,
    },
  ],
};

// 获取当前类型需要显示的字段
export const getFormFields = (type: number) => {
  const commonFields = formFieldsConfig.common;
  const typeFields = formFieldsConfig[type as keyof typeof formFieldsConfig] || [];
  return [...commonFields, ...typeFields].sort((a, b) => a.order - b.order);
};
