import { watch, writeFileSync } from "node:fs";

import pug from "pug";

// pnpx purgecss

const path = "./bcd.pug";

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

const compileFile = () => {
  writeFileSync(`index.html`, pug.compileFile(path, { self: true })(locals));
  console.log(`\x1B[36m${path}\x1B[0m \x1B[2mhas updated\x1B[0m`);
};

compileFile();
watch(path, () => compileFile());
