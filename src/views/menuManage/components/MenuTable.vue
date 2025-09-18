<template>
  <!-- 数据表格 -->
  <a-table
    row-key="id"
    :columns="columns"
    :data-source="dataList"
    :loading="loading"
    :pagination="false"
    :scroll="{ x: 1200 }"
  >
    <template #bodyCell="{ column, record }">
      <!-- 菜单类型列渲染 -->
      <template v-if="column.key === 'type'">
        <StatusText :options="menuTypeOptions" :value="record.type" />
      </template>
      <!-- 显示状态列渲染 -->
      <template v-if="column.key === 'visibleStatus'">
        <StatusText
          :options="menuVisibleStatusOptions"
          :value="record.visibleStatus"
        />
      </template>
      <!-- 操作列渲染 -->
      <template v-if="column.key === 'action'">
        <a-button
          v-if="
            record.type === MenuTypeEnum.CATALOG ||
            record.type === MenuTypeEnum.MENU
          "
          type="link"
          @click="handleItemAdd(record)"
        >
          {{ $t("action.add") }}
        </a-button>
        <a-button type="link" @click="handleEdit(record)">
          {{ $t("action.edit") }}
        </a-button>
        <a-button type="link" danger @click="handleDelete(record)">
          {{ $t("action.delete") }}
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
// api
import { menuManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
import { isHasArrayData } from "@/utils/dataJudgment";
import { menuTypeOptions, menuVisibleStatusOptions } from "../utils/options";
// type
import type { MenuListItem } from "@/api/menuManage/data.d";
import { MenuTypeEnum } from "../utils/types";
// components
import StatusText from "@/components/StatusText/index.vue";

// Props
interface Props {
  searchParams?: Record<string, any>;
}

// Emits
interface Emits {
  (e: "itemAdd", record: MenuListItem): void;
  (e: "edit", record: MenuListItem): void;
  (e: "update:loading", loading: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  searchParams: () => ({}),
});
const emit = defineEmits<Emits>();

// 国际化工具
const { getI18nText } = useI18nUtil();

// 数据状态
const loading = ref(false);
const dataList = ref<MenuListItem[]>([]);

// 表格列配置
const columns = computed(() => [
  {
    title: getI18nText("form.menuName"),
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: getI18nText("form.menuType"),
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    title: getI18nText("form.routeName"),
    dataIndex: "routeName",
    key: "routeName",
    width: 200,
  },
  {
    title: getI18nText("form.routePath"),
    dataIndex: "routePath",
    key: "routePath",
    width: 200,
  },
  {
    title: getI18nText("form.component"),
    dataIndex: "component",
    key: "component",
    width: 200,
  },
  {
    title: getI18nText("form.sort"),
    dataIndex: "sort",
    key: "sort",
    width: 80,
  },
  {
    title: getI18nText("form.visibleStatus"),
    dataIndex: "visibleStatus",
    key: "visibleStatus",
    width: 100,
  },
  {
    title: getI18nText("form.action"),
    key: "action",
    width: 250,
    fixed: "right",
  },
]);

// 获取菜单列表数据
const getDataList = async () => {
  loading.value = true;
  emit("update:loading", true);
  try {
    const response = await menuManageApi
      .getList(props.searchParams)
      .finally(() => {
        loading.value = false;
        emit("update:loading", false);
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
        dataList.value = processData(list);
      },
    });
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};

// 刷新数据
const refresh = () => {
  getDataList();
};

// 处理子集新增
const handleItemAdd = (record: MenuListItem) => {
  emit("itemAdd", record);
};

// 处理编辑菜单
const handleEdit = (record: MenuListItem) => {
  emit("edit", record);
};

// 处理删除菜单
const handleDelete = (record: MenuListItem) => {
  ElMessageBox.confirm(
    "确认删除该菜单吗？",
    "提示",
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const response = await menuManageApi.onDelete({ id: record.id });
      handleReturnResults({
        params: response,
        onSuccess: () => {
          ElMessage.success(getI18nText("action.deleteSuccess"));
          refresh();
        },
      });
    } catch (error) {
      console.error("删除失败:", error);
    }
  }).catch(() => {
    // 用户取消删除
  });
};

// 监听搜索参数变化
watch(
  () => props.searchParams,
  () => {
    refresh();
  },
  { deep: true }
);

// 暴露方法给父组件
defineExpose({
  refresh,
  getDataList,
});

// 组件挂载时获取数据
onMounted(() => {
  getDataList();
});
</script>
