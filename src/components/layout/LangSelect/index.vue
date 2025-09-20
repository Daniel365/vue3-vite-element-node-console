<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-20 13:18:15
 * @Description: 语言选择组件
-->
<template>
  <el-dropdown trigger="click" @command="onLanguageChange">
    <el-link underline="never">
      <icon-font name="language" size="20px" />
    </el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :disabled="appStore.language === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script name="LangSelect" lang="ts" setup>
import { useAppStore } from "@/store";
import { LanguageEnum } from "@/enums";
import { useI18nUtil } from "@/hooks/i18ns";

const appStore = useAppStore();

const { locale, getI18nText } = useI18nUtil();

/** 切换语言 */
const onLanguageChange = (val: string) => {
  locale.value = val;
  appStore.changeLanguage(val);
};

const langOptions = [
  { label: getI18nText("common.zh"), value: LanguageEnum.ZH },
  { label: getI18nText("common.en"), value: LanguageEnum.EN },
];
</script>
