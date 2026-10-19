# JSON Toolbox

![JSON Toolbox](banner.svg)

> 完整在线版（30+ JSON 工具）：https://jsontoolbox.cc
> English docs: [README.md](README.md)

在 Obsidian 中富预览与格式化 JSON / YAML —— View JSON in Obsidian as a collapsible **rich tree** with inline previews.

## 功能

- **阅读模式自动渲染**：`json` / `yaml` 代码块自动变成可折叠富树；对象的数组自动渲染为表格。
- **14 类内联预览**：图片、颜色块、可点击链接、邮箱、音视频、PDF、时间戳、JWT、Base64（含内联图片）、UUID、IP、Markdown、正则。
- **保留原始源码**：每个预览下方以折叠区保留原始 JSON / YAML，便于复制。
- **5 个命令**：打开查看器、格式化 JSON、校验 JSON、JSON↔YAML、JSON→表格 / CSV。
- **完全本地**：解析、格式化、转换都在你的 vault 内完成，无遥测、不上传数据。
- **设置页 6 个开关**，并跟随系统语言（中文 / 英文）。

## 截图

> 把截图放进 `assets/screenshots/`，文件名需与下方一致（图片就位前会显示破图，属正常占位）。

<p align="center">
  <img src="assets/screenshots/reading-tree.png" width="360" alt="阅读模式富树"/>
  <img src="assets/screenshots/previews.png" width="360" alt="内联预览（色块、图片、链接）"/>
</p>
<p align="center">
  <img src="assets/screenshots/table.png" width="360" alt="对象数组渲染为表格"/>
  <img src="assets/screenshots/settings.png" width="360" alt="设置页（6 个开关 + Ko-fi 按钮）"/>
</p>

## 命令

| 命令 | 说明 |
|---|---|
| Open JSON Viewer | 打开富树 / 表格查看器 |
| Format JSON | 格式化选中或代码块内 JSON |
| Validate JSON | 校验 JSON 并定位错误 |
| JSON ↔ YAML | 在 JSON 与 YAML 间转换（自动判断方向） |
| JSON → Table/CSV | 将 JSON 数组 / 对象转为表格 |

## 内联预览

在叶子值上自动识别：颜色、图片、音频、视频、PDF、URL、邮箱、时间戳、JWT、Base64、UUID、IP、Markdown、正则。

## 设置

设置页提供 6 个开关：

1. 阅读模式自动渲染
2. 对象数组渲染为表格
3. 内联资源预览
4. 富树默认展开
5. 保留原始源码
6. 转换时同步代码块语言

文案跟随 Obsidian 界面语言（中文 / 英文）自动切换；命令名保持英文。

## 隐私

所有处理（解析、格式化、校验、转换）均在本地完成，无遥测、无账号、无云同步。

唯一例外：**内联媒体预览**（图片 / 音频 / 视频 / PDF）会去拉取 JSON 中出现的远程 URL 以渲染预览。不会上传任何数据，URL 仅用于渲染预览。

## 安装

### 从社区市场（推荐）

1. 设置 → 第三方插件 → 浏览社区插件，搜索 **JSON Toolbox**
2. 安装并启用

### 手动 / BRAT

从 GitHub Release 下载 `main.js`、`manifest.json`、`styles.css`，放入 `<vault>/.obsidian/plugins/json-toolbox/`。

## 支持

如果这个工具对你有用，欢迎在 Ko-fi 上请我喝杯咖啡：https://ko-fi.com/kbmjj123

## 许可证

MIT
