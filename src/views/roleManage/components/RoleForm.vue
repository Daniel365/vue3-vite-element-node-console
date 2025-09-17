<template>
  <!-- 新增编辑角色弹窗 -->
  <a-modal
    :title="isEdit ? $t('roleManage.editRole') : $t('roleManage.addRole')"
    :open="visible"
    :width="500"
    @cancel="handleClose"
    :footer="null"
  >
    <a-form :model="formData" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item :label="$t('form.roleName')" name="name">
        <a-input
          v-model:value="formData.name"
          :placeholder="$t('form.enterRoleName')"
          :maxlength="100"
          show-count
        />
      </a-form-item>

      <a-form-item :label="$t('form.roleCode')" name="code">
        <a-input
          v-model:value="formData.code"
          :placeholder="$t('form.enterRoleCode')"
          :maxlength="100"
          show-count
        />
      </a-form-item>

      <a-form-item :label="$t('form.roleDesc')" name="description">
        <a-textarea
          v-model:value="formData.description"
          :placeholder="$t('form.enterRoleDesc')"
          :maxlength="150"
          show-count
          :rows="3"
        />
      </a-form-item>

      <a-form-item :label="$t('form.status')" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio :value="1">{{ $t("form.enabled") }}</a-radio>
          <a-radio :value="0">{{ $t("form.disabled") }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <div style="text-align: right; margin-top: 24px">
      <a-button @click="handleClose" style="margin-right: 8px">
        {{ $t("action.cancel") }}
      </a-button>
      <a-button type="primary" :loading="loading" @click="handleSubmit">
        {{ $t("action.save") }}
      </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
// api
import { roleManageApi } from "@/api";
// hooks
import { useI18nUtil } from "@/hooks/i18ns";
// utils
import { handleReturnResults } from "@/utils/instance";
// type
import type { RoleListItem } from "@/api/roleManage/data.d";

interface Props {
  visible: boolean;
  roleData?: RoleListItem;
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
  name: "",
  code: "",
  description: "",
  status: 1,
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { max: 100, message: "角色名称不能超过100个字符", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入角色编码", trigger: "blur" },
    { max: 100, message: "角色编码不能超过100个字符", trigger: "blur" },
  ],
  description: [
    { max: 150, message: "角色描述不能超过150个字符", trigger: "blur" },
  ],
};

// 是否为编辑模式
const isEdit = computed(() => !!props.roleData?.uuid);

// 监听角色数据变化
watch(
  () => props.roleData,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        uuid: newData.uuid || "",
        name: newData.name || "",
        code: newData.code || "",
        description: newData.description || "",
        status: newData.status,
      });
    } else {
      // 新增时重置表单
      Object.assign(formData, {
        uuid: "",
        name: "",
        code: "",
        description: "",
        status: 1,
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
      status: formData.status,
    };
    let response: any;
    if (isEdit.value) {
      response = await roleManageApi.onEdit(params).finally(() => {
        loading.value = false;
      });
    } else {
      response = await roleManageApi.onCreate(params).finally(() => {
        loading.value = false;
      });
    }
    handleReturnResults({
      params: response,
      onSuccess: () => {
        message.success(getI18nText("action.submitSuccess"));
        emit("success");
        handleClose();
      },
    });
  } catch (error) {
    message.error(getI18nText("action.submitFailed"));
  }
};
</script>
