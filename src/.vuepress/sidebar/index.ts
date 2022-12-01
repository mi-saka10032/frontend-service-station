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
      children: [
        {
          text: "HTML",
          icon: "html",
          prefix: "html/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "CSS",
          icon: "css",
          prefix: "css/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "Javascript",
          icon: "javascript",
          prefix: "javascript/",
          collapsible: true,
          children: "structure",
        },
      ],
    },
  ],
});
