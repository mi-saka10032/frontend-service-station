import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  base: "/frontend-service-station/",

  theme,

  title: "前端加油站",

  shouldPrefetch: false,
});
