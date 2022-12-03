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
]);
