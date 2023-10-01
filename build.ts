import { file, write } from "bun";
import tailwind from "tailwindcss";
import postcss from "postcss";
import tailwindConfig from "./tailwind.config.js";
import cssnanoPlugin from "cssnano";

const css = await file("src/index.css").text();
const cssModified = await file("src/index.css").lastModified;
let html = await file("src/index.html").text();

const result = await postcss([
  tailwind({
    ...tailwindConfig,
    content: [{ raw: html, extension: "html" }],
  }),
  cssnanoPlugin(),
]).process(css, {
  from: undefined,
});

await write("docs/index.css", result.css);

html = html.replace(
  '<link rel="stylesheet" href="/index.css" />',
  `<link rel="stylesheet" href="/index.css?${cssModified}" />`
);

write("docs/index.css", result.css);
write("docs/index.html", html);

console.log("built");
