import { serve, file, write } from "bun";
import tailwind from "tailwindcss";
import postcss from "postcss";
import tailwindConfig from "./tailwind.config.js";

let lastModified = 0;

serve({
  port: 9090,
  async fetch(req) {
    const cssModified = await file("src/index.css").lastModified;
    const htmlModified = await file("src/index.html").lastModified;

    let changed = false;

    if (cssModified > lastModified) {
      lastModified = cssModified;
      changed = true;
    }

    if (htmlModified > lastModified) {
      lastModified = htmlModified;
      changed = true;
    }

    const css = await file("src/index.css").text();
    const html = await file("src/index.html").text();

    if (changed) {
      const result = await postcss([
        tailwind({
          ...tailwindConfig,
          content: [{ raw: html, extension: "html" }],
        }),
      ]).process(css, {
        from: undefined,
      });

      await write("dist/index.css", result.css);
      console.log("reloaded");
    }

    if (req.url.endsWith("/index.css")) {
      return new Response(await file("dist/index.css").text(), {
        headers: { "content-type": "text/css; charset=utf-8" },
      });
    }

    if (req.url.includes("/images/")) {
      const image = req.url.split("/images/")[1];
      const ext = image.split(".")[1];
      const mime = ext === "png" ? "image/png" : "image/jpeg";

      return new Response(await file(`dist/images/${image}`).arrayBuffer(), {
        headers: { "content-type": mime },
      });
    }

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
});

console.log("Listening on http://localhost:9090");