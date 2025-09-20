<template>
  <!-- 角色管理页面 -->
  <div class="role-manage-page">
    <!-- 搜索表单 -->
    <SearchForm
      v-model="searchParams"
      :fields="searchFields"
      :loading="loading"
      @search="handleRefresh"
      @reset="handleRefresh"
    />

    <!-- 新增按钮 -->
    <div style="margin-bottom: 16px">
      <el-button v-hasPerm="[requestPath.ROLE_CREATE]" type="primary" @click="handleAdd">
        {{ $t("action.add") }}
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      ref="tableRef"
      :api="roleManageApi.getList"
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
          <el-button type="primary" link @click="handleAssignPermission(record)">
            {{ $t("roleManage.assignPermission") }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(record)">
            {{ $t("action.delete") }}
          </el-button>
        </template>
      </template>
    </DataTable>

    <!-- 角色表单弹窗 -->
    <RoleForm v-model:visible="editVisible" :role-data="currentRole" @success="handleRefresh" />

    <!-- 权限分配抽屉 -->
    <MenuTreeDrawer
      v-model="selectedPermissions"
      v-model:visible="permissionVisible"
      :title="$t('roleManage.permissionAssignment', { roleName: currentRole?.name })"
      @confirm="handlePermissionConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
// api
import { roleManageApi } from "@/api";
import { requestPath } from "@/api/requestPath";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { enabledStatusOptions } from "@/utils/options";
// type
import type { RoleListItem } from "@/api/roleManage/data.d";
import { FormTypeEnum } from "@/enums";
// components
import RoleForm from "./components/RoleForm.vue";
import StatusText from "@/components/StatusText/index.vue";
import MenuTreeDrawer from "@/views/menuManage/components/MenuTreeDrawer.vue";

// 国际化工具
const { getI18nText } = useI18nUtil();
// 表格引用
const tableRef = ref();
// 加载状态
const loading = ref(false);
// 数据来源
const tableData = ref<RoleListItem[]>([]);
// 编辑抽屉显示状态
const editVisible = ref(false);
// 当前编辑角色
const currentRole = ref<RoleListItem>();
// 权限分配抽屉显示状态
const permissionVisible = ref(false);
// 选中的权限
const selectedPermissions = ref<(string | number)[]>([]);

// 搜索参数
const searchParams = reactive({
  name: "",
  status: undefined,
});

// 搜索字段配置
const searchFields = computed(() => [
  {
    key: "name",
    label: getI18nText("form.roleName"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterRoleName"),
  },
  {
    key: "status",
    label: getI18nText("form.status"),
    type: FormTypeEnum.SELECT,
    placeholder: getI18nText("form.selectStatus"),
    options: enabledStatusOptions,
  },
]);

// 表格列配置
const columns = [
  { titleKey: "form.roleName", key: "name" },
  { titleKey: "form.roleCode", key: "code" },
  { titleKey: "form.roleDesc", key: "description" },
  { titleKey: "form.status", key: "status" },
  { titleKey: "form.action", key: "action", width: 200, fixed: "right" },
];

// 处理搜索和重置
const handleRefresh = () => {
  tableRef.value?.refresh();
};

// 处理新增角色
const handleAdd = () => {
  currentRole.value = undefined;
  editVisible.value = true;
};

// 处理编辑角色
const handleEdit = (record: RoleListItem) => {
  currentRole.value = record;
  editVisible.value = true;
};

// 处理分配权限
const handleAssignPermission = (record: RoleListItem) => {
  currentRole.value = record;
  selectedPermissions.value = record.menuIds || [];
  permissionVisible.value = true;
};

// 处理权限分配确认
const handlePermissionConfirm = async (menuIds: (string | number)[]) => {
  if (!currentRole.value) return;

  try {
    await roleManageApi.onAssignPerm({
      uuid: currentRole.value.uuid,
      menuIds,
    });
    ElMessage.success(getI18nText("roleManage.assignSuccess"));
    tableRef.value?.refresh();
  } catch (error) {
    ElMessage.error(getI18nText("action.failed"));
  }
};

// 处理删除角色
const handleDelete = (record: RoleListItem) => {
  ElMessageBox.confirm(
    getI18nText("roleManage.deleteConfirm", {
      roleName: record.name,
    }),
    getI18nText("action.confirmDelete")
  )
    .then(async () => {
      try {
        await roleManageApi.onDelete({ uuid: record.uuid });
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
