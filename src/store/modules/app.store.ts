/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 19:19:16
 * @Description: 网站公共配置
 */

import { defaultSettings } from "@/config";
import { store } from "@/store";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { DeviceEnum, SidebarStatus } from "@/enums";

export const useAppStore = defineStore("app", () => {
  // 设备类型
  const device = useStorage("device", DeviceEnum.DESKTOP);
  // 语言
  const language = useStorage("language", defaultSettings.language);
  // 侧边栏状态
  const sidebarStatus = useStorage("sidebarStatus", SidebarStatus.CLOSED);
  const sidebar = reactive({
    opened: sidebarStatus.value === SidebarStatus.OPENED,
    withoutAnimation: false,
  });

  // 顶部菜单激活路径
  const activeTopMenuPath = useStorage("activeTopMenuPath", "");
  /**
   * 切换语言
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val;
  }

  // 切换侧边栏
  function toggleSidebar() {
    sidebar.opened = !sidebar.opened;
    sidebarStatus.value = sidebar.opened ? SidebarStatus.OPENED : SidebarStatus.CLOSED;
  }

  // 关闭侧边栏
  function closeSideBar() {
    sidebar.opened = false;
    sidebarStatus.value = SidebarStatus.CLOSED;
  }

  // 打开侧边栏
  function openSideBar() {
    sidebar.opened = true;
    sidebarStatus.value = SidebarStatus.OPENED;
  }

  return {
    device,
    language,
    sidebar,
    sidebarStatus,
    activeTopMenuPath,
    changeLanguage,
    toggleSidebar,
    closeSideBar,
    openSideBar,
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
