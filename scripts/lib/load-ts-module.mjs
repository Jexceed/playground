import { build } from "vite";
import { resolve } from "node:path";

// The curriculum is a local, pure-data module graph. Use the same TypeScript
// compiler pipeline as the application instead of rewriting import strings.
export async function loadTypeScriptModule(entry) {
  const result = await build({
    configFile: false,
    root: process.cwd(),
    publicDir: false,
    logLevel: "silent",
    build: {
      ssr: resolve(entry),
      write: false,
      minify: false,
      rollupOptions: { output: { format: "es", inlineDynamicImports: true } },
    },
  });
  const outputs = Array.isArray(result)
    ? result.flatMap((item) => item.output)
    : result.output;
  const chunks = outputs.filter((item) => item.type === "chunk");
  if (chunks.length !== 1)
    throw new Error(
      `Expected one curriculum module, received ${chunks.length}`,
    );
  return import(
    `data:text/javascript;base64,${Buffer.from(chunks[0].code).toString("base64")}`
  );
}
