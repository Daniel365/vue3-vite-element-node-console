<template>
  <!-- 操作日志页面 -->
  <div class="operation-log-page">
    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchParams"
      :fields="searchFields"
      :loading="loading"
      @search="handleRefresh"
      @reset="handleRefresh"
    />

    <!-- 数据表格 -->
    <DataTable
      ref="tableRef"
      :api="operationLogApi.getList"
      v-model:loading="loading"
      :search-params="searchParams"
      :columns="columns"
      v-model:data-list="tableData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
// api
import { operationLogApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// type
import type { OperationLogListItem } from "@/api/operationLog/data.d";
import { FormTypeEnum } from "@/enums";
// components
import SearchForm from "@/components/SearchForm/index.vue";
import DataTable from "@/components/DataTable/index.vue";

// 国际化工具
const { getI18nText } = useI18nUtil();
// 表格引用
const tableRef = ref();
// 加载状态
const loading = ref(false);
// 数据来源
const tableData = ref<OperationLogListItem[]>([]);

// 搜索参数
const searchParams = reactive({
  action: "",
  username: "",
  ipAddress: "",
});

// 搜索字段配置
const searchFields = computed(() => [
  {
    key: "action",
    label: getI18nText("form.action"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterAction"),
  },
  {
    key: "username",
    label: getI18nText("form.username"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterUsername"),
  },
  {
    key: "ipAddress",
    label: getI18nText("form.ipAddress"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterIpAddress"),
  },
]);

// 表格列配置
const columns = [
  { titleKey: "form.action", key: "action" },
  { titleKey: "form.description", key: "description" },
  { titleKey: "form.username", key: "username" },
  { titleKey: "form.ipAddress", key: "ipAddress" },
  { titleKey: "form.userAgent", key: "userAgent" },
  { titleKey: "form.createTime", key: "createdAt" },
];

// 处理搜索和重置
const handleRefresh = () => {
  tableRef.value?.refresh();
};
</script>
