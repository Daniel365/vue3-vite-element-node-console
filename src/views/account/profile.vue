<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-04 22:42:06
 * @Description: 个人中心
-->
<template>
  <div class="profile-container">
    <ElCard class="profile-card">
      <template #header>
        <span>{{ $t("account.personalCenter") }}</span>
      </template>
      <ElTabs v-model="activeTab">
        <ElTabPane name="profile" :label="$t('account.profile')">
          <ProfileForm :accountInfo="accountInfo" />
        </ElTabPane>

        <ElTabPane name="password" :label="$t('account.changePassword')">
          <PasswordForm :accountInfo="accountInfo" />
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElTabs, ElTabPane } from "element-plus";
// store
import { useAccountStore } from "@/store";
// components
import ProfileForm from "./components/ProfileForm.vue";
import PasswordForm from "./components/PasswordForm.vue";

const activeTab = ref("profile");
const accountStore = useAccountStore();
const accountInfo = accountStore.accountInfo;
</script>

<style scoped>
.profile-container {
  padding: 24px;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
