<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 15:42:37
 * @Description: 个人资料表单
-->

<template>
  <Form
    ref="formRef"
    :model="formState"
    :rules="rules"
    layout="vertical"
    @finish="handleSubmit"
  >
    <Form.Item :label="$t('account.username')" name="username">
      <Input
        v-model:value="formState.username"
        :placeholder="getRequiredMessage('username')"
      />
    </Form.Item>

    <Form.Item :label="$t('account.email')" name="email">
      <Input
        type="email"
        v-model:value="formState.email"
        :placeholder="getRequiredMessage('email')"
      />
    </Form.Item>

    <Form.Item>
      <Button type="primary" html-type="submit" :loading="loading">
        {{ $t("account.updateProfile") }}
      </Button>
    </Form.Item>
  </Form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Form, Input, Button, message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// store
import { useAccountStore } from "@/store";
// api
import { accountManageApi } from "@/api";
// utils
import { handleReturnResults } from "@/utils/instance";

const { getI18nText } = useI18nUtil();
const { accountInfo, setAccountInfo } = useAccountStore();
const formRef = ref<FormInstance>();
const loading = ref<boolean>(false);

const formState: { username?: string; email?: string } = reactive({
  username: "",
  email: "",
});

watch(
  () => accountInfo,
  (newVal) => {
    if (newVal) {
      formState.username = newVal.username;
      formState.email = newVal.email;
    }
  },
  { immediate: true }
);

const getRequiredMessage = (key: string) =>
  getI18nText(`account.message.${key}.required`);

const rules = {
  username: [{ required: true, message: getRequiredMessage("username") }],
  email: [{ required: true, message: getRequiredMessage("email") }],
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    const response = await accountManageApi
      .editProfile(formState)
      .finally(() => (loading.value = false));

    handleReturnResults({
      params: response,
      onSuccess: () => {
        // 更新store中的accountInfo
        setAccountInfo(formState);
        message.success(getI18nText("action.updateSuccess"));
      },
    });
  } catch (error) {
    console.error("更新个人资料失败:", error);
    message.error(getI18nText("action.updateFail"));
  }
};
</script>
