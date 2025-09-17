<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 18:18:15
 * @Description: 布局内容组件
-->
<template>
  <div class="layout-content-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style scoped>
.layout-content-container {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 200px);
}
</style>
