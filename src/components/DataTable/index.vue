<template>
  <!-- 数据表格组件 -->
  <div class="data-table">
    <!-- 表格主体 -->
    <el-table :row-key="rowKey" :data="dataList" v-loading="loading" height="500">
      <!-- 展开列 -->
      <template v-if="$slots.expand">
        <el-table-column type="expand" width="50">
          <template #default="props">
            <slot name="expand" :row="props.row" :index="props.$index" />
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-for="item in processedColumns"
        :key="item.key"
        :prop="item.dataIndex"
        :label="item.title"
        :width="item.width"
        :align="item.align"
        :fixed="item.fixed"
      >
        <template #default="{ row, $index }">
          <slot name="bodyCell" :column="item" :record="row" :index="$index" v-if="$slots.bodyCell">
            {{ handleText(row, item) }}
          </slot>
          <template v-else>
            {{ handleText(row, item) }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="flex flex-justify-between mt-5">
      <span></span>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePaginationChange"
        @size-change="handlePaginationSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
import { formatIsoDate, isValidIsoDate } from "@/utils/format/dateTime";
// utils
import { handleReturnResults } from "@/utils/instance";

/**
 * 表格列配置接口
 */
export interface TableColumn {
  /** 列标题 */
  title?: string;
  /** 列标题国际化key */
  titleKey?: string;
  /** 数据字段名，默认使用key */
  dataIndex?: string;
  /** 列唯一标识 */
  key: string;
  /** 列宽度 */
  width?: number | string;
  /** 列对齐方式 */
  align?: "left" | "center" | "right";
  /** 是否固定列 */
  fixed?: string | boolean;
}

/**
 * 数据表格组件属性接口
 */
interface Props<T = any> {
  /** API请求函数 */
  api?: (params: any) => Promise<InterfaceResult<PageResult<T>>>;
  /** 加载状态 */
  loading?: boolean;
  /** 行数据的Key，用于行选择 */
  rowKey?: string;
  /** 搜索参数 */
  searchParams?: Record<string, any>;
  /** 表格列配置 */
  columns: TableColumn[];
  /** 表格数据 */
  dataList?: T[];
}

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: "uuid",
  searchParams: () => ({}),
  dataList: () => [],
});

// 国际化工具
const { getI18nText } = useI18nUtil();

/**
 * 处理列配置，自动添加dataIndex和title
 */
const processedColumns = computed(() =>
  props.columns.map((col: TableColumn) => ({
    ...col,
    title: col.title || (col.titleKey ? getI18nText(col.titleKey) : ""),
    dataIndex: col.dataIndex || col.key,
  }))
);

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 更新数据列表 */
  "update:dataList": [value: any[]];
  /** 更新加载状态 */
  "update:loading": [value: boolean];
}>();

/**
 * 分页配置
 */
const pagination = reactive<PageInfo>({
  page: 1,
  pageSize: 10,
  total: 0,
});

/**
 * 处理表格单元格文本显示
 * @param row 行数据
 * @param item 列配置
 * @returns 单元格显示值
 */
const handleText = (row: any, item: TableColumn) => {
  const val = row[item.dataIndex || item.key];
  if (isValidIsoDate(val)) {
    return formatIsoDate(val);
  }
  return val || "-";
};

/**
 * 获取表格数据
 */
const getDataList = async () => {
  emit("update:loading", true);
  try {
    const params = {
      ...props.searchParams,
      ...pagination,
      total: undefined, // 去除 total 参数
    };
    if (props.api) {
      const response = await props.api(params);
      handleReturnResults({
        params: response,
        onSuccess: (res) => {
          const { list, pageInfo } = res.data;
          emit("update:dataList", list || []);
          pagination.total = pageInfo.total || 0;
        },
      });
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    emit("update:loading", false);
  }
};

/**
 * 处理分页页码变化
 * @param page 新的页码
 */
const handlePaginationChange = (page: number) => {
  pagination.page = page;
  getDataList();
};

/**
 * 处理分页大小变化
 * @param pageSize 新的每页条数
 */
const handlePaginationSizeChange = (pageSize: number) => {
  pagination.page = 1;
  pagination.pageSize = pageSize;
  getDataList();
};

/**
 * 刷新数据，重置到第一页
 */
const refresh = () => {
  pagination.page = 1;
  getDataList();
};

/**
 * 监听搜索参数变化，自动刷新数据
 */
watch(
  () => props.searchParams,
  () => {
    refresh();
  },
  { deep: true }
);

/**
 * 暴露方法给父组件使用
 */
defineExpose({
  /** 刷新数据 */
  refresh,
  /** 获取数据列表 */
  getDataList,
});

/**
 * 组件挂载时获取数据
 */
onMounted(() => {
  if (props.api) {
    getDataList();
  }
});
</script>

<style scoped>
.data-table {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
}
</style>
