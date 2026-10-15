import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const pages = path.join(root, ".pages");
const artifacts = path.join(root, ".artifacts/browser");
await mkdir(artifacts, { recursive: true });
const server = createServer(async (request, response) => {
  try {
    let route = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!route.startsWith("/.ts-libs/")) {
      response.writeHead(404).end();
      return;
    }
    route = route.slice("/.ts-libs/".length);
    if (!route || route.endsWith("/")) route += "index.html";
    const target = path.resolve(pages, route);
    if (!target.startsWith(pages + path.sep)) throw new Error("Invalid path");
    const extension = path.extname(target);
    response.setHeader(
      "Content-Type",
      {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      }[extension] ?? "application/octet-stream",
    );
    response.end(await readFile(target));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = "http://127.0.0.1:" + server.address().port;
let browser;
let socket;
try {
  let debug = process.env.BROWSER_DEBUG_URL;
  if (!debug) {
    const profile = await mkdtemp(path.join(os.tmpdir(), "ts-libs-browser-"));
    browser = spawn(
      process.env.CHROME_PATH ?? "chromium",
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-background-networking",
        "--remote-debugging-port=0",
        "--user-data-dir=" + profile,
        "about:blank",
      ],
      {
        env: {
          ...process.env,
          XDG_CONFIG_HOME: profile,
          XDG_CACHE_HOME: profile,
        },
        stdio: ["ignore", "ignore", "pipe"],
      },
    );
    debug = await new Promise((resolve, reject) => {
      let log = "";
      const timeout = setTimeout(
        () => reject(new Error("Browser startup timed out: " + log)),
        15_000,
      );
      browser.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      browser.stderr.on("data", (chunk) => {
        log += chunk;
        const match = /DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//.exec(
          log,
        );
        if (match) {
          clearTimeout(timeout);
          resolve("http://127.0.0.1:" + match[1]);
        }
      });
    });
  }
  const target = await (
    await fetch(debug + "/json/new?about:blank", { method: "PUT" })
  ).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown")
      exceptions.push(message.params.exceptionDetails);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      clearTimeout(request.timeout);
      if (message.error)
        request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("CDP timeout: " + method));
      }, 10_000);
      pending.set(id, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const navigate = async (route) => {
    await send("Page.navigate", { url: origin + "/.ts-libs/" + route });
    for (let attempt = 0; attempt < 100; attempt++) {
      if (
        await evaluate(
          "document.readyState==='complete' && !!document.querySelector('[data-theme-toggle]')",
        )
      )
        return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("Page failed to load: " + route);
  };
  await send("Runtime.enable");
  await send("Page.enable");
  for (const locale of ["en", "de"]) {
    for (const width of [1366, 390]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 500,
      });
      await navigate(locale + "/");
      assert.equal(await evaluate("document.documentElement.lang"), locale);
      assert.equal(await evaluate("document.querySelectorAll('h1').length"), 1);
      assert.equal(await evaluate("window.__TS_LIBS_SEARCH__.length"), 35);
      assert.ok(
        await evaluate("document.documentElement.scrollWidth<=innerWidth"),
        locale + " horizontal overflow at " + width,
      );
      assert.ok(
        await evaluate(
          "getComputedStyle(document.querySelector('.language-switch')).display!=='none'",
        ),
        "Language switch is hidden",
      );
      const theme = await evaluate("document.documentElement.dataset.theme");
      await evaluate("document.querySelector('[data-theme-toggle]').click()");
      assert.notEqual(
        await evaluate("document.documentElement.dataset.theme"),
        theme,
      );
      await evaluate(
        "const input=document.querySelector('[data-search]');input.value='worker';input.dispatchEvent(new Event('input'));",
      );
      assert.ok(
        await evaluate(
          "document.querySelectorAll('[data-search-results] a').length>0",
        ),
      );
      await navigate(locale + "/modules/");
      await evaluate(
        "const filter=document.querySelector('[data-module-filter]');filter.value='Worker Pool';filter.dispatchEvent(new Event('input'));",
      );
      assert.equal(
        await evaluate(
          "document.querySelectorAll('[data-module-card]:not([hidden])').length",
        ),
        1,
      );
      if (width < 500) {
        await evaluate("document.querySelector('[data-nav-toggle]').click()");
        assert.equal(
          await evaluate(
            "document.querySelector('[data-shell]').classList.contains('nav-open')",
          ),
          true,
        );
        await send("Input.dispatchKeyEvent", {
          type: "keyDown",
          key: "Escape",
          code: "Escape",
        });
        assert.equal(
          await evaluate(
            "document.querySelector('[data-nav-toggle]').getAttribute('aria-expanded')",
          ),
          "false",
        );
      }
      await navigate(locale + "/modules/worker-pool/");
      assert.equal(
        await evaluate("document.querySelectorAll('.article section').length"),
        8,
      );
      const other = locale === "en" ? "de" : "en";
      const languagePath = await evaluate(
        "new URL(document.querySelector('.language-switch').href).pathname",
      );
      assert.equal(
        languagePath,
        "/.ts-libs/" + other + "/modules/worker-pool/",
      );
      await evaluate("document.querySelector('.exercise details').open=true");
      assert.equal(
        await evaluate("document.querySelector('.exercise details').open"),
        true,
      );
      assert.ok(
        await evaluate("document.documentElement.scrollWidth<=innerWidth"),
        "Article overflow at " + width,
      );
      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      await writeFile(
        path.join(artifacts, locale + "-" + width + ".png"),
        Buffer.from(screenshot.data, "base64"),
      );
    }
    await navigate(locale + "/guide/");
    assert.equal(
      await evaluate("document.querySelectorAll('.principle-card').length"),
      6,
    );
  }
  await navigate("");
  assert.equal(await evaluate("location.pathname"), "/.ts-libs/en/");
  await navigate("modules/assert/");
  assert.equal(
    await evaluate("location.pathname"),
    "/.ts-libs/en/modules/assert/",
  );
  assert.deepEqual(exceptions, [], "Browser JavaScript exceptions");
  console.log(
    "Browser checks passed for both languages at desktop/mobile widths: search, filtering, theme, navigation, exercises, language links and legacy redirects.",
  );
} finally {
  socket?.close();
  browser?.kill("SIGTERM");
  await new Promise((resolve) => server.close(resolve));
}
