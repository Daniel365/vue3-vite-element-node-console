<template>
  <el-form :model="formData" inline class="search-form">
    <template v-for="field in fields" :key="field.key">
      <el-form-item :label="field.label">
        <el-input
          v-if="field.type === 'input'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
        />
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          :style="{ width: field.width || '120px' }"
        >
          <el-option
            v-for="item in field.options"
            :key="item.value"
            :value="item.value"
            :label="item.labelKey ? $t(item.labelKey) : item.label"
          />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSearch">
        {{ $t("action.search") }}
      </el-button>
      <el-button style="margin-left: 8px" :loading="loading" @click="handleReset">
        {{ $t("action.reset") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormTypeEnum } from "@/enums";

export interface SearchField {
  key: string;
  label: string;
  type: FormTypeEnum;
  placeholder?: string;
  width?: string;
  options?: { labelKey?: string; label: string; value: any }[];
}

interface Props {
  fields: SearchField[];
  modelValue: Record<string, any>;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});
const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>];
  search: [params: Record<string, any>];
  reset: [];
}>();

const formData = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal);
  },
  { deep: true }
);

watch(
  formData,
  (newVal) => {
    emit("update:modelValue", { ...newVal });
  },
  { deep: true }
);

const handleSearch = () => {
  emit("search", { ...formData });
};

const handleReset = () => {
  const resetData = props.fields.reduce((acc, field) => {
    acc[field.key] = field.type === "select" ? undefined : "";
    return acc;
  }, {} as Record<string, any>);
  Object.assign(formData, resetData);
  emit("reset");
};
</script>

<style scoped>
.search-form {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 16px;
}
</style>
