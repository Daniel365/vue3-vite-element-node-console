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
      <el-dropdown @command="onLanguageChange">
        <el-button text class="header-btn">
          <el-icon><Goblet /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="LanguageEnum.ZH">{{ $t("common.zh") }}</el-dropdown-item>
            <el-dropdown-item :command="LanguageEnum.EN">{{ $t("common.en") }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 用户信息 -->
      <el-dropdown @command="handleUserMenuClick">
        <el-button text class="header-btn user-btn">
          <el-icon><User /></el-icon>
          <span class="username">{{ accountInfo.username }}</span>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="userCenter">
              <el-icon><User /></el-icon>
              {{ $t("common.userCenter") }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ $t("common.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Goblet, User, SwitchButton } from "@element-plus/icons-vue";
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

const handleUserMenuClick = (command: string) => {
  if (command === "userCenter") {
    goToPage(RouterPath.ACCOUNT_PROFILE);
  } else if (command === "logout") {
    handleLogout();
  }
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
