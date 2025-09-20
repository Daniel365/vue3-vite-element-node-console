/**
 * 存储键常量统一管理
 * 包括 localStorage、sessionStorage 等各种存储的键名
 */

// 🔐 用户认证相关
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const REMEMBER_ME_KEY = "remember_me";

// 🎨 系统设置相关
export const SHOW_TAGS_VIEW_KEY = "showTagsView";
export const SHOW_APP_LOGO_KEY = "showAppLogo";
export const SHOW_WATERMARK_KEY = "showWatermark";
export const LAYOUT_KEY = "layout";
export const SIDEBAR_COLOR_SCHEME_KEY = "sidebarColorScheme";
export const THEME_KEY = "theme";
export const THEME_COLOR_KEY = "themeColor";

// 设置相关键集合
export const SETTINGS_KEYS = {
  SHOW_TAGS_VIEW: SHOW_TAGS_VIEW_KEY,
  SHOW_APP_LOGO: SHOW_APP_LOGO_KEY,
  SHOW_WATERMARK: SHOW_WATERMARK_KEY,
  SIDEBAR_COLOR_SCHEME: SIDEBAR_COLOR_SCHEME_KEY,
  LAYOUT: LAYOUT_KEY,
  THEME_COLOR: THEME_COLOR_KEY,
  THEME: THEME_KEY,
} as const;
