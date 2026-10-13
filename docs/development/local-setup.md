# Windows 与 macOS 本地开发

基线：Node.js 24.10.0、pnpm 10.32.0，版本文件和 packageManager 固定。M0 不使用 Docker、数据库或外部模型服务。

```sh
git clone https://github.com/personoj/park-energy-carbon.git
cd park-energy-carbon
pnpm install --frozen-lockfile
pnpm dev
```

已有其他 Node 版本时，用自己的版本管理器切换；不需要覆盖系统环境。缺少 pnpm 时可安装指定版本。不要混用 npm/yarn 生成额外锁文件。

Web 5173，API 3001，均绑定本机。前端代理 `/api` 到 API。Ctrl+C 停止开发进程。端口已占用时先辨认原进程，不自动终止别人的服务。

```sh
pnpm typecheck
pnpm check:docs
pnpm check:boundaries
pnpm build
pnpm check:public
```

构建产物位于 apps/web/dist 和 apps/api/dist。`pnpm --filter @park/api start` 运行构建后的 API。

## 后续基础服务

M1 再配置 PostgreSQL；每位开发者独立数据库与凭据，禁止所有人修改同一个开发库的结构。迁移由仓库管理，联调库由合并后的版本统一更新。对象存储按开发者/园区隔离前缀。

`.env.example` 只记录变量名和占位符，M0 不加载数据库配置。新增配置时文档说明读取位置、默认值和必需性。VITE_* 会出现在浏览器，不能存密钥。

仓库脚本用 Node.js，避免 PowerShell/Bash 特有语法。统一 LF 和路径大小写；CI 覆盖 Windows、macOS、Linux。CI 不代表本机已验证所有操作系统，结果以各 runner 的实际执行为准。
