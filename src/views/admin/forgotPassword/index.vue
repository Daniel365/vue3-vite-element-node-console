<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-04 22:42:06
 * @Description: 忘记密码
-->

<template>
  <AdminContainer :form-title="$t('admin.forgetPassword')">
    <el-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="email">
        <el-input
          type="email"
          v-model="formState.email"
          size="large"
          :placeholder="getRequiredMessage('email')"
        />
      </el-form-item>

      <el-form-item prop="code">
        <CodeInput
          v-model:modelValue="formState.code"
          :placeholder="getRequiredMessage('code')"
          :target="formState.email"
          :sendCodeApi="
            commonApi.onSendEmailCode({
              email: formState.email,
              type: EmailVerificationType.RESET_PASSWORD,
            })
          "
        />
      </el-form-item>

      <el-form-item prop="newPassword">
        <el-input
          v-model="formState.newPassword"
          type="password"
          size="large"
          :placeholder="getRequiredMessage('newPassword')"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          size="large"
          :loading="loading"
          class="admin-button"
          style="width: 100%"
        >
          {{ $t("admin.resetPassword") }}
        </el-button>
      </el-form-item>

      <div class="admin-actions">
        <a @click.prevent="goToPage(RouterPath.LOGIN)">
          {{ $t("admin.login") }}
        </a>
      </div>
    </el-form>
  </AdminContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
// api
import { adminManageApi, commonApi } from "@/api";
// hooks
import { useRouteUtil } from "@/hooks/route";
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
// type
import { RouterPath } from "@/router/data.d";
import { EmailVerificationType } from "@/api/common/data.d";
// components
import AdminContainer from "@/components/AdminContainer/index.vue";
import CodeInput from "@/components/CodeInput/index.vue";

const { goToPage } = useRouteUtil();
const { getI18nText } = useI18nUtil();
const formRef = ref<FormInstance>();
const loading = ref<boolean>(false);

const formState = reactive({
  email: "",
  code: "",
  newPassword: "",
});

const getRequiredMessage = (key: string) =>
  getI18nText(`admin.message.${key}.required`);
const getMinMessage = (key: string) => getI18nText(`admin.message.${key}.min`);

const rules = {
  email: [{ required: true, message: getRequiredMessage("email") }],
  code: [{ required: true, message: getRequiredMessage("code") }],
  newPassword: [
    { required: true, message: getRequiredMessage("newPassword") },
    { min: 6, message: getMinMessage("password") },
  ],
};

// 提交
const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    const response = await adminManageApi
      .onResetPassword(formState)
      .finally(() => (loading.value = false));

    handleReturnResults({
      params: response,
      onSuccess: () => {
        ElMessage.success(getI18nText("action.resetSuccess"));
        goToPage(RouterPath.LOGIN);
      },
    });
  } catch (error) {
    console.error("重置密码失败:", error);
    ElMessage.error(getI18nText("action.resetFail"));
  }
};
</script>
