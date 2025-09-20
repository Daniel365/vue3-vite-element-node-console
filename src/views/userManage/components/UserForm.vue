<template>
  <!-- 编辑用户抽屉 -->
  <el-dialog :title="$t('userManage.editUser')" v-model="visible" :width="500" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item :label="$t('form.username')" prop="username">
        <el-input v-model="formData.username" :placeholder="$t('form.enterUsername')" />
      </el-form-item>

      <el-form-item :label="$t('form.role')" prop="roleUuid">
        <ApiSelect
          v-model="formData.roleUuid"
          :api="roleManageApi.getList"
          label-field="name"
          value-field="uuid"
          :placeholder="$t('form.selectRole')"
        />
      </el-form-item>

      <el-form-item :label="$t('form.status')" prop="status">
        <radio-group v-model="formData.status" :options="enabledStatusOptions" />
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
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance } from "element-plus";
// api
import { userManageApi, roleManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
import { enabledStatusOptions } from "@/utils/options";
// type
import type { UserListItem } from "@/api/userManage/data.d";
// components
import ApiSelect from "@/components/ApiSelect/index.vue";

/**
 * 组件属性接口
 */
interface Props {
  /** 抽屉显示状态 */
  visible: boolean;
  /** 编辑的用户数据 */
  userData?: UserListItem;
}

/**
 * 组件属性定义
 */
const props = defineProps<Props>();

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 更新显示状态 */
  "update:visible": [value: boolean];
  /** 操作成功事件 */
  success: [];
}>();

/**
 * 双向绑定显示状态
 */
const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

/**
 * 国际化工具
 */
const { getI18nText } = useI18nUtil();

/**
 * 表单引用
 */
const formRef = ref<FormInstance>();

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 表单数据接口
 */
interface FormData {
  /** 用户UUID */
  uuid: string;
  /** 用户名 */
  username: string;
  /** 角色UUID */
  roleUuid: string;
  /** 用户状态 */
  status: number;
}

/**
 * 表单数据
 */
const formData = reactive<FormData>({
  uuid: "",
  username: "",
  roleUuid: "",
  status: 0,
});

/**
 * 表单验证规则
 */
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

/**
 * 监听用户数据变化，自动填充表单
 */
watch(
  () => props.userData,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        uuid: newData.uuid,
        username: newData.username,
        roleUuid: newData.roleUuid,
        status: newData.status,
      });
    }
  },
  { immediate: true }
);

/**
 * 关闭抽屉并重置表单
 */
const handleClose = () => {
  emit("update:visible", false);
  formRef.value?.resetFields();
};

/**
 * 提交表单数据
 */
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const response = await userManageApi.onEdit(formData).finally(() => {
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
