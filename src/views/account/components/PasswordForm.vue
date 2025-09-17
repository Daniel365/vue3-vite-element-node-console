<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 15:42:53
 * @Description: 修改密码表单
-->

<template>
  <Form
    ref="formRef"
    :model="formState"
    :rules="rules"
    layout="vertical"
    @finish="handleSubmit"
  >
    <Form.Item :label="$t('account.currentPassword')" name="currentPassword">
      <Input.Password
        v-model:value="formState.currentPassword"
        :placeholder="getRequiredMessage('currentPassword')"
      />
    </Form.Item>

    <Form.Item :label="$t('account.verificationCode')" name="code">
      <CodeInput
        v-model:modelValue="formState.code"
        :placeholder="getRequiredMessage('code')"
        :target="formState.email"
        :sendCodeApi="
          commonApi.onSendEmailCode({
            email: formState.email,
            type: EmailVerificationType.EDIT_PASSWORD,
          })
        "
      />
    </Form.Item>

    <Form.Item :label="$t('account.newPassword')" name="password">
      <Input.Password
        v-model:value="formState.password"
        :placeholder="getRequiredMessage('newPassword')"
      />
    </Form.Item>

    <Form.Item :label="$t('account.confirmPassword')" name="confirmPassword">
      <Input.Password
        v-model:value="formState.confirmPassword"
        :placeholder="getRequiredMessage('confirmPassword')"
      />
    </Form.Item>

    <Form.Item>
      <Button type="primary" html-type="submit" :loading="loading">
        {{ $t("account.changePassword") }}
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
// api
import { accountManageApi, commonApi } from "@/api";
// utils
import { handleReturnResults } from "@/utils/instance";
// type
import { EmailVerificationType } from "@/api/common/data.d";
// components
import CodeInput from "@/components/CodeInput/index.vue";

interface Props {
  accountInfo: {
    email: string;
  };
}

const props = defineProps<Props>();
const { getI18nText } = useI18nUtil();
const formRef = ref<FormInstance>();
const loading = ref<boolean>(false);

const formState = reactive({
  currentPassword: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
});

const getRequiredMessage = (key: string) =>
  getI18nText(`account.message.${key}.required`);
const getMinMessage = (key: string) =>
  getI18nText(`account.message.${key}.min`);

const rules = {
  currentPassword: [
    { required: true, message: getRequiredMessage("currentPassword") },
  ],
  code: [{ required: true, message: getRequiredMessage("code") }],
  password: [
    { required: true, message: getRequiredMessage("newPassword") },
    { min: 6, message: getMinMessage("password") },
  ],
  confirmPassword: [
    { required: true, message: getRequiredMessage("confirmPassword") },
    {
      validator: (_: any, value: string) => {
        if (value && value !== formState.password) {
          return Promise.reject(
            getI18nText("account.message.passwordMismatch")
          );
        }
        return Promise.resolve();
      },
    },
  ],
};

// 监听props变化更新表单
watch(
  () => props.accountInfo,
  (newVal) => {
    formState.email = newVal.email;
  },
  { immediate: true }
);

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    const response = await accountManageApi
      .editPassword(formState)
      .finally(() => (loading.value = false));

    handleReturnResults({
      params: response,
      onSuccess: () => {
        message.success(getI18nText("account.passwordChangeSuccess"));
        formRef.value?.resetFields();
      },
    });
  } catch (error) {
    console.error("修改密码失败:", error);
    message.error(getI18nText("account.passwordChangeFail"));
  }
};
</script>
