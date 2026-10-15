import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const findTests = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        if (entry.isDirectory())
          return findTests(path.join(directory, entry.name));
        return entry.name.endsWith(".test.ts")
          ? [path.join(directory, entry.name)]
          : [];
      }),
    )
  ).flat();
};
const requested = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2], "src")
  : null;
const directories = requested
  ? [requested]
  : (await readdir(path.join(root, "packages"))).map((name) =>
      path.join(root, "packages", name, "src"),
    );
const tests = (await Promise.all(directories.map(findTests))).flat().sort();
if (!tests.length)
  throw new Error("No tests found for " + (requested || "the repository"));
const child = spawn(
  process.execPath,
  [
    "--import",
    import.meta.resolve("tsx"),
    "--test",
    "--test-timeout=10000",
    ...tests,
  ],
  { cwd: root, stdio: "inherit" },
);
child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
for (const signal of ["SIGTERM", "SIGINT"])
  process.once(signal, () => child.kill(signal));
