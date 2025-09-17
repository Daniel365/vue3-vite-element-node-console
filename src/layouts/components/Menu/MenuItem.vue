<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:11:40
 * @Description: 菜单项递归渲染组件
-->
<template>
  <!-- 没有path的菜单不显示 -->
  <template v-if="menu.path">
    <!-- 有子菜单的情况 -->
    <a-sub-menu v-if="hasChildren" :key="menu.path">
      <template #title>
        <MenuContent :meta="meta" />
      </template>
      <template v-for="child in validChildren" :key="child.path">
        <MenuItem :menu="child" />
      </template>
    </a-sub-menu>

    <!-- 无子菜单的情况 -->
    <a-menu-item v-else :key="menu.path">
      <MenuContent :meta="meta" />
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AccountMenu } from "@/api/accountManage/data.d";
import MenuContent from "./MenuContent.vue";

interface Props {
  menu: AccountMenu;
}

const props = defineProps<Props>();

const meta = computed(() => {
  return props.menu.meta;
});

// 判断是否有有效的子菜单（有path的子菜单）
const hasChildren = computed(() => {
  return props.menu.children?.some((child) => child.path) || false;
});

// 过滤有效的子菜单（有path的）
const validChildren = computed(() => {
  return props.menu.children?.filter((child) => child.path) || [];
});


</script>
