<!--
 * @Author: 350296245@qq.com
 * @Date: 2025-09-06 15:42:37
 * @Description: 个人资料表单
-->

<template>
  <ElForm
    ref="formRef"
    :model="formState"
    :rules="rules"
    label-position="top"
    @submit.prevent="handleSubmit"
  >
    <el-form-item :label="$t('account.username')" prop="username">
      <ElInput
        v-model="formState.username"
        :placeholder="getRequiredMessage('username')"
      />
    </el-form-item>

    <el-form-item :label="$t('account.email')" prop="email">
      <ElInput
        type="email"
        v-model="formState.email"
        :placeholder="getRequiredMessage('email')"
      />
    </el-form-item>

    <el-form-item>
      <ElButton type="primary" native-type="submit" :loading="loading" @click="handleSubmit">
        {{ $t("account.updateProfile") }}
      </ElButton>
    </el-form-item>
  </ElForm>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElForm, ElInput, ElButton, ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
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
        ElMessage.success(getI18nText("action.updateSuccess"));
      },
    });
  } catch (error) {
    console.error("更新个人资料失败:", error);
    ElMessage.error(getI18nText("action.updateFail"));
  }
};
</script>
