import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const report = [];
for (const directory of await readdir(path.join(root, "packages"))) {
  const pkg = JSON.parse(
    await readFile(
      path.join(root, "packages", directory, "package.json"),
      "utf8",
    ),
  );
  report.push({ name: pkg.name, version: pkg.version, license: pkg.license });
}
console.log(
  JSON.stringify(
    {
      scope:
        "Workspace packages only; this is not a third-party dependency license audit",
      packages: report,
    },
    null,
    2,
  ),
);
