<!--
  * @Author: 350296245@qq.com
  * @Date: 2025-09-13 21:37:04
  * @Description: 树形菜单多选
 -->
<template>
  <a-drawer
    v-model:open="visible"
    :title="title || $t('menuManage.permissionAssignment', { roleName: '-' })"
    placement="right"
    :width="400"
    @close="handleClose"
  >
    <div class="menu-tree-drawer">
      <div class="search-box">
        <a-input
          v-model:value="searchValue"
          :placeholder="$t('menuManage.menuPermissionName')"
          :suffix-icon="h(SearchOutlined)"
        />
        <a-button type="link" @click="handleCollapse">{{
          $t("menuManage.collapse")
        }}</a-button>
      </div>

      <div class="control-box">
        <a-checkbox v-model:checked="checkStrictly">{{
          $t("menuManage.parentChildLinked")
        }}</a-checkbox>
      </div>

      <div class="tree-container">
        <a-tree
          v-model:checkedKeys="checkedKeys"
          :tree-data="treeData"
          :field-names="{ title: 'label', key: 'value', children: 'children' }"
          checkable
          :check-strictly="!checkStrictly"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="false"
          @expand="onExpand"
          @check="onCheck"
        />
      </div>

      <div class="footer-actions">
        <a-button @click="handleCancel">{{ $t("action.cancel") }}</a-button>
        <a-button type="primary" @click="handleConfirm">{{
          $t("action.confirm")
        }}</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, h } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { menuManageApi } from "@/api";
import { handleReturnResults } from "@/utils/instance";
import { isObject } from "@/utils/dataJudgment";

interface TreeNode {
  label: string;
  value: number | string;
  children?: TreeNode[];
}

interface Props {
  open?: boolean;
  title?: string;
  modelValue?: (string | number)[];
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: "",
  modelValue: () => [],
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:modelValue": [value: (string | number)[]];
  confirm: [value: (string | number)[]];
}>();

const visible = ref(props.open);
const searchValue = ref("");
const treeData = ref<TreeNode[]>([]);
const checkedKeys = ref<(string | number)[]>(props.modelValue);
const expandedKeys = ref<(string | number)[]>([]);
const checkStrictly = ref(false);

watch(
  () => props.open,
  (val) => {
    visible.value = val;
  }
);

watch(
  () => props.modelValue,
  (val) => {
    checkedKeys.value = val;
  }
);

watch(visible, (val) => {
  emit("update:open", val);
});

const getTreeList = async () => {
  try {
    const response = await menuManageApi.getTreeList();
    handleReturnResults({
      params: response,
      onSuccess: (res) => {
        treeData.value = res.data?.list || [];
        // 默认展开第一层
        expandedKeys.value = treeData.value.map((item) => item.value);
      },
    });
  } catch (error) {
    console.error("获取菜单树失败:", error);
  }
};

const onExpand = (keys: (string | number)[]) => {
  expandedKeys.value = keys;
};

const onCheck = (data: any) => {
  checkedKeys.value = isObject(data) ? data.checked : data;
};

const handleCollapse = () => {
  expandedKeys.value = [];
};

const handleClose = () => {
  visible.value = false;
};

const handleCancel = () => {
  checkedKeys.value = props.modelValue;
  visible.value = false;
};

const getAllParentIds = (
  nodeId: string | number,
  data: TreeNode[]
): (string | number)[] => {
  const parentIds: (string | number)[] = [];

  const findParent = (
    nodes: TreeNode[],
    targetId: string | number
  ): TreeNode | null => {
    for (const node of nodes) {
      if (node.children?.some((child) => child.value === targetId)) {
        return node;
      }
      if (node.children) {
        const found = findParent(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  let currentId = nodeId;
  while (currentId) {
    const parent = findParent(data, currentId);
    if (parent) {
      parentIds.unshift(parent.value);
      currentId = parent.value;
    } else {
      break;
    }
  }

  return parentIds;
};

const handleConfirm = async () => {
  console.log("checkedKeysVal", checkedKeys.value);
  const allIds = new Set(checkedKeys.value);

  // 为每个选中的节点添加其所有父级ID
  checkedKeys.value.forEach((id) => {
    const parentIds = getAllParentIds(id, treeData.value);
    parentIds.forEach((parentId) => allIds.add(parentId));
  });

  const finalKeys = Array.from(allIds);
  emit("update:modelValue", finalKeys);
  emit("confirm", finalKeys);
  visible.value = false;
};

onMounted(() => {
  getTreeList();
});
</script>

<style scoped>
.menu-tree-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-box {
  margin-bottom: 12px;
  display: flex;
}

.control-box {
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
