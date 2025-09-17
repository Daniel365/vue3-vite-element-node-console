<template>
  <a-tag v-if="type === 'tag'" :color="currentOption?.color">
    {{ currentOption?.label }}
  </a-tag>
  <span v-else>{{ currentOption?.label }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface StatusOption {
  label: string;
  value: any;
  color?: string;
}

interface Props {
  options: StatusOption[];
  value: any;
  type?: 'tag' | 'text';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tag',
});

// 根据value找到对应的选项
const currentOption = computed(() => 
  props.options.find(option => option.value === props.value)
);
</script>