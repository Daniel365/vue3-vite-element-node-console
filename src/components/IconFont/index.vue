<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-20 14:29:10
 * @Description: 图标组件
-->
<template>
  <div :class="`icon-svg i-svg:${name}`" />
  <!-- <i :class="`iconfont icon-${name}`" /> -->
</template>
<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "16px",
  },
  color: {
    type: String,
    default: "#333",
  },
});

// 确保在页面head中添加了iconfont的CSS链接
// <link rel="stylesheet" href="//at.alicdn.com/t/c/font_5021379_jz0bxprxcac.css">
// 或者在main.ts中导入CSS文件
</script>

<style lang="scss" scoped>
.icon-svg {
  width: v-bind(size);
  height: v-bind(size);
  fill: v-bind(color);
}
</style>
