# dsh-client-locale-ru

Community **Russian** localization for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) web UI.
It registers the `ru` language through the public locale API — `locale.addLanguage()` + `locale.register()` — so **Русский** appears in the language picker next to **English** and **中文**.

**Coverage:** 52 namespaces, **2626 strings** (`ru-dicts.json`).

English | [中文](README.zh.md) | [Русский](README.ru.md)

## Install

The plugin is a `dsh` **bundle**: it declares `dsh.bundle.patch` (the loader patch that inserts the `locale-ru` row) and `dsh.client` (the browser module). Install it into a profile:

```sh
# from a local checkout of this repository
dsh plugin --profile web add /path/to/dsh-client-locale-ru
# or from npm
dsh plugin --profile web add dsh-client-locale-ru
```

`dsh desktop` (the Electron app) manages its own profile and has its own CLI; install it the same way with that CLI, then restart the app. In the Web UI the equivalent operation is `plugin_manager` → `install_bundle` with this directory as the target.

After installing, restart the client (or reload the page) and pick **Русский** in *Settings → language*.

## How it works

`client.js` is a browser module:

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-locale-ru',
  factory(require) {
    const RU_DICTS = { /* namespace -> key -> Russian text */ };
    return {
      inject: ['locale'],
      apply(ctx) {
        ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' });
        for (const [ns, dict] of Object.entries(RU_DICTS)) ctx.locale.register(ns, 'ru', dict);
      },
    };
  },
});
```

The dictionary is embedded as a literal because the browser module table cannot read files from disk.

## Editing the translation

1. Edit `ru-dicts.json` (namespace → key → Russian text).
2. Regenerate the browser module: `node make-client.js` (or `npm run build`).
3. Restart the client.

`ru-dicts.json` is `{ "<namespace>": { "<key>": "<text>" } }`, where the namespace matches the one a client plugin registers (`const NS = "…"` or `locale.register(<var>, …)`).

## Status

Any key missing from the dictionary falls back to English, so partial coverage degrades gracefully.
The translation was produced from the English sources of `dsh` 0.2.0-rc.2, using the Chinese strings as a hint where English is ambiguous.

## License

MIT — see [LICENSE](LICENSE). The Russian dictionaries are a community translation of strings shipped with DeepSeek Harness (MIT, © DeepSeek).
