/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 20:10:39
 * @Description: 国际化
 */

import type { App } from "vue";
import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/store";
import { LanguageEnum } from "@/enums";
// 本地语言包
import enLocale from "./en";
import zhLocale from "./zh";

const appStore = useAppStoreHook();

const messages = {
  [LanguageEnum.ZH]: {
    ...zhLocale,
  },
  [LanguageEnum.EN]: {
    ...enLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages,
  globalInjection: true,
});

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
