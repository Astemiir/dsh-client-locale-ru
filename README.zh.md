# dsh-client-locale-ru

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）网页界面的社区**俄语**本地化。
它通过公开的 locale API（`locale.addLanguage()` + `locale.register()`）注册 `ru` 语言，因此语言选择菜单里会在 **English** 和 **中文** 旁边出现 **Русский**。

**覆盖范围：** 52 个 namespace，**2626 条字符串**（`ru-dicts.json`）。

[English](README.md) | 中文 | [Русский](README.ru.md)

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
翻译基于 `dsh` 0.2.0-rc.2 的英文字符串，并在英文有歧义处参考了中文字符串。

## 许可证

MIT — 见 [LICENSE](LICENSE)。俄语字典是对 DeepSeek Harness 所附字符串的社区翻译（MIT，© DeepSeek）。
