# dsh-client-locale-ru

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）网页界面的社区**俄语**本地化。
它通过公开的 locale API（`locale.addLanguage()` + `locale.register()`）注册 `ru` 语言，因此语言选择菜单里会在 **English** 和 **中文** 旁边出现 **Русский**。

**覆盖范围：** 73 个 namespace，**3477 条字符串**（`ru-dicts.json`）——已对照客户端自带的 `en` 词典核验（`dsh` 0.2.1-rc.5）：缺失键为 0。

[English](https://github.com/Astemiir/dsh-client-locale-ru/blob/main/README.md) | 中文 | [Русский](https://github.com/Astemiir/dsh-client-locale-ru/blob/main/docs/README.ru.md)

## 安装

本插件是一个 `dsh` **bundle**：声明了 `dsh.bundle.patch`（插入 `locale-ru` 一行的 loader 补丁）和 `dsh.client`（浏览器模块）。把它安装到某个 profile：

```sh
# 使用本仓库的本地目录
dsh plugin --profile web add /path/to/dsh-client-locale-ru
# 或从 npm 安装
dsh plugin --profile web add dsh-client-locale-ru
```

`dsh desktop`（Electron 应用）管理自己的 profile，并带有自己的 CLI；用该 CLI 以同样方式安装，然后重启应用。在网页界面中等价的操作是 `plugin_manager` → `install_bundle`，以本目录为目标。

安装后重启客户端（或刷新页面），在 *设置 → 语言* 中选择 **Русский**。

## 工作原理

`client.js` 是一个浏览器模块：

```js
window.__ModuleLoader__.load({
  id: 'dsh-client-locale-ru',
  factory(require) {
    const RU_DICTS = { /* namespace -> key -> 俄语文本 */ };
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

字典以字面量形式嵌入，因为浏览器模块表无法读取磁盘文件。

## 修改翻译

1. 编辑 `ru-dicts.json`（namespace → key → 俄语文本）。
2. 重新生成浏览器模块：`node make-client.js`（或 `npm run build`）。
3. 重启客户端。

`ru-dicts.json` 的格式是 `{ "<namespace>": { "<key>": "<文本>" } }`，其中 namespace 与客户端插件注册的一致（`const NS = "…"` 或 `locale.register(<var>, …)`）。

## 状态

字典里缺少的键会回退到英文，因此覆盖不完整时也能平稳降级。
翻译依据 `dsh` 0.2.1-rc.5 的英文字符串，并在英文有歧义处参考中文字符串；与随包 `en` 词典核验后，缺失键为 0。

桌面端有两处**未**翻译，因为它们不是 dsh 的字符串：原生菜单（`Application`、`Edit` 等）、托盘菜单以及退出/更新对话框属于 Electron 外壳，其自带英中词典（`resources/app.asar/lib/main.js`）。我们已请求上游为其加入 `ru`——见[讨论 #8824](https://github.com/deepseek-ai/deepseek-harness/discussions/8824)。

## 致谢

本词典由我们的原创翻译，以及取自
[@ragnoryok1/dsh-client-locale-ru](https://github.com/Ragnoryok1/dsh-client-locale-ru)（MIT，© Ragnoryok1）的条目组成——2026-10-04 合入 493 条字符串。其余均由我们翻译。

## 许可证

MIT——见 [LICENSE](LICENSE)。俄语字典是对 DeepSeek Harness 所附字符串的社区翻译（MIT，© DeepSeek），并包含部分 `@ragnoryok1/dsh-client-locale-ru`（MIT，© Ragnoryok1）。
