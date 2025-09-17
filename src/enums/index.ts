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
