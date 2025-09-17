/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 19:19:16
 * @Description: 网站公共配置
 */

import { defaultSettings } from "@/config";
import { store } from "@/store";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAppStore = defineStore("app", () => {
  // 语言
  const language = useStorage("language", defaultSettings.language);

  /**
   * 切换语言
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val;
  }

  return {
    language,
    changeLanguage,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useAppStoreHook() {
  return useAppStore(store);
}
