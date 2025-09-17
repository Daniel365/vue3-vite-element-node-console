<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-31 08:54:57
 * @Description: admin容器
-->
<template>
  <div class="admin-container">
    <div class="admin-background">
      <div class="admin-content">
        <div class="admin-header">
          <div class="logo">
            <img src="/vite.svg" alt="Logo" />
            <h1>{{ $t("common.appName") }}</h1>
          </div>
          <p class="subtitle">{{ $t("admin.consoleName") }}</p>
        </div>

        <div class="admin-form">
          <h2 class="form-title">{{ props.formTitle }}</h2>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: "AdminContainer",
  inheritAttrs: false,
});
const props = defineProps({
  formTitle: {
    type: String,
  },
});
</script>
