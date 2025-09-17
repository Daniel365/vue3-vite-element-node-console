import type { Directive, DirectiveBinding } from "vue";

import { useAccountStore } from "@/store";
import { ROLE_ROOT } from "@/constants";

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const requiredPerms = binding.value || [];

    // 校验传入的权限值是否合法
    if (
      !requiredPerms ||
      (typeof requiredPerms !== "string" && !Array.isArray(requiredPerms))
    ) {
      throw new Error(
        "需要提供权限标识！例如：v-has-perm=\"'sys:user:add'\" 或 v-has-perm=\"['sys:user:add', 'sys:user:edit']\""
      );
    }

    const { roleCode, perms = [] } = useAccountStore().accountInfo;

    // 超级管理员拥有所有权限，如果是"*:*:*"权限标识，则不需要进行权限校验
    if (roleCode === ROLE_ROOT || requiredPerms.includes("*:*:*")) {
      return;
    }

    // 检查权限
    const hasAuth = Array.isArray(requiredPerms)
      ? requiredPerms.some((perm) => perms.includes(perm))
      : perms.includes(requiredPerms);

    // 如果没有权限，移除该元素
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },
};

/**
 * 角色权限指令
 */
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const requiredRoles = binding.value;

    // 校验传入的角色值是否合法
    if (
      !requiredRoles ||
      (typeof requiredRoles !== "string" && !Array.isArray(requiredRoles))
    ) {
      throw new Error(
        "需要提供角色标识！例如：v-has-role=\"'ADMIN'\" 或 v-has-role=\"['ADMIN', 'TEST']\""
      );
    }

    const { roleCode } = useAccountStore().accountInfo;

    // 检查是否有对应角色权限
    const hasAuth = Array.isArray(requiredRoles)
      ? requiredRoles.some((role) => roleCode.includes(role))
      : roleCode.includes(requiredRoles);

    // 如果没有权限，移除元素
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },
};
