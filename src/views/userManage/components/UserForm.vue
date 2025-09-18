<template>
  <!-- 编辑用户抽屉 -->
  <el-drawer
    :title="$t('userManage.editUser')"
    v-model="visible"
    :size="500"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item :label="$t('form.username')" prop="username">
        <el-input
          v-model="formData.username"
          :placeholder="$t('form.enterUsername')"
        />
      </el-form-item>

      <el-form-item :label="$t('form.role')" prop="roleUuid">
        <ApiSelect
          v-model="formData.roleUuid"
          :api="roleManageApi.getList"
          :page-size="50"
          label-field="name"
          value-field="uuid"
          :placeholder="$t('form.selectRole')"
        />
      </el-form-item>

      <el-form-item :label="$t('form.status')" prop="status">
        <el-switch
          v-model="formData.status"
          :active-text="$t('form.enabled')"
          :inactive-text="$t('form.disabled')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="handleClose" style="margin-right: 8px">
          {{ $t("action.cancel") }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t("action.save") }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
// api
import { userManageApi, roleManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
// type
import type { UserListItem } from "@/api/userManage/data.d";
// components
import ApiSelect from "@/components/ApiSelect/index.vue";

interface Props {
  visible: boolean;
  userData?: UserListItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

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
        ElMessage.success(getI18nText("action.submitSuccess"));
        emit("success");
        handleClose();
      },
    });
  } catch (error) {
    ElMessage.error(getI18nText("action.submitFailed") + error);
  }
};
</script>
