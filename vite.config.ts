/*
 * @Author: 350296245@qq.com
 * @Date: 2025-08-27 17:19:34
 * @Description:
 */
import vue from "@vitejs/plugin-vue";
import { type ConfigEnv, defineConfig } from "vite";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from 'unocss/vite';
import {
  name,
  version,
  engines,
  dependencies,
  devDependencies,
} from "./package.json";

// 平台的名称、版本、运行所需的 node 版本、依赖、构建时间的类型提示
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProduction = mode === "production";
  return {
    plugins: [
      vue(),
      UnoCSS(),
      Components({
        resolvers: [
          ElementPlusResolver(),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 导入组件类型声明文件路径 (false:关闭自动生成)
        dts: false,
      }),
      // AutoImport({
      //   // 导入 Vue 函数，如：ref, reactive, toRef 等
      //   imports: ["vue", "pinia", "vue-router", "vue-i18n"],
      //   eslintrc: {
      //     enabled: false,
      //     filepath: "./.eslintrc-auto-import.json",
      //     globalsPropValue: true,
      //   },
      //   vueTemplate: true,
      //   // 导入函数类型声明文件路径 (false:关闭自动生成)
      //   dts: false,
      //   // dts: "src/types/auto-imports.d.ts",
      // }),
    ],
    resolve: {
      alias: {
        // 配置 @ 指向 src 目录
        "@": resolve(__dirname, "src"),
      },
    },
    // 代理
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      minify: isProduction ? "terser" : false, // 只在生产环境启用压缩
      terserOptions: isProduction
        ? {
            compress: {
              keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
              drop_console: true, // 生产环境去除 console.log, console.warn, console.error 等
              drop_debugger: true, // 生产环境去除 debugger
              pure_funcs: ["console.log", "console.info"], // 移除指定的函数调用
            },
            format: {
              comments: false, // 删除注释
            },
          }
        : {},
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            // console.log('文件信息', assetInfo.name)
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          },
        },
      },
    },
  };
});
