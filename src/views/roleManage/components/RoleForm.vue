<template>
  <!-- 新增编辑角色弹窗 -->
  <el-dialog
    :title="isEdit ? $t('roleManage.editRole') : $t('roleManage.addRole')"
    v-model="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" label-width="100px" ref="formRef">
      <el-form-item :label="$t('form.roleName')" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('form.enterRoleName')"
          :maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('form.roleCode')" prop="code">
        <el-input
          v-model="formData.code"
          :placeholder="$t('form.enterRoleCode')"
          :maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item :label="$t('form.roleDesc')" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :placeholder="$t('form.enterRoleDesc')"
          :maxlength="150"
          show-word-limit
          :rows="3"
        />
      </el-form-item>

      <el-form-item :label="$t('form.status')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">{{ $t("form.enabled") }}</el-radio>
          <el-radio :value="0">{{ $t("form.disabled") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
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
import { ref, reactive, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
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
        ElMessage.success(getI18nText("action.submitSuccess"));
        emit("success");
        handleClose();
      },
    });
  } catch (error) {
    ElMessage.error(getI18nText("action.submitFailed"));
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>