<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:18:15
 * @Description: 布局顶部组件
-->
<template>
  <div class="layout-header-container">
    <div class="header-left">
      <Breadcrumb />
    </div>

    <div class="header-right">
      <!-- 语言切换 -->
      <a-dropdown>
        <a-button type="text" class="header-btn">
          <GlobalOutlined />
        </a-button>
        <template #overlay>
          <a-menu @click="({ key }) => onLanguageChange(key)">
            <a-menu-item :key="LanguageEnum.ZH">{{
              $t("common.zh")
            }}</a-menu-item>
            <a-menu-item :key="LanguageEnum.EN">{{
              $t("common.en")
            }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- 用户信息 -->
      <a-dropdown>
        <a-button type="text" class="header-btn user-btn">
          <UserOutlined />
          <span class="username">{{ accountInfo.username }}</span>
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item
              key="userCenter"
              @click="goToPage(RouterPath.ACCOUNT_PROFILE)"
            >
              <UserOutlined />
              {{ $t("common.userCenter") }}
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <LogoutOutlined />
              {{ $t("common.logout") }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { useAppStore, useAccountStore } from "@/store";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
import { useRouteUtil } from "@/hooks/route";
// type
import { LanguageEnum } from "@/enums";
import { RouterPath } from "@/router/data.d";
// components
import Breadcrumb from "../Breadcrumb/index.vue";

const appStore = useAppStore();
const accountStore = useAccountStore();

const { route, goToPage } = useRouteUtil();
const { locale } = useI18nUtil();

// 用户信息
const accountInfo = computed(() => accountStore.accountInfo);

const onLanguageChange = (val: string) => {
  locale.value = val;
  appStore.changeLanguage(val);
};

const handleLogout = () => {
  accountStore.onLogout().then(() => {
    goToPage(`${RouterPath.LOGIN}?redirect=${route.fullPath}`);
  });
};
</script>

<style lang="less" scoped>
.layout-header-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  .header-btn {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .header-btn:hover {
    background-color: #f5f5f5;
  }

  .user-btn {
    gap: 8px;
  }

  .username {
    font-size: 14px;
    color: #333;
  }
}
</style>
