<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-02 20:30:10
 * @Description: 通过接口获取下拉数据
-->
<template>
  <el-select
    v-model:value="selectedValue"
    :placeholder="placeholder"
    :loading="loading"
    :disabled="disabled"
    @focus="getDataList"
  >
    <el-select-option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </el-select-option>
  </el-select>
</template>

<script setup lang="ts">
import { handleReturnResults } from "@/utils/instance";
interface Option {
  label: string;
  value: any;
}

interface Props {
  api: (params: any) => Promise<{ data: { list: any[] } }>;
  pageSize?: number;
  labelField?: string;
  valueField?: string;
  modelValue?: any;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 50,
  labelField: "name",
  valueField: "uuid",
  placeholder: "",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
}>();

const loading = ref(false);
const options = ref<Option[]>([]);
const selectedValue = ref(props.modelValue);

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

// 监听内部值变化
watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
});

// 加载选项数据
const getDataList = async () => {
  loading.value = true;
  try {
    const response = await props
      .api({
        page: 1,
        pageSize: props.pageSize,
      })
      .finally(() => {
        loading.value = false;
      });
    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        const { list = [] } = res.data || {};
        options.value = list?.map((item: any) => ({
          label: item[props.labelField],
          value: item[props.valueField],
        }));
      },
    });
  } catch (error) {
    loading.value = false;
    console.error("加载选项失败:", error);
  }
};

// 组件挂载时获取数据
onMounted(() => {
  getDataList();
});
</script>
