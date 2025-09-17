<template>
  <div class="layout-logo">
    <img src="/vite.svg" alt="Logo" />
    <h1 v-if="!collapsed">{{ $t("common.appName") }}</h1>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
.layout-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
  img {
    width: 32px;
    height: 32px;
  }
  h1 {
    margin: 0 0 0 12px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
