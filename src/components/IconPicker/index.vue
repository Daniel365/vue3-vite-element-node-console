<template>
  <a-dropdown v-model:open="visible" trigger="click" :style="{ width }">
    <a-input
      v-model:value="selectedIcon"
      :placeholder="placeholder"
      readonly
      @click="visible = !visible"
    >
      <template #prefix>
        <IconFont v-if="selectedIcon" :name="selectedIcon" />
      </template>
      <template #suffix>
        <CloseOutlined
          v-if="selectedIcon"
          @click.stop="handleClear"
          style="color: rgba(0, 0, 0, 0.25)"
        />
        <DownOutlined style="color: rgba(0, 0, 0, 0.25)" />
      </template>
    </a-input>

    <template #overlay>
      <div class="icon-dropdown">
        <a-input v-model:value="searchText" placeholder="搜索图标">
          <template #prefix><SearchOutlined /></template>
        </a-input>

        <div class="icon-grid">
          <a-tooltip
            v-for="item in filteredSvgIcons"
            :key="item.name"
            :title="item.name"
            placement="bottom"
          >
            <div class="icon-item" @click="selectIcon(item.name)">
              <IconFont :name="item.name" />
            </div>
          </a-tooltip>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  DownOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { iconOptions } from "./utils";

interface Props {
  modelValue?: string;
  width?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  width: "200px",
  placeholder: "选择图标",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const selectedIcon = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const searchText = ref("");
const visible = ref(false);

const filteredSvgIcons = computed(() => {
  return iconOptions.filter((item: any) =>
    item.name.includes(searchText.value)
  );
});

const handleClear = () => {
  selectedIcon.value = "";
};

const selectIcon = (icon: string) => {
  selectedIcon.value = icon;
  visible.value = false;
};
</script>

<style scoped>
.icon-dropdown {
  width: 400px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 8px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: #1890ff;
  background-color: #f0f8ff;
}

.icon-item div {
  width: 20px;
  height: 20px;
}
</style>
