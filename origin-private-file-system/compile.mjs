import { watch, writeFileSync, readFileSync } from "node:fs";

import pug from "pug";
import { JSDOM } from "jsdom";
import { PurgeCSS } from "purgecss";

const path = "bcd.pug";

const locals = {
  check: (key, value) => {
    if (!Object.keys(locals[key]).includes(value)) {
      throw new Error(
        `Unexpected value "${value}". Must be one of [${Object.keys(
          locals[key],
        ).join(", ")}].`,
      );
    }
  },
  platformsTitle: {
    desktop: "桌面",
    mobile: "移动",
    server: "服务器",
  },
  browsers: {
    chrome: { icon: "chrome", text: "Chrome" },
    edge: { icon: "edge", text: "Edge" },
    firefox: { icon: "simple-firefox", text: "Firefox" },
    opera: { icon: "opera", text: "Opera" },
    safari: { icon: "safari", text: "Safari" },
    chrome_android: { icon: "chrome", text: "Chrome Android" },
    firefox_android: { icon: "simple-firefox", text: "Firefox for Android" },
    opera_android: { icon: "opera", text: "Opera Android" },
    safari_ios: { icon: "safari", text: "Safari on iOS" },
    samsunginternet_android: {
      icon: "samsunginternet",
      text: "Samsung Internet",
    },
    webview_android: { icon: "webview", text: "WebView Android" },
    deno: { icon: "deno", text: "Deno" },
    nodejs: { icon: "nodejs", text: "Node.js" },
  },
  supportStatus: {
    yes: "完全支持",
    partial: "部分支持",
    preview: "开发中。在预发布版本中支持。",
    no: "不支持",
    unknown: "兼容性未知",
    experimental: "实验性。期待的行为在未来会发生变化。",
    nonstandard: "非标准。使用前请检查跨浏览器支持。",
    deprecated: "已废弃。不应在新网站中使用。",
    footnote: "查看实现说明。",
    disabled: "用户必须明确启用该功能。",
    altname: "使用非标准名称。",
    prefix: "要求使用供应商前缀或不同的名称。",
    more: "拥有更多兼容性信息。",
  },
};

const compileFile = async () => {
  const output = { html: "image.svg", css: "main.css" };

  writeFileSync(output.html, pug.compileFile(path, { self: true })(locals));
  console.log(`\x1B[36m${output.html}\x1B[0m \x1B[2mhas updated\x1B[0m`);

  // const {
  //   window: { document },
  // } = new JSDOM(readFileSync(output.html, { encoding: "utf-8" }));
  // const allClasses = [].concat(
  //   ...[...document.querySelectorAll("*")].map((el) => [...el.classList]),
  // );
  // const [{ css: minCss }] = await new PurgeCSS().purge({
  //   content: ["index.html"],
  //   css: ["main.b9154aa3.css"],
  //   safelist: [...new Set(allClasses)],
  // });
  // writeFileSync(
  //   output.css,
  //   minCss.replaceAll("/static/", "https://developer.mozilla.org/static/"),
  // );
  // console.log(`\x1B[36m${output.css}\x1B[0m \x1B[2mhas updated\x1B[0m`);
};

await compileFile();
watch(path, async () => await compileFile());
