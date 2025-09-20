<template>
  <!-- 菜单管理页面 -->
  <div class="menu-manage-page">
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
      <el-button type="primary" @click="handleAdd">
        {{ $t("action.add") }}
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      ref="tableRef"
      row-key="id"
      v-model:loading="loading"
      :columns="columns"
      v-model:data-list="tableData"
    >
      <template #bodyCell="{ column, record }">
        <!-- 菜单类型列渲染 -->
        <template v-if="column.key === 'name'">
          <icon-font v-if="record.icon" class="mr-2 align--20%" :name="record.icon" size="20px" />
          <span>{{ record.name }}</span>
        </template>
        <!-- 菜单类型列渲染 -->
        <template v-if="column.key === 'type'">
          <StatusText :options="menuTypeOptions" :value="record.type" />
        </template>
        <!-- 显示状态列渲染 -->
        <template v-if="column.key === 'visibleStatus'">
          <StatusText :options="menuVisibleStatusOptions" :value="record.visibleStatus" />
        </template>
        <!-- 操作列渲染 -->
        <template v-if="column.key === 'action'">
          <el-button
            type="primary"
            link
            v-if="record.type === MenuTypeEnum.CATALOG || record.type === MenuTypeEnum.MENU"
            @click="handleItemAdd(record)"
          >
            {{ $t("action.add") }}
          </el-button>
          <el-button type="primary" link @click="handleEdit(record)">
            {{ $t("action.edit") }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(record)">
            {{ $t("action.delete") }}
          </el-button>
        </template>
      </template>
    </DataTable>

    <!-- 菜单表单弹窗 -->
    <MenuForm
      v-model:visible="editVisible"
      :action-type="actionType"
      :edit-data="currentMenu"
      @success="handleRefresh"
      @onClose="onCloseForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { menuManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { menuTypeOptions, menuVisibleStatusOptions } from "./utils/options";
import { handleReturnResults } from "@/utils/instance";
import { isHasArrayData } from "@/utils/dataJudgment";
// type
import type { MenuListItem } from "@/api/menuManage/data.d";
import { ActionTypeEnum, FormTypeEnum } from "@/enums";
import { MenuTypeEnum } from "./utils/types";
// components
import MenuForm from "./components/MenuForm.vue";
import SearchForm from "@/components/SearchForm/index.vue";

// 国际化工具
const { getI18nText } = useI18nUtil();
// 表格引用
const tableRef = ref();
// 加载状态
const loading = ref(false);
// 编辑抽屉显示状态
const editVisible = ref(false);
// 当前编辑菜单
const actionType = ref<ActionTypeEnum>();
// 当前编辑菜单
const currentMenu = ref<MenuListItem>();
// 列表数据
const tableData = ref<MenuListItem[]>([]);

// 搜索参数
const searchParams = ref({
  name: "",
  type: undefined,
  visibleStatus: undefined,
});

// 搜索字段配置
const searchFields = computed(() => [
  {
    key: "name",
    label: getI18nText("form.menuName"),
    type: FormTypeEnum.INPUT,
    placeholder: getI18nText("form.enterMenuName"),
  },
  {
    key: "type",
    label: getI18nText("form.menuType"),
    type: FormTypeEnum.SELECT,
    placeholder: getI18nText("form.selectType"),
    options: menuTypeOptions,
  },
  {
    key: "visibleStatus",
    label: getI18nText("form.visibleStatus"),
    type: FormTypeEnum.SELECT,
    placeholder: getI18nText("form.selectStatus"),
    options: menuVisibleStatusOptions,
  },
]);

// 表格列配置
const columns = computed(() => [
  {
    titleKey: "form.menuName",
    dataIndex: "name",
    key: "name",
    width: 180,
    fixed: true,
  },
  {
    titleKey: "form.menuType",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    titleKey: "form.routeName",
    dataIndex: "routeName",
    key: "routeName",
    width: 200,
  },
  {
    titleKey: "form.routePath",
    dataIndex: "routePath",
    key: "routePath",
    width: 200,
  },
  {
    titleKey: "form.component",
    dataIndex: "component",
    key: "component",
    width: 200,
  },
  {
    titleKey: "form.sort",
    dataIndex: "sort",
    key: "sort",
    width: 80,
  },
  {
    titleKey: "form.visibleStatus",
    dataIndex: "visibleStatus",
    key: "visibleStatus",
    width: 100,
  },
  {
    titleKey: "form.action",
    key: "action",
    width: 250,
    fixed: "right",
  },
]);

// 获取菜单列表数据
const getDataList = async () => {
  loading.value = true;
  try {
    // 调用接口获取数据
    const response = await menuManageApi.getList(searchParams.value).finally(() => {
      loading.value = false;
    });
    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        const { list } = res.data || { list: [] };
        // 处理children为空数组的情况，设为undefined避免显示展开图标
        const processData = (items: MenuListItem[]): MenuListItem[] => {
          return items.map((item) => ({
            ...item,
            children:
              item.children && isHasArrayData(item.children)
                ? processData(item?.children)
                : undefined,
          }));
        };
        tableData.value = processData(list);
      },
    });
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};

// 处理搜索和重置
const handleRefresh = () => {
  getDataList();
};

// 关闭表单
const onCloseForm = () => {
  actionType.value = undefined;
  currentMenu.value = undefined;
  editVisible.value = false;
};

// 处理新增菜单
const handleAdd = () => {
  actionType.value = ActionTypeEnum.CREATE;
  currentMenu.value = undefined;
  editVisible.value = true;
};

// 处理子集新增
const handleItemAdd = (record: MenuListItem) => {
  actionType.value = ActionTypeEnum.COPY;
  const childrenLen = record.children?.length || 0;

  currentMenu.value = {
    id: 0,
    parentId: record.id || 0,
    sort: childrenLen + 1,
  } as MenuListItem;
  editVisible.value = true;
};

// 处理编辑菜单
const handleEdit = (record: MenuListItem) => {
  actionType.value = ActionTypeEnum.EDIT;
  currentMenu.value = record;
  editVisible.value = true;
};

// 处理删除菜单
const handleDelete = (record: MenuListItem) => {
  ElMessageBox.confirm("确认删除该菜单吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response = await menuManageApi.onDelete({ id: record.id });
        handleReturnResults({
          params: response,
          onSuccess: () => {
            ElMessage.success(getI18nText("action.deleteSuccess"));
            handleRefresh();
          },
        });
      } catch (error) {
        console.error("删除失败:", error);
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};

onMounted(() => {
  getDataList();
});
</script>
