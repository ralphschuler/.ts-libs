import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "docs", "projects");
await mkdir(output, { recursive: true });

// TypeDoc serializes its file registry relative to each package's working
// directory, but merge mode resolves every registry relative to the root.
// Preserve the real paths before combining the standalone package projects.
for (const entry of await readdir(path.join(root, "packages"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;
  const directory = path.join(root, "packages", entry.name);
  const project = JSON.parse(
    await readFile(path.join(directory, "docs", "docs.json"), "utf8"),
  );
  for (const [id, filename] of Object.entries(project.files.entries)) {
    const absolute = path.resolve(directory, filename);
    await access(absolute);
    project.files.entries[id] = path
      .relative(root, absolute)
      .split(path.sep)
      .join("/");
  }
  await writeFile(
    path.join(output, `${entry.name}.json`),
    JSON.stringify(project) + "\n",
  );
}
