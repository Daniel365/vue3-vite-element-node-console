<template>
  <div class="page-loading" v-if="props.loading">
    <a-spin :tip="props.loadingTip || $t('action.loading')" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  loading?: boolean;
  loadingTip?: string;
}
defineOptions({
  name: "PageLoading",
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingTip: "",
});
</script>

<style lang="less" scoped>
.page-loading {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
</style>
