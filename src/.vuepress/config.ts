import { defineUserConfig } from "vuepress";
import { searchProPlugin, Page } from "vuepress-plugin-search-pro";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  base: "/frontend-service-station/",
  theme,
  title: "前端加油站",
  shouldPrefetch: false,
  plugins: [
    searchProPlugin({
      indexContent: true,
      customFields: [
        {
          getter: (page: Page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page: Page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],
});
