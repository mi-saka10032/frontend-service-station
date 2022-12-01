import { sidebar } from "vuepress-theme-hope";

export const coreSidebar = sidebar({
  "/": [
    {
      icon: "discover",
      text: "案例",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "note",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "前端三剑客",
      icon: "enum",
      prefix: "base/",
      children: "structure",
    },
  ],
});
