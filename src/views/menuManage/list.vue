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
    <MenuTable
      ref="tableRef"
      :search-params="searchParams"
      v-model:loading="loading"
      @item-add="handleItemAdd"
      @edit="handleEdit"
    />

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
import { ref, reactive, computed } from "vue";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { menuTypeOptions, menuVisibleStatusOptions } from "./utils/options";
// type
import type { MenuListItem } from "@/api/menuManage/data.d";
import { ActionTypeEnum, FormTypeEnum } from "@/enums";
// components
import MenuForm from "./components/MenuForm.vue";
import MenuTable from "./components/MenuTable.vue";
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

// 搜索参数
const searchParams = reactive({
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

// 处理搜索和重置
const handleRefresh = () => {
  tableRef.value?.refresh();
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
</script>
