import { hopeTheme } from "vuepress-theme-hope";
import { coreNavbar } from "./navbar";
import { coreSidebar } from "./sidebar";

export default hopeTheme({
  hostname: "http://localhost:8080",

  author: {
    name: "Misaka10032",
    url: "https://github.com/mi-saka10032?tab=repositories",
    email: "misaka10032@aliyun.com",
  },

  iconAssets: "iconfont",

  logo: "/misaka10032.png",

  repo: "mi-saka10032/frontend-service-station",

  repoDisplay: true,

  docsDir: "demo/theme-docs/src",

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  navbar: coreNavbar,

  sidebar: coreSidebar,

  footer: "Default footer",

  displayFooter: false,

  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  plugins: {
    // If you don’t need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    // comment: {
    //   /**
    //    * Using Giscus
    //    */
    //   // provider: "Giscus",
    //   // repo: "vuepress-theme-hope/giscus-discussions",
    //   // repoId: "R_kgDOG_Pt2A",
    //   // category: "Announcements",
    //   // categoryId: "DIC_kwDOG_Pt2M4COD69",

    //   /**
    //    * Using Twikoo
    //    */
    //   // provider: "Twikoo",
    //   // envId: "https://twikoo.ccknbc.vercel.app",

    //   /**
    //    * Using Waline
    //    */
    //   provider: "Waline",
    //   serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: false,
      flowchart: true,
      gfm: true,
      imageLazyload: true,
      imageTitle: true,
      imageSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      manifest: {
        icons: [
          {
            src: "/misaka10032.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
        ],
      },
    },

    photoSwipe: true,
  },
});
