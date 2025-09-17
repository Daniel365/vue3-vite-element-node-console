<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:11:40
 * @Description: 左侧菜单组件
-->
<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    theme="dark"
    @click="handleMenuClick"
  >
    <template v-for="menu in menuList" :key="menu.path">
      <MenuItem :menu="menu" />
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
// utils
import { isHasArrayData } from "@/utils/dataJudgment";
// type
import type { AccountMenu } from "@/api/accountManage/data.d";
import MenuItem from "./MenuItem.vue";

interface Props {
  menuList: AccountMenu[];
}

const props = defineProps<Props>();
const router = useRouter();
const route = useRoute();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

// 递归查找菜单路径，返回从根到目标的完整路径
function findMenuPath(
  menus: AccountMenu[],
  targetPath: string,
  parentPath: string[] = []
): string[] {
  if (isHasArrayData(menus)) {
    for (const menu of menus) {
      if (!menu.path) continue;

      const currentPath = [...parentPath, menu.path];

      if (menu.path === targetPath) {
        return currentPath;
      }

      if (menu.children?.length) {
        const childPath = findMenuPath(menu.children, targetPath, currentPath);
        if (childPath.length) {
          return childPath;
        }
      }
    }
  }

  return [];
}

// 设置当前选中和展开的菜单
function setCurrentMenu() {
  const currentPath = route.path;
  const menuPath = findMenuPath(props.menuList, currentPath);

  if (menuPath.length) {
    selectedKeys.value = [currentPath];
    openKeys.value = menuPath.slice(0, -1); // 展开除了当前选中项之外的所有父级
  } else {
    selectedKeys.value = []; // 当前路由不在菜单中时清空选中状态
  }
}

// 菜单点击事件
function handleMenuClick({ key }: { key: string }) {
  if (key === route.path) return; // 当前页面不重复跳转
  router.push(key);
}

// 监听路由变化
watch(() => route.path, setCurrentMenu, { immediate: true });

// 监听菜单数据变化
watch(() => props.menuList, setCurrentMenu, { deep: true });

onMounted(() => {
  setCurrentMenu();
});
</script>

<style scoped>
.ant-menu {
  border-right: none;
}
.anticon {
  font-size: 1.5rem;
}
</style>
