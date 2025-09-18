<template>
  <!-- 数据表格组件 -->
  <div class="data-table">
    <!-- 表格主体 -->
    <el-table
      :row-key="rowKey"
      :data="dataList"
      v-loading="loading"
      height="500"
      style="width: 100%"
    >
      <el-table-column
        v-for="column in processedColumns"
        :key="column.key"
        :prop="column.dataIndex"
        :label="column.title"
        :width="column.width"
        :align="column.align"
      >
        <template #default="{ row, column: col, $index }">
          <slot name="bodyCell" :column="col" :record="row" :index="$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePaginationChange"
      @size-change="handlePaginationSizeChange"
      style="margin-top: 16px; text-align: right"
    />
  </div>
</template>

<script setup lang="ts">
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";

// 表格列配置接口
export interface TableColumn {
  title?: string;
  titleKey?: string;
  dataIndex?: string;
  key: string;
  width?: number | string;
  align?: "left" | "center" | "right";
}

// API 函数接口
export interface ApiFunction {
  (params: any): Promise<{ data: { list: any[]; total: number } }>;
}

// 组件属性接口
interface Props {
  api: ApiFunction;
  loading?: boolean;
  rowKey?: string;
  searchParams?: Record<string, any>;
  columns: TableColumn[];
  dataList?: any[];
}

// 组件属性定义
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: "uuid",
  searchParams: () => ({}),
  dataList: () => [],
});

// 国际化工具
const { getI18nText } = useI18nUtil();

// 处理列配置，自动添加dataIndex和title
const processedColumns = computed(() =>
  props.columns.map((col) => ({
    ...col,
    title: col.title || (col.titleKey ? getI18nText(col.titleKey) : ""),
    dataIndex: col.dataIndex || col.key,
  }))
);

// 事件定义
const emit = defineEmits<{
  "update:dataList": [value: any[]];
  "update:loading": [value: boolean];
}>();

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 获取数据
const getDataList = async () => {
  emit("update:loading", true);
  try {
    const params = {
      ...props.searchParams,
      ...pagination,
      total: undefined, // 去除 total 参数
    };
    const response = await props.api(params);
    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        const { list, total } = res.data;
        emit("update:dataList", list || []);
        pagination.total = total || 0;
      },
    });
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    emit("update:loading", false);
  }
};

// 处理分页变化
const handlePaginationChange = (page: number) => {
  pagination.page = page;
  getDataList();
};

// 处理分页大小变化
const handlePaginationSizeChange = (pageSize: number) => {
  pagination.page = 1;
  pagination.pageSize = pageSize;
  getDataList();
};

// 刷新数据
const refresh = () => {
  pagination.page = 1;
  getDataList();
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

<style scoped>
.data-table {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
}
</style>
