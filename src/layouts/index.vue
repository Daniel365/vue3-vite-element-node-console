<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:18:15
 * @Description: layout容器
-->
<template>
  <el-container class="layout-container">
    <el-aside :width="collapsed ? '64px' : '200px'" class="layout-aside">
      <Logo :collapsed="collapsed" />
      <LeftMenu :menu-list="menuList" />
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <div class="collapse-btn" @click="collapsed = !collapsed">
          <el-icon>
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
        </div>
        <LayoutHeader />
      </el-header>
      <el-main class="layout-content">
        <LayoutContent />
      </el-main>
      <el-footer class="layout-footer">
        <LayoutFooter />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { Fold, Expand } from "@element-plus/icons-vue";
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

.layout-aside {
  background: #001529;
  transition: width 0.2s;
  position: relative;
}

.collapse-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: white;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.layout-header {
  height: 50px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.layout-content {
  background: #f0f2f5;
}

.layout-footer {
  background: #fff;
  text-align: center;
  padding: 12px;
}
</style>
