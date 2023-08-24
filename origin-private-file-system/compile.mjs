import { watch, writeFileSync, readFileSync } from "node:fs";

import pug from "pug";
import { JSDOM } from "jsdom";
import { PurgeCSS } from "purgecss";

const input = "bcd.pug";
const output = { html: "index.html", css: "main.css" };

const locals = {};

const compileFile = async () => {
  writeFileSync(output.html, pug.compileFile(input, { self: true })(locals));
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
watch(input, async () => await compileFile());
