<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:18:15
 * @Description: layout容器
-->
<template>
  <a-layout class="layout-container">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <Logo :collapsed="collapsed" />
      <LeftMenu :menu-list="menuList" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <LayoutHeader />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <LayoutContent />
      </a-layout-content>
      <a-layout-footer class="layout-footer">
        <LayoutFooter />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { usePermissionStore } from "@/store";
// type
import { AccountMenu } from "@/api/accountManage/data.d";
// components
import LeftMenu from "./components/Menu/index.vue";
import LayoutHeader from "./components/Header/index.vue";
import LayoutContent from "./components/Content/index.vue";
import LayoutFooter from "./components/Footer/index.vue";

const permissionStore = usePermissionStore();

const collapsed = ref<boolean>(false);

// 菜单数据
const menuList: AccountMenu[] = computed(() => permissionStore.routes);
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}
.layout-header {
  height: 50px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>
