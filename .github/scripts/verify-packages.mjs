import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { modules } from "../../documentation/catalog.mjs";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const packages = path.join(root, "packages");
const directories = (await readdir(packages)).sort();
const mode = process.argv[2] ?? "imports";
assert.ok(
  ["imports", "examples"].includes(mode),
  "Expected imports or examples",
);
assert.equal(
  modules.length,
  directories.length,
  "Every workspace must remain documented",
);

const run = (args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      signal: AbortSignal.timeout(10_000),
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (value) => {
      stdout += value;
    });
    child.stderr.on("data", (value) => {
      stderr += value;
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0 && !signal) resolve();
      else
        reject(
          new Error(
            cwd + ": " + (signal ?? code) + "\n" + stdout + "\n" + stderr,
          ),
        );
    });
  });
for (const name of directories) {
  const directory = path.join(packages, name);
  const manifest = JSON.parse(
    await readFile(path.join(directory, "package.json"), "utf8"),
  );
  assert.ok(
    !manifest.scripts.test.includes("no test specified"),
    name + ": placeholder test script",
  );
  assert.ok(
    modules.some((module) => module.slug === name),
    name + ": missing documentation",
  );
  await access(path.join(directory, "src/index.ts"));
  const tests = (await readdir(path.join(directory, "src"))).filter((file) =>
    file.endsWith(".test.ts"),
  );
  assert.ok(tests.length, name + ": no representative tests");
  await access(path.join(directory, "examples/basic.ts"));
  if (mode === "examples") {
    await run(
      [
        "--import",
        import.meta.resolve("tsx"),
        path.join(directory, "examples/basic.ts"),
      ],
      directory,
    );
  } else {
    const entry = manifest.exports?.["."]?.import;
    assert.ok(entry, name + ": no public import entry");
    await access(path.join(directory, manifest.exports["."].types));
    const url = pathToFileURL(path.resolve(directory, entry)).href;
    await run(
      [
        "--input-type=module",
        "-e",
        `
      import assert from "node:assert/strict";
      const writes=[];
      process.stdout.write=(value)=>{writes.push(String(value));return true;};
      const before=process.getActiveResourcesInfo().filter(type=>["Timeout","TCPServerWrap","UDPWrap"].includes(type));
      const module=await import(${JSON.stringify(url)});
      await new Promise(resolve=>setImmediate(resolve));
      assert.ok(Object.keys(module).length,"Empty public API");
      assert.deepEqual(writes,[],"Import wrote to stdout");
      const after=process.getActiveResourcesInfo().filter(type=>["Timeout","TCPServerWrap","UDPWrap"].includes(type));
      assert.deepEqual(after,before,"Import allocated a timer or listening socket");
    `,
      ],
      directory,
    );
  }
}
console.log("Verified " + directories.length + " package " + mode + ".");
