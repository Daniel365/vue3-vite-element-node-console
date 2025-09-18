<template>
  <el-dropdown v-model="visible" trigger="click" :style="{ width }">
    <el-input
      v-model="selectedIcon"
      :placeholder="placeholder"
      readonly
      @click="visible = !visible"
    >
      <template #prefix>
        <IconFont v-if="selectedIcon" :name="selectedIcon" />
      </template>
      <template #suffix>
        <el-icon
          v-if="selectedIcon"
          @click.stop="handleClear"
          style="color: rgba(0, 0, 0, 0.25); cursor: pointer;"
        >
          <Close />
        </el-icon>
        <el-icon style="color: rgba(0, 0, 0, 0.25)">
          <ArrowDown />
        </el-icon>
      </template>
    </el-input>

    <template #dropdown>
      <div class="icon-dropdown">
        <el-input v-model="searchText" placeholder="搜索图标">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="icon-grid">
          <el-tooltip
            v-for="item in filteredSvgIcons"
            :key="item.name"
            :content="item.name"
            placement="bottom"
          >
            <div class="icon-item" @click="selectIcon(item.name)">
              <IconFont :name="item.name" />
            </div>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Close, ArrowDown, Search } from "@element-plus/icons-vue";
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
  border-color: #409eff;
  background-color: #ecf5ff;
}

.icon-item div {
  width: 20px;
  height: 20px;
}
</style>