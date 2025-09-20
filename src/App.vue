<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { useAppStore } from "@/store";
import { LanguageEnum } from "./enums";

const appStore = useAppStore();
const locale = computed(() => (appStore.language === LanguageEnum.ZH ? zhCn : en));
</script>
