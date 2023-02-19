import { defineUserConfig } from "vuepress";
import { searchProPlugin, Page } from "vuepress-plugin-search-pro";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  base: "/frontend-service-station/",
  theme,
  title: "前端加油站",
  shouldPrefetch: false,
  plugins: [searchProPlugin({ indexContent: true })],
});
