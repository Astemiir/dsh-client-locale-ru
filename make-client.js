#!/usr/bin/env node
// Regenerates the browser module `client.js` from the master dictionary
// `ru-dicts.json` (namespace -> key -> Russian text).
//
// Usage:  node make-client.js   (or: npm run build)
//
// The dictionary has to be embedded into client.js as a literal because the
// browser module table cannot read files: the Harness Web UI loads this module
// as `window.__ModuleLoader__.load({ id, factory })`, and the factory returns
// the plugin face (inject/apply) that registers the `ru` language.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dict = JSON.parse(readFileSync(path.join(here, 'ru-dicts.json'), 'utf8'));
const namespaces = Object.keys(dict).length;
const strings = Object.values(dict).reduce((sum, ns) => sum + Object.keys(ns).length, 0);

const client = `window.__ModuleLoader__.load({
  id: 'dsh-client-locale-ru',
  factory(require) {
    /** Russian dictionaries: namespace -> key -> text. */
    const RU_DICTS = ${JSON.stringify(dict)};
    return {
      inject: ['locale'],
      apply(ctx) {
        try {
          ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' });
        } catch (error) {
          // Already registered (for example by a built-in patch) — keep going.
        }
        for (const [ns, nsDict] of Object.entries(RU_DICTS)) ctx.locale.register(ns, 'ru', nsDict);
      },
    };
  },
});
`;

writeFileSync(path.join(here, 'client.js'), client, 'utf8');
console.log(`client.js written: ${namespaces} namespaces, ${strings} strings`);
