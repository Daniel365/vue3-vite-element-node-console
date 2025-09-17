/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 19:29:39
 * @Description: 全局类型声明
 */
declare global {
  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 语言 */
    language: string;
  }
  /**
   * 响应数据
   */
  interface InterfaceResult<T = any> {
    code: number;
    data: T;
    message: string;
  }

  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T[];
    /** 总数 */
    total: number;
  }
  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }
}
export {};
