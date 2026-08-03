# Concept documentation

This directory is the human-maintained source for the GitHub Pages site.

The site deliberately documents the ideas behind the packages rather than
their installation or generated API surface. Every module entry in
`catalog.mjs` must answer four questions:

1. Which problem does the module solve?
2. How does data or control flow through it?
3. What are the important limits and failure modes?
4. How can a reader implement the smallest useful version themselves?

Build and validate the static output with:

```sh
node .github/scripts/build-documentation.mjs
node .github/scripts/validate-documentation.mjs
```

The generated `.pages/` directory is disposable and is not committed.
