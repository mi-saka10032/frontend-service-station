import { navbar } from "vuepress-theme-hope";

export const coreNavbar = navbar([
  "/",
  {
    text: "基础",
    icon: "enum",
    children: [
      { text: "HTML", icon: "html", link: "/base/html/HTML基础" },
      { text: "CSS", icon: "css", link: "/base/css/CSS基础" },
      { text: "Javascript", icon: "javascript", link: "/base/javascript" },
    ],
  },
  {
    text: "框架",
    icon: "frame",
    children: [
      { text: "Vue2", icon: "vue", link: "/vue2/1-简介" },
      { text: "Vue3", icon: "vue", link: "/vue3/1-简介" },
      { text: "React", icon: "react", link: "/react/1-简介" },
    ],
  },
  {
    text: "构建工具",
    icon: "build",
    children: [
      { text: "Webpack", icon: "view", link: "/webpack/2-primary" },
      { text: "VueCli", icon: "view", link: "/webpack/5-vuecli" },
      { text: "Vite", icon: "view", link: "/webpack/6-vite" },
      { text: "Umi", icon: "view", link: "/webpack/8-umi" },
    ],
  },
]);
