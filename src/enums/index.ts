/**
 * 响应码枚举
 */
export const enum ResultCodeEnum {
  /**
   * 成功
   */
  SUCCESS = "0",
  /**
   * 错误
   */
  ERROR = "1",
}

/** 语言 */
export enum LanguageEnum {
  ZH = "zh_CN",
  EN = "en_US",
}

/** 操作方式 */
export enum ActionTypeEnum {
  CREATE = "create",
  COPY = "copy",
  EDIT = "edit",
  DETAIL = "detail",
}

/** 表单类型枚举 */
export enum FormTypeEnum {
  INPUT = "input",
  INPUT_NUMBER = "inputNumber",
  TEXT_AREA = "textArea",
  SELECT = "select",
  TREE_SELECT = "TreeSelect",
  RADIO_GROUP = "radioGroup",
  CHECKBOX_GROUP = "checkboxGroup",
  DATE_PICKER = "datePicker",
  TIME_PICKER = "timePicker",
  SWITCH = "switch",
  UPLOAD = "upload",
  CUSTOM = "custom",
}

/**
 * 菜单布局枚举
 */
export const enum LayoutMode {
  /**
   * 左侧菜单布局
   */
  LEFT = "left",
  /**
   * 顶部菜单布局
   */
  TOP = "top",

  /**
   * 混合菜单布局
   */
  MIX = "mix",
}

/**
 * 侧边栏状态枚举
 */
export const enum SidebarStatus {
  /**
   * 展开
   */
  OPENED = "opened",

  /**
   * 关闭
   */
  CLOSED = "closed",
}

/**
 * 设备枚举
 */
export const enum DeviceEnum {
  /**
   * 宽屏设备
   */
  DESKTOP = "desktop",

  /**
   * 窄屏设备
   */
  MOBILE = "mobile",
}

/**
 * 组件尺寸枚举
 */
export const enum ComponentSize {
  /**
   * 默认
   */
  DEFAULT = "default",

  /**
   * 大型
   */
  LARGE = "large",

  /**
   * 小型
   */
  SMALL = "small",
}

/**
 * 主题枚举
 */
export const enum ThemeMode {
  /**
   * 明亮主题
   */
  LIGHT = "light",
  /**
   * 暗黑主题
   */
  DARK = "dark",

  /**
   * 系统自动
   */
  AUTO = "auto",
}

/**
 * 侧边栏配色方案枚举
 */
export const enum SidebarColor {
  /**
   * 经典蓝
   */
  CLASSIC_BLUE = "classic-blue",
  /**
   * 极简白
   */
  MINIMAL_WHITE = "minimal-white",
}
