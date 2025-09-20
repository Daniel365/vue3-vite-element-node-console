<template>
  <div ref="iconSelectRef" :style="{ width: props.width }">
    <el-popover :visible="popoverVisible" :width="props.width" placement="bottom-end">
      <template #reference>
        <div @click="popoverVisible = !popoverVisible">
          <slot>
            <el-input v-model="selectedIcon" readonly placeholder="点击选择图标" class="reference">
              <template #prepend>
                <!-- 根据图标类型展示 -->
                <el-icon v-if="isElementIcon">
                  <component :is="selectedIcon.replace('el-icon-', '')" />
                </el-icon>
                <template v-else>
                  <div :class="`i-svg:${selectedIcon}`" />
                </template>
              </template>
              <template #suffix>
                <!-- 清空按钮 -->
                <el-icon
                  v-if="selectedIcon"
                  style="margin-right: 8px"
                  @click.stop="clearSelectedIcon"
                >
                  <CircleClose />
                </el-icon>

                <el-icon
                  :style="{
                    transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform .5s',
                  }"
                >
                  <ArrowDown @click.stop="togglePopover" />
                </el-icon>
              </template>
            </el-input>
          </slot>
        </div>
      </template>

      <!-- 图标选择弹窗 -->
      <div ref="popoverContentRef">
        <el-input v-model="filterText" placeholder="搜索图标" clearable @input="filterIcons" />
        <el-scrollbar class="mt-5" height="300px">
          <ul class="icon-grid">
            <li
              v-for="icon in filteredSvgIcons"
              :key="'svg-' + icon"
              class="icon-grid-item"
              @click="selectIcon(icon)"
            >
              <el-tooltip :content="icon" placement="bottom" effect="light">
                <icon-font :name="icon" size="24px" />
              </el-tooltip>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500px",
  },
});

const emit = defineEmits(["update:modelValue"]);

const iconSelectRef = ref();
const popoverContentRef = ref();
const popoverVisible = ref(false);
const activeTab = ref("svg");

const svgIcons = ref<string[]>([]);
const selectedIcon = defineModel("modelValue", {
  type: String,
  required: true,
  default: "",
});

const filterText = ref("");
const filteredSvgIcons = ref<string[]>([]);
const isElementIcon = computed(() => {
  return selectedIcon.value && selectedIcon.value.startsWith("el-icon");
});

function getIconList() {
  const icons = import.meta.glob("@/assets/icons/*.svg");
  for (const path in icons) {
    const iconName = path.replace(/.*\/(.*)\.svg$/, "$1");
    svgIcons.value.push(iconName);
  }
  filteredSvgIcons.value = svgIcons.value;
}

function filterIcons() {
  filteredSvgIcons.value = filterText.value
    ? svgIcons.value.filter((icon) => icon.toLowerCase().includes(filterText.value.toLowerCase()))
    : svgIcons.value;
}

function selectIcon(iconName: string) {
  emit("update:modelValue", iconName);
  popoverVisible.value = false;
}

function togglePopover() {
  popoverVisible.value = !popoverVisible.value;
}

onClickOutside(iconSelectRef, () => (popoverVisible.value = false), {
  ignore: [popoverContentRef],
});

/**
 * 清空已选图标
 */
function clearSelectedIcon() {
  selectedIcon.value = "";
}

onMounted(() => {
  getIconList();
});
</script>

<style scoped lang="scss">
.reference :deep(.el-input__wrapper),
.reference :deep(.el-input__inner) {
  cursor: pointer;
}

.icon-grid {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s;
  width: 42px;
  height: 42px;
}

.icon-grid-item:hover {
  border-color: #4080ff;
  transform: scale(1.2);
}
</style>
