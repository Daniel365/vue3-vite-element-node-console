/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-31 11:08:45
 * @Description:
 */
import { store, usePermissionStoreHook } from "@/store";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { accountManageApi, adminManageApi } from "@/api";
// utils
import { ACCESS_TOKEN_KEY } from "@/constants";
import { Storage } from "@/utils/storage";
import { handleReturnResults } from "@/utils/instance";
// type
import { AccountInfo } from "@/api/accountManage/data.d";

export const useAccountStore = defineStore("account", () => {
  const accountInfo = useStorage<AccountInfo>("accountInfo", {} as AccountInfo);

  /**
   * 设置账号信息
   */
  function setAccountInfo(data: AccountInfo) {
    accountInfo.value = {
      ...accountInfo.value,
      ...data,
    };
  }
  /**
   * 获取登录用户信息
   *
   * @returns {AccountInfo} 用户信息
   */
  async function getAccountInfo() {
    const response = await accountManageApi.getAccountInfo();
    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        const data = res.data as AccountInfo;
        setAccountInfo(data);
      },
    });
  }

  /**
   * 重置用户状态
   * 仅处理用户模块内的状态
   */
  function resetAccountState() {
    // 重置用户信息
    accountInfo.value = {} as AccountInfo;
    // 清除token等认证信息
    Storage.remove(ACCESS_TOKEN_KEY);
  }

  /**
   * 重置所有系统状态
   * 统一处理所有清理工作，包括用户凭证、路由、缓存等
   */
  function resetAllState() {
    // 1. 重置用户状态
    resetAccountState();
    // 2.重置路由
    usePermissionStoreHook().resetRouter();

    return Promise.resolve();
  }
  /**
   * 退出登录
   */
  function onLogout() {
    return new Promise<void>((resolve, reject) => {
      adminManageApi
        .onLogout()
        .then(() => {
          // 重置所有系统状态
          resetAllState();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    accountInfo,
    setAccountInfo,
    getAccountInfo,
    onLogout,
    resetAllState,
  };
});

/**
 * 在组件外部使用AccountStore的钩子函数
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useAccountStoreHook() {
  return useAccountStore(store);
}
