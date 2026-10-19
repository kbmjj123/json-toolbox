# JSON Toolbox 发布流程

适用于每次发版。发布动作需在 GitHub 与 Obsidian 官网操作，本文件仅作步骤备忘。

## 前置检查（每次发布前）

- [ ] `manifest.json` 的 `version` 与本次 release tag **完全一致**（如 `1.0.0`）
- [ ] `id` 未被占用、且不含 `obsidian`
- [ ] 仓库根有 `manifest.json` / `README.md` / `LICENSE`
- [ ] `.gitignore` 已忽略 `main.js`（`main.js` 只走 release 资产，不进 git）
- [ ] 已通过 `pnpm test` 与 `pnpm typecheck`
- [ ] 已 `pnpm build` 生成最新 `main.js`

## 步骤

### 0. 填写 GitHub 仓库 About（发布前）

在仓库首页右侧 About 框点 ⚙️ 编辑，填写：

- **Description**（建议英文）：
  `Rich JSON/YAML viewing and formatting inside Obsidian — auto-render code blocks as collapsible trees or tables, with 14 inline previews, fully local.`
- **Website**：`https://jsontoolbox.cc`
- **Topics**：`obsidian`、`obsidian-plugin`、`json`、`yaml`、`markdown`、`productivity`、`formatter`、`viewer`
- 可选：**Social preview** 用仓库根 `banner.svg` 导出的 PNG（GitHub 不支持 SVG 社交图，需先转 PNG）。

### 1. 更新版本号

同时改 `manifest.json` 与 `package.json` 的 `version`（两者保持一致）。

### 2. 打 tag 触发自动发布

```bash
git commit -am "release: 1.0.0"
git tag 1.0.0
git push origin main --tags
```

`.github/workflows/release.yml` 随即运行：安装依赖 → typecheck/test → 校验 tag 与 `manifest.json` 版本一致 → `pnpm build` → 为 `main.js` / `manifest.json` / `styles.css` 生成 **build provenance attestation** → 用该 tag 建 release，标题即 tag，上传三个文件。

> 不要手动上传资产：那样不会产生 attestation，Obsidian 审查会给出
> “Missing GitHub artifact attestations for release assets” 的建议项。
>
> 应急时才用 `gh release create <tag> main.js manifest.json styles.css --title <tag> --generate-notes`
> 手动补发（无 attestation）；release **标题必须包含 `manifest.json` 的版本号**，
> 否则会被判 “release name does not include the version”。

### 3. 提交到 Obsidian 社区市场

1. 浏览器打开 https://obsidian.md 并登录（用 GitHub 账号授权）
2. 进入开发者 / 提交插件页面，粘贴仓库地址：
   `https://github.com/kbmjj123/json-toolbox`
3. **Donation link** 字段填 Ko-fi 捐赠链接：
   `https://ko-fi.com/kbmjj123`
4. 提交，等待机器人自动审核（检查 manifest、版本、资产完整性等）
5. 审核通过后，插件出现在社区市场，可被搜索安装

### 4. 后续更新

- 改代码 → 递增版本（如 `1.0.1`）：同时改 `manifest.json` 与 `package.json` 的 `version`，打同名 tag `1.0.1` 推送
- release tag 必须与 `manifest.json` 的 `version` 一致，否则工作流会直接失败、市场也拉不到更新
- 建议 `versions.json` 由发布流程维护：目前未提供，Obsidian 会直接按 release 的 manifest 判定版本

## Release notes 模板（英文，用于 GitHub Release）

```
# JSON Toolbox 1.0.0

First release of the JSON Toolbox plugin for Obsidian.

## Features
- Reading mode: json / yaml code blocks render automatically as a collapsible rich tree (or a table for arrays of objects).
- Inline previews for 14 value kinds: image, color swatch, clickable URL, email, audio, video, PDF, timestamp, JWT, base64 (incl. inline images), UUID, IP, markdown, regex.
- Original source preserved in a collapsible section under every preview.
- Commands: Open JSON Viewer · Format JSON · Validate JSON · JSON ↔ YAML · JSON → Table/CSV.
- Fully local: parsing, formatting and conversion run inside your vault. Media previews only fetch the remote URLs found in your JSON (nothing is uploaded).

See the README for details.
```

## 发布前真机确认清单

- [ ] Obsidian `Cmd+P` → `Reload app without saving`
- [ ] 示例笔记阅读模式显示富树 / 表格
- [ ] 6 个设置开关均生效
- [ ] Ko-fi 按钮跳转正确
