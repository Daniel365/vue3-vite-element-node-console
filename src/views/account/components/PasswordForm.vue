<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 15:42:53
 * @Description: 修改密码表单
-->

<template>
  <el-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    label-position="top"
    @submit.prevent="handleSubmit"
  >
    <el-form-item :label="$t('account.currentPassword')" prop="currentPassword">
      <el-input
        v-model="formState.currentPassword"
        type="password"
        :placeholder="getRequiredMessage('currentPassword')"
        show-password
      />
    </el-form-item>

    <el-form-item :label="$t('account.verificationCode')" prop="code">
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
    </el-form-item>

    <el-form-item :label="$t('account.newPassword')" prop="password">
      <el-input
        v-model="formState.password"
        type="password"
        :placeholder="getRequiredMessage('newPassword')"
        show-password
      />
    </el-form-item>

    <el-form-item :label="$t('account.confirmPassword')" prop="confirmPassword">
      <el-input
        v-model="formState.confirmPassword"
        type="password"
        :placeholder="getRequiredMessage('confirmPassword')"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="loading">
        {{ $t("account.changePassword") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
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
    email?: string;
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

const getRequiredMessage = (key: string) => getI18nText(`account.message.${key}.required`);
const getMinMessage = (key: string) => getI18nText(`account.message.${key}.min`);

const rules = {
  currentPassword: [{ required: true, message: getRequiredMessage("currentPassword") }],
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
          return Promise.reject(new Error(getI18nText("account.message.passwordMismatch")));
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
    if (newVal?.email) {
      formState.email = newVal.email;
    }
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
        ElMessage.success(getI18nText("account.passwordChangeSuccess"));
        formRef.value?.resetFields();
      },
    });
  } catch (error) {
    console.error("修改密码失败:", error);
    ElMessage.error(getI18nText("account.passwordChangeFail"));
  }
};
</script>
