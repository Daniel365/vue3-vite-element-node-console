/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-30 21:11:29
 * @Description: 国际化函数集合
 */

import { useI18n } from "vue-i18n";

export function useI18nUtil() {
  const { locale, t } = useI18n();

  /**
   * 获取I18n文本
   * @param key 词条
   * @param params 词条参数
   */
  const getI18nText = (key: string, params?: any) => {
    return t(key, params);
  };

  return {
    locale,
    getI18nText,
  };
}
