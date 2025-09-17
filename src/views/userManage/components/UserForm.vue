<template>
  <!-- 编辑用户抽屉 -->
  <a-drawer
    :title="$t('userManage.editUser')"
    :open="visible"
    :width="500"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 4 }"
    >
      <a-form-item :label="$t('form.username')" name="username">
        <a-input
          v-model:value="formData.username"
          :placeholder="$t('form.enterUsername')"
        />
      </a-form-item>

      <a-form-item :label="$t('form.role')" name="roleUuid">
        <ApiSelect
          v-model="formData.roleUuid"
          :api="roleManageApi.getList"
          :page-size="50"
          label-field="name"
          value-field="uuid"
          :placeholder="$t('form.selectRole')"
        />
      </a-form-item>

      <a-form-item :label="$t('form.status')" name="status">
        <a-switch
          v-model:checked="formData.status"
          :checked-children="$t('form.enabled')"
          :un-checked-children="$t('form.disabled')"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div style="text-align: right">
        <a-button @click="handleClose" style="margin-right: 8px">
          {{ $t("action.cancel") }}
        </a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t("action.save") }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { message, type FormInstance } from "ant-design-vue";
// api
import { userManageApi, roleManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
// type
import type { UserItem } from "@/api/userManage/data.d";
// components
import ApiSelect from "@/components/ApiSelect/index.vue";

interface Props {
  visible: boolean;
  userData?: UserItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

// 国际化工具
const { getI18nText } = useI18nUtil();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const formData = reactive({
  uuid: "",
  username: "",
  roleUuid: "",
  status: true,
});

// 表单验证规则
const rules = {
  username: [
    {
      required: true,
      message: getI18nText("form.enterUsername"),
      trigger: "blur",
    },
  ],
  roleUuid: [
    {
      required: true,
      message: getI18nText("form.selectRole"),
      trigger: "submit",
    },
  ],
};

// 监听用户数据变化
watch(
  () => props.userData,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        uuid: newData.uuid,
        username: newData.username,
        roleUuid: newData.roleUuid,
        status: newData.status === 1,
      });
    }
  },
  { immediate: true }
);

// 关闭抽屉
const handleClose = () => {
  emit("update:visible", false);
  formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = {
      ...formData,
      status: formData.status ? 1 : 0,
    };

    const response = await userManageApi.onEdit(params).finally(() => {
      loading.value = false;
    });
    handleReturnResults({
      params: response,
      onSuccess: () => {
        message.success(getI18nText("action.submitSuccess"));
        emit("success");
        handleClose();
      },
    });
  } catch (error) {
    message.error(getI18nText("action.submitFailed") + error);
  }
};
</script>
