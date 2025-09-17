<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-29 14:54:02
 * @Description: 
-->
<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-08-29 14:54:02
 * @Description: 注册
-->
<template>
  <AdminContainer :form-title="$t('admin.userRegister')">
    <el-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="username">
        <el-input
          v-model="formState.username"
          size="large"
          :placeholder="getRequiredMessage('username')"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="formState.password"
          type="password"
          size="large"
          :placeholder="getRequiredMessage('password')"
          show-password
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="formState.confirmPassword"
          type="password"
          size="large"
          :placeholder="getRequiredMessage('confirmPassword')"
          show-password
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          v-model="formState.email"
          size="large"
          type="email"
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
              type: EmailVerificationType.REGISTER,
            })
          "
        />
      </el-form-item>
      <!-- 协议 -->
      <el-form-item>
        <el-checkbox v-model="formState.agree"
          >{{ $t("admin.agree") }}
          <a href="#">《{{ $t("admin.userAgreement") }}》</a>
          <span>、</span>
          <a href="#">《{{ $t("admin.privacyPolicy") }}》</a>
        </el-checkbox>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          size="large"
          :loading="loading"
          class="admin-button"
          style="width: 100%"
        >
          {{ $t(loading ? "common.submiting" : "admin.register") }}
        </el-button>
      </el-form-item>

      <!-- 已有账号、去登录 -->
      <div class="admin-actions">
        <span>{{ $t("admin.haveAccount") }}</span>
        <a @click.prevent="goToPage(RouterPath.LOGIN)">{{
          $t("admin.goLogin")
        }}</a>
      </div>
    </el-form>
  </AdminContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
// api
import { adminManageApi, commonApi } from "@/api";
// utils
import { handleReturnResults } from "@/utils/instance";
import { useRouteUtil } from "@/hooks/route";
import { useI18nUtil } from "@/hooks/i18ns";
// type
import { RouterPath } from "@/router/data.d";
import { EmailVerificationType } from "@/api/common/data.d";
// components
import CodeInput from "@/components/CodeInput/index.vue";
import AdminContainer from "@/components/AdminContainer/index.vue";

const { goToPage } = useRouteUtil();
const { getI18nText } = useI18nUtil();
const formRef = ref();
const loading = ref(false);

const formState = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  code: "",
  agree: true,
});

const getRequiredMessage = (key: string) =>
  getI18nText(`admin.message.${key}.required`);
const getMinMessage = (key: string) => getI18nText(`admin.message.${key}.min`);

const rules = {
  username: [
    { required: true, message: getRequiredMessage("username") },
    { min: 3, message: getMinMessage("username") },
  ],
  password: [
    { required: true, message: getRequiredMessage("password") },
    { min: 6, message: getMinMessage("password") },
  ],
  confirmPassword: [
    { required: true, message: getRequiredMessage("confirmPassword") },
    {
      validator: (_: any, value: string) => {
        if (value && value !== formState.password)
          return Promise.reject(
            getI18nText(`admin.message.confirmPassword.inconformity`)
          );
        return Promise.resolve();
      },
    },
  ],
  email: [{ required: true, message: getRequiredMessage("email") }],
  code: [
    { required: true, message: getRequiredMessage("code") },
    {
      len: 6,
      message: getMinMessage("code"),
      transform: (v: string) => v?.trim(),
    },
  ],
  agree: [{ required: true, message: getRequiredMessage("agree") }],
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    await formRef.value.validate();

    const response = await adminManageApi.onRegister(formState).finally(() => {
      loading.value = false;
    });
    handleReturnResults({
      params: response,
      onSuccess: () => {
        ElMessage.success(getI18nText("admin.registerSuccess"));
        goToPage(RouterPath.LOGIN);
      },
    });
  } catch (e) {
    ElMessage.error(getI18nText("admin.registerError"));
  }
};
</script>
