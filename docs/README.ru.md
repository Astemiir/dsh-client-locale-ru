# dsh-client-locale-ru

Русская локализация интерфейса [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — общественный перевод.
Плагин регистрирует язык `ru` через публичный API локали (`locale.addLanguage()` + `locale.register()`), поэтому в меню выбора языка рядом с **English** и **中文** появляется **Русский**.

**Объём:** 73 namespace, **3477 строк** (`ru-dicts.json`) — сверено с собственными `en`-словарями клиента (`dsh` 0.2.1-rc.5): пропущенных ключей 0.

[English](https://github.com/Astemiir/dsh-client-locale-ru/blob/main/README.md) | [中文](https://github.com/Astemiir/dsh-client-locale-ru/blob/main/docs/README.zh.md) | Русский

## Установка

Плагин — это `dsh`-**bundle**: он объявляет `dsh.bundle.patch` (патч загрузчика, вставляющий строку `locale-ru`) и `dsh.client` (браузерный модуль). Установка в профиль:

```sh
# из локальной копии этого репозитория
dsh plugin --profile web add /path/to/dsh-client-locale-ru
# или из npm
dsh plugin --profile web add dsh-client-locale-ru
```

`dsh desktop` (приложение на Electron) управляет собственным профилем и имеет свой CLI — ставится так же через него, после чего приложение нужно перезапустить. В веб-интерфейсе та же операция — `plugin_manager` → `install_bundle` с этим каталогом.

После установки перезапустите клиент (или обновите страницу) и выберите **Русский** в *Настройки → язык*.

## Как это работает

`client.js` — браузерный модуль:

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-locale-ru',
  factory(require) {
    const RU_DICTS = { /* namespace -> ключ -> русский текст */ };
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

Словарь вшит в модуль литералом: браузерная таблица модулей не умеет читать файлы с диска.

## Правка перевода

1. Правьте `ru-dicts.json` (namespace → ключ → русский текст).
2. Пересоберите браузерный модуль: `node make-client.js` (или `npm run build`).
3. Перезапустите клиент.

Формат `ru-dicts.json` — `{ "<namespace>": { "<ключ>": "<текст>" } }`, где namespace совпадает с тем, что регистрирует клиентский плагин (`const NS = "…"` или `locale.register(<var>, …)`).

## Состояние

Отсутствующий в словаре ключ откатывается к английскому, поэтому неполный перевод деградирует мягко.
Перевод идёт по английским оригиналам `dsh` 0.2.1-rc.5; китайские строки использовались как подсказка там, где английский неоднозначен. Сверка с поставляемыми `en`-словарями даёт 0 пропущенных ключей.

Две части приложения намеренно **не** переведены, потому что это не строки dsh: нативное меню (`Application`, `Edit`, …), меню трея и диалоги выхода/обновления принадлежат Electron-оболочке, у которой свой англо-китайский словарь (`resources/app.asar/lib/main.js`). Мы попросили добавить туда `ru` — см. [обсуждение #8824](https://github.com/deepseek-ai/deepseek-harness/discussions/8824).

## Благодарности

Словарь собран из наших переводов и строк, взятых из пакета
[@ragnoryok1/dsh-client-locale-ru](https://github.com/Ragnoryok1/dsh-client-locale-ru) (MIT, © Ragnoryok1) — 493 строки, добавлены 2026-10-04. Остальное переведено нами.

## Лицензия

MIT — см. [LICENSE](LICENSE). Русские словари — общественный перевод строк, поставляемых с DeepSeek Harness (MIT, © DeepSeek), и включают часть `@ragnoryok1/dsh-client-locale-ru` (MIT, © Ragnoryok1).
