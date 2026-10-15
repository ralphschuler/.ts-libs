# ts-libs

A TypeScript systems laboratory with **35 experiments**, real regression tests, and a concept handbook in **English and German**.

- [English handbook](https://nyphon.de/.ts-libs/en/)
- [Deutsches Handbuch](https://nyphon.de/.ts-libs/de/)
- [Experiment completion matrix](documentation/completion-matrix.md)
- [What “finished” means](documentation/experiment-standards.md)

Every experiment stays visible. A concept explains an idea; a working experiment demonstrates a verified core. Production readiness additionally requires application-specific limits, compatibility, operational evidence, and maintenance. The maturity badges describe that distinction.

## Set up the workspace

Use Node.js 24 and the pinned Yarn version from package.json. The repository includes its Yarn cache.

```sh
npm install --global corepack@0.34.0
corepack enable
yarn install --immutable --immutable-cache
yarn check
```

The root is a private workspace, not an installable umbrella package. Individual packages expose ESM and TypeScript declarations through their own manifests.

## Run an experiment

Every package has a runnable example and a real test command:

```sh
yarn tsx packages/priority-queue/examples/basic.ts
yarn workspace @ralphschuler/priority-queue test
```

The standard examples use deterministic inputs, mocks, local resources, or an injected clock. They need no provider key, MongoDB server, Redis service, browser, or multicast-capable network.

The optional [network mDNS example](packages/mdns/examples/network.ts) opens multicast sockets explicitly:

```sh
yarn tsx packages/mdns/examples/network.ts
```

## Verify changes

`yarn check` runs lint, builds all packages, typechecks source/tests/examples, executes the regression suite, verifies public imports without unexpected effects, runs all 35 examples, and builds/validates both documentation editions.

```sh
yarn lint
yarn build
yarn typecheck
yarn test
yarn test:imports
yarn test:examples
yarn docs:site
yarn docs:check
```

To check the website in Chromium or Chrome:

```sh
yarn docs:site
CHROME_PATH=chromium yarn docs:browser
```

Use `CHROME_PATH=google-chrome` where that is the installed executable. The browser check starts its own local server, tests desktop/mobile interactions in both languages, and writes screenshots under .artifacts/browser/.

## Work on the handbook

The site is generated into .pages/ without frontend dependencies:

- documentation/catalog.mjs: German concepts and independent implementation sketches.
- documentation/catalog.en.mjs: English concepts.
- documentation/experiments.mjs: current verified cores, actual APIs, and integration limits in both languages.
- documentation/assets/: shared styling and interaction code.

Update both language editions when changing a concept. Update the evidence contracts and package example when changing an implementation.

```sh
yarn docs:site
python3 -m http.server 4173 --directory .pages
```

Open http://localhost:4173/en/ or http://localhost:4173/de/. Old unprefixed URLs redirect to English and preserve the corresponding article.

## Automation and releases

Pull requests and main run the same verification gates. GitHub Pages deploys validated static documentation. Official actions are pinned to commits and Dependabot proposes updates weekly.

Package publishing is an explicit workflow dispatch for one reviewed workspace. Deleting a release never unpublishes packages, and pushes never create or force version tags. Secrets are needed only for a real provider integration or an explicitly requested package publish.

## Contributing

Start with a concrete problem, expected behavior, and a failing test. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and [the matrix](documentation/completion-matrix.md) for intentional integration limits.

Licensed under [MIT](LICENSE).
