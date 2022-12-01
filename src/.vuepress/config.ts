import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  base: "/",

  theme,

  title: "前端加油站",

  shouldPrefetch: false,
});
