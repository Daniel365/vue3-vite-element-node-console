/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-28 20:52:03
 * @Description: alova 实例
 */
import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import { ElMessage } from "element-plus";
// constants
import { ACCESS_TOKEN_KEY } from "../constants";
// utils
import { transformKeys } from "@/utils/format/letter";
import { Storage } from "@/utils/storage";
// types
import { RouterPath } from "@/router/data.d";

/**
 * 处理API返回结果的参数接口
 */
interface HandleReturnResultsParams<T = any> {
  /** API返回的结果数据 */
  params: InterfaceResult<T>;
  /** 成功回调函数 */
  onSuccess: (data: InterfaceResult<T>) => void;
  /** 是否使用默认错误处理 */
  isDefaultError?: boolean;
  /** 错误回调函数 */
  onError?: (data: InterfaceResult<T>) => void;
}

/**
 * 处理API返回结果的通用函数
 * @param options 处理参数
 */
export function handleReturnResults<T = any>({
  params = {
    code: 1,
    data: undefined as T,
    message: "",
  },
  isDefaultError = true,
  onSuccess,
  onError,
}: HandleReturnResultsParams<T>): void {
  let code = params.code;

  if (code === 0) {
    try {
      onSuccess?.(params);
    } catch (e) {
      console.error(e);
    }
  } else {
    switch (code) {
      case 20016:
        // 无权限操作
        break;
      default:
        ElMessage.error(params.message);
        break;
    }

    onError?.(params);
  }
}

/**
 * Alova HTTP客户端实例
 * 配置了请求拦截器、响应拦截器等
 */
const alovaInstance = createAlova({
  baseURL: "/api/v1.0",
  timeout: 10000,
  requestAdapter: adapterFetch(),
  beforeRequest(method) {
    // 设置token
    const acessToken = Storage.get(ACCESS_TOKEN_KEY);
    if (acessToken) {
      method.config.headers.Authorization = acessToken;
    }

    // 转换数据格式 - (小驼峰 -> 下划线)
    if (method.data) {
      method.data = transformKeys({
        data: method.data,
      });
    }
  },
  responded: {
    onSuccess: async (response) => {
      // 处理 401 未授权（Token 失效或不存在）
      if (response?.status === 401) {
        Storage.remove(ACCESS_TOKEN_KEY); // 清除无效 Token
        window.location.href = RouterPath.LOGIN; // 跳转到登录页
      }

      // 登录请求特殊处理：从响应头提取 Token 并存储
      const acessToken = response.headers.get("Authorization");
      if (acessToken && response.ok) {
        Storage.set(ACCESS_TOKEN_KEY, acessToken);
      }
      const res: InterfaceResult = (await response.json()) as any;
      // 转换数据格式 - (下划线 -> 小驼峰)
      const data = transformKeys({
        data: res.data,
        toSnake: false,
      });
      return {
        ...res,
        data,
      };
    },
  },
});

export default alovaInstance;
