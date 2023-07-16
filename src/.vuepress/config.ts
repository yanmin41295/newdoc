import {defineUserConfig} from "vuepress";
import theme from "./theme";
import registerComponentsPlugin from "@vuepress/plugin-register-components";
import {viteBundler} from "@vuepress/bundler-vite";
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as path from "path"

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "文档演示",
    description: "vuepress-theme-hope 的文档演示",
    theme,
    plugins: [
        registerComponentsPlugin({
                componentsDir: path.resolve(__dirname, './component'),
                componentsPatterns: ["*.vue", "*.tsx"]
            }
        )
    ],
    bundler: viteBundler({
        viteOptions: {
            plugins: [
                vueJsx(),
            ],
            server: {
                proxy: {
                    "/api": {
                        target: "http://plantuml.mindmine.top",
                        changeOrigin: true,
                        rewrite: (path: string) => {
                            console.log(path)
                            return path.replace(/^\/api/, "")
                        },
                    },
                },
            },
        },
        vuePluginOptions: {},
    }),
});
