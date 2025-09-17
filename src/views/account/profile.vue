<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-04 22:42:06
 * @Description: 个人中心
-->
<template>
  <div class="profile-container">
    <Card :title="$t('account.personalCenter')" class="profile-card">
      <Tabs v-model:activeKey="activeTab">
        <TabPane key="profile" :tab="$t('account.profile')">
          <ProfileForm :accountInfo="accountInfo" />
        </TabPane>

        <TabPane key="password" :tab="$t('account.changePassword')">
          <PasswordForm :accountInfo="accountInfo" />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, Tabs, TabPane } from "ant-design-vue";
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
