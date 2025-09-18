<template>
  <i :class="`iconfont icon-${name}`" />
</template>
<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});

// 确保在页面head中添加了iconfont的CSS链接
// <link rel="stylesheet" href="//at.alicdn.com/t/c/font_5021379_jz0bxprxcac.css">
// 或者在main.ts中导入CSS文件
</script>