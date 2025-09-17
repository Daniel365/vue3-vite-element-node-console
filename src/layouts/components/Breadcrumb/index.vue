<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-13 10:16:45
 * @Description: 面包屑
-->
<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span
        v-if="
          item.redirect === 'noredirect' || index === breadcrumbs.length - 1
        "
      >
        {{ item.meta.title }}
      </span>
      <a v-else @click.prevent="handleLink(item)">
        {{ item.meta.title }}
      </a>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { compile } from "path-to-regexp";
import { RouteLocationMatched } from "vue-router";
import router from "@/router";
// hooks
import { useRouteUtil } from "@/hooks/route";

const { route: currentRoute } = useRouteUtil();

const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref<Array<RouteLocationMatched>>([]);

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    (item) => item.path && item.meta && item.meta.title
  );

  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
}

function handleLink(item: any) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    return;
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  });
}

watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>
