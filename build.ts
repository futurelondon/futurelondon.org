import { file, write } from "bun";
import tailwind from "tailwindcss";
import postcss from "postcss";
import tailwindConfig from "./tailwind.config.js";

const css = await file("src/index.css").text();
const html = await file("src/index.html").text();

const result = await postcss([
  tailwind({
    ...tailwindConfig,
    content: [{ raw: html, extension: "html" }],
  }),
]).process(css, {
  from: undefined,
});

await write("docs/index.css", result.css);

write("docs/index.css", result.css);
write("docs/index.html", html);

console.log("built");
