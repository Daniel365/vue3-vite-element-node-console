/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 19:26:00
 * @Description: 系统设置
 */
import { LanguageEnum } from "@/enums";
const { pkg } = { pkg: { name: "", version: "" } }; //__APP_INFO__;

export const defaultSettings: AppSettings = {
  // 系统Title
  title: pkg.name,
  // 系统版本
  version: pkg.version,
  // 语言
  language: LanguageEnum.ZH,
};
