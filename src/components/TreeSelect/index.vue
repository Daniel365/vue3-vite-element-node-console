<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-07 16:13:02
 * @Description: 树形下拉组件
-->
<template>
  <el-tree-select
    v-model="selectedValue"
    :data="treeData"
    :placeholder="placeholder"
    :disabled="disabled"
    :multiple="multiple"
    :check-strictly="false"
    :render-after-expand="false"
    show-checkbox
    @focus="getDataList"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { handleReturnResults } from "@/utils/instance";

interface TreeNode {
  label: string;
  value: any;
  children?: TreeNode[];
}

interface Props {
  api: (params?: any) => Promise<any>;
  modelValue?: any;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  transform?: (data: any[]) => TreeNode[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  disabled: false,
  multiple: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
}>();

const loading = ref(false);
const treeData = ref<TreeNode[]>([]);
const selectedValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const getDataList = async () => {
  if (treeData.value.length > 0) return;

  loading.value = true;
  try {
    const response = await props.api().finally(() => {
      loading.value = false;
    });

    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        const { list } = res.data || {};
        treeData.value = props.transform ? props.transform(list) : list;
      },
    });
  } catch (error) {
    loading.value = false;
    console.error("加载树形数据失败:", error);
  }
};

onMounted(() => {
  getDataList();
});
</script>
