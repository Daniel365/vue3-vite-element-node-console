<template>
  <!-- 用户管理页面 -->
  <div class="user-manage-page">
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
      :api="userManageApi.getList"
      v-model:loading="loading"
      :search-params="searchParams"
      :columns="columns"
      v-model:data-list="tableData"
    >
      <template #bodyCell="{ column, record }">
        <!-- 状态列渲染 -->
        <template v-if="column.key === 'status'">
          <StatusText :options="enabledStatusOptions" :value="record.status" />
        </template>
        <!-- 操作列渲染 -->
        <template v-if="column.key === 'action'">
          <el-button type="primary" link @click="handleEdit(record)">
            {{ $t("action.edit") }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(record)">
            {{ $t("action.delete") }}
          </el-button>
        </template>
      </template>
    </DataTable>

    <!-- 编辑用户抽屉 -->
    <UserForm v-model:visible="editVisible" :user-data="currentUser" @success="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
// api
import { userManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { enabledStatusOptions } from "@/utils/options";
// type
import type { UserListItem } from "@/api/userManage/data.d";
import { FormTypeEnum } from "@/enums";
// components
import SearchForm from "@/components/SearchForm/index.vue";
import DataTable from "@/components/DataTable/index.vue";
import UserForm from "./components/UserForm.vue";
import StatusText from "@/components/StatusText/index.vue";

/**
 * 国际化工具
 */
const { getI18nText } = useI18nUtil();

/**
 * 表格组件引用
 */
const tableRef = ref();

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 表格数据列表
 */
const tableData = ref<UserListItem[]>([]);

/**
 * 编辑抽屉显示状态
 */
const editVisible = ref(false);

/**
 * 当前编辑的用户数据
 */
const currentUser = ref<UserListItem>();

/**
 * 搜索参数接口
 */
interface SearchParams {
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 状态 */
  status: number | undefined;
}

/**
 * 搜索参数
 */
const searchParams = reactive<SearchParams>({
  username: "",
  email: "",
  status: undefined,
});

/**
 * 搜索表单字段配置
 */
const searchFields = computed(() => [
  {
    key: "username",
    label: getI18nText("form.username"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterUsername"),
  },
  {
    key: "email",
    label: getI18nText("form.email"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterEmail"),
  },
  {
    key: "status",
    label: getI18nText("form.status"),
    type: FormTypeEnum.SELECT,
    placeholder: getI18nText("form.selectStatus"),
    options: enabledStatusOptions,
  },
]);

/**
 * 表格列配置
 */
const columns = [
  { titleKey: "form.username", key: "username" },
  { titleKey: "form.email", key: "email" },
  { titleKey: "form.status", key: "status" },
  { titleKey: "form.roleName", key: "roleName" },
  { titleKey: "form.createTime", key: "createdAt" },
  { titleKey: "form.updateTime", key: "updatedAt" },
  { titleKey: "form.action", key: "action", fixed: "right" },
];

/**
 * 处理搜索和重置操作
 */
const handleRefresh = () => {
  tableRef.value?.refresh();
};

/**
 * 处理编辑用户操作
 * @param record 用户数据
 */
const handleEdit = (record: UserListItem) => {
  currentUser.value = record;
  editVisible.value = true;
};

/**
 * 处理删除用户操作
 * @param record 用户数据
 */
const handleDelete = (record: UserListItem) => {
  ElMessageBox.confirm(
    getI18nText("userManage.deleteConfirm", {
      username: record.username,
    }),
    getI18nText("action.confirmDelete"),
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        await userManageApi.onDelete({ uuid: record.uuid });
        ElMessage.success(getI18nText("action.deleteSuccess"));
        tableRef.value?.refresh();
      } catch (error) {
        ElMessage.error(getI18nText("action.deleteFailed"));
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};
</script>
