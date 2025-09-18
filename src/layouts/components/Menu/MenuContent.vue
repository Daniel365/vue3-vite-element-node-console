<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:11:40
 * @Description: 菜单内容组件
-->
<template>
  <IconFont v-if="meta?.icon" :name="meta?.icon" style="font-size: 18px" />
  <el-icon v-else><HomeFilled /></el-icon>
  <span>{{ meta?.title }}</span>
</template>

<script setup lang="ts">
import { HomeFilled } from "@element-plus/icons-vue";
// type
import type { MenuMeta } from "@/api/accountManage/data.d";
// components
import IconFont from "@/components/IconFont/index.vue";

interface Props {
  meta?: MenuMeta;
}

const props = defineProps<Props>();
</script>