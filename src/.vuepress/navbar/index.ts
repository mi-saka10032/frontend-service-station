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
      { text: "VueCli", icon: "vue", link: "/webpack/5-vuecli" },
      { text: "Vite", icon: "valine", link: "/webpack/6-vite" },
      { text: "Umi", icon: "react", link: "/webpack/8-umi" },
    ],
  },
  {
    text: "性能优化",
    icon: "launch",
    children: [
      { text: "界面交互", icon: "chrome", link: "/performance/2-interactive" },
      { text: "性能指标", icon: "ability", link: "/performance/3-target" },
      { text: "缓存技术", icon: "cache", link: "/performance/5-cache" },
      { text: "Nginx", icon: "nginx", link: "/performance/6-nginx" },
    ],
  },
]);
