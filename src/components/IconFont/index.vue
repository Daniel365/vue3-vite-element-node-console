<template>
  <icon-font :type="`icon-${name}`" />
</template>
<script lang="ts" setup>
import { createFromIconfontCN } from "@ant-design/icons-vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_5021379_jz0bxprxcac.js",
});
</script>
