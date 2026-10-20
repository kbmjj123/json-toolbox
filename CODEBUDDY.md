# CODEBUDDY.md

JSON Toolbox —— Obsidian 社区插件（仓库 `kbmjj123/json-toolbox`，插件 id `json-toolbox`）。
在阅读模式把 `json` / `yaml` 代码块渲染成可折叠富树（对象数组渲染为表格），带 14 类内联预览，并提供 5 条命令。全部本地处理，无遥测、无网络上传（媒体预览只加载 JSON 里出现的远程 URL）。

## 命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | esbuild watch，产物 `main.js` |
| `pnpm build` | 生产构建（minify，无 sourcemap） |
| `pnpm test` | vitest run（`src/**/*.test.ts`，jsdom） |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | eslint + `eslint-plugin-obsidianmd` recommended |

## 铁律：包管理器只准 pnpm

- 唯一锁文件是 `pnpm-lock.yaml`。**禁止**提交 `package-lock.json` / `yarn.lock`（已在 `.gitignore` 中忽略），也禁止用 npm / yarn 安装依赖。
- `package.json` 的 `"packageManager": "pnpm@10.14.0"` 必须保留；升级 pnpm 时同步改这个字段，并在本地**重新生成 `pnpm-lock.yaml`** 后一起提交。
- CI（`.github/workflows/release.yml`）用 `corepack enable` 按该字段装 pnpm，再 `pnpm install --frozen-lockfile`。不要改回 `npm install -g pnpm@10`（版本不固定，会与锁文件漂移）。
- 背景：Obsidian 审核机器人曾报 **“Source review dependency installation failed / Checks which require resolved dependencies were skipped”**，原因是仓库当时只有 `pnpm-lock.yaml`，缺少 npm 锁文件。统一为 pnpm 单一化并声明 `packageManager` 后，1.0.4 的依赖安装恢复正常。
- 兜底：若某天机器人又报同一条错，说明它只认 npm 锁文件。此时**不要**改回双包管理器，只补一份兼容产物即可——`npm install --package-lock-only`（只生成锁文件，不动 `node_modules`），并从 `.gitignore` 移除 `package-lock.json` 那两行后提交；日常与 CI 仍只走 pnpm。

## 发版流程

1. 同时递增 `manifest.json` 与 `package.json` 的 `version`（两者必须相等）。
2. tag 必须与 `manifest.json` 版本**完全一致且不带 `v` 前缀**——workflow 有硬校验，不一致直接失败。
3. 推送 main 与 tag，`.github/workflows/release.yml` 自动完成：装依赖 → typecheck/test → 版本校验 → build → 为 `main.js` / `manifest.json` / `styles.css` 生成 build provenance attestation → 发布 release。
4. **不要手动上传 release 资产**：手动上传没有 attestation，审核会给出 “Missing GitHub artifact attestations for release assets”。release 标题必须包含版本号（如 `1.0.4`），否则会被判 “release name does not include the version”。
5. `main.js` 只走 release 资产，已 gitignore，不要提交到仓库。
6. 发新版后审核机器人会自动重跑，无需手动触发。

## Obsidian 社区市场审核

- 本地用 `pnpm lint` 复现机器人检查（`eslint.config.mjs` 加载 `obsidianmd.configs.recommended`，并开启 type-aware）。
- **只有 Error 级会让自动审核 Fail**；Warning / Recommendation 不阻断。常见 Error 级坑：
  - 直接赋值 `el.style.x = …` → 改 `el.setCssStyles({ … })`
  - 动态创建 `<style>` 元素 → 样式放进 `styles.css`
  - 正则用了 lookbehind `(?<=…)` → iOS 不支持，需改写
  - `eslint-disable` 未写原因 → 补 `-- 原因`
  - 设置页标题含 “settings” 或插件名 → 换标题文案
- 依赖未安装成功的报告**不等于通过**：所有需要解析依赖的检查都被跳过了，必须等完整报告。

## 代码与架构约定

- 入口 `src/main.ts`；`settings.ts` 定义设置项与默认值，`i18n.ts` 提供 `zh` / `en` 双语文案（按 Obsidian 界面语言自动选择）。
- 新增设置项要成组改动：`JsonToolboxSettings` 接口 + `DEFAULT_SETTINGS` + `i18n.ts` 的 `zh` 与 `en` 两侧文案 + README 里的开关数量描述。
- 测试用 vitest + jsdom，`obsidian` 是纯类型包，运行时通过 `vitest.config.ts` 的 alias 指向 `src/__mocks__/obsidian.ts`；`src/__tests__/setup.ts` 补齐 Obsidian 的 DOM helper。新增涉及 Obsidian API 的模块时，同步补 mock。
- 样式集中在根目录 `styles.css`，不要在 TS 里注入内联样式。

## AI 协作约定

- 默认**不执行** `pnpm build`：它会覆盖仓库根目录的 `main.js`（gitignore 的构建产物）。需要验证改动时优先用 `pnpm lint` / `pnpm test` / `pnpm typecheck`，以及静态校验（JSON/YAML 可解析、引用无死链、`read_lints`）。
- 不主动执行 `git commit` / `push` / `tag`：改完后列出待提交文件并给出命令，由用户自己执行。
- 改动 `package.json` / `manifest.json` / workflow 后，自查版本号一致性与 tag 规则，再说“完成”。
