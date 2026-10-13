# 公开仓库文件与数据边界

## 纳入 Git

代码、Markdown 文档、工作区配置、锁文件、CI、无密钥环境模板、指定目录 SQL 迁移与合成种子、examples/synthetic 中明确合成的数据。

## 默认忽略

`.env*`（保留 .example 模板）、密钥证书、本地 Agent/IDE 配置、真实 CSV/Excel/Word/PDF、数据库导出、源模型、大型媒体、上传/导出/报告、日志、依赖、缓存、构建产物和测试结果。

SQL 默认忽略，只有 database/migrations 和 database/seeds 下的 SQL 允许入库。迁移不能包含真实连接串或业务记录。CSV/JSONL 只有 examples/synthetic 根目录例外；普通 JSON 是代码常用格式，无法凭扩展名认定安全，仍要检查内容。

imports/reports/models 等名称同时可能用于源码模块，因此运行数据目录规则锚定仓库根目录，不能使用全层级同名目录忽略规则。`check:boundaries` 同时检查 apps/packages 的源码是否被 Git 忽略。

## 提交检查

`pnpm check:public` 检查已跟踪和暂存文件路径、文件体积以及常见密钥形式；首次提交先暂存明确文件再执行。CI 对仓库已跟踪内容再次检查。检查器只报告文件名与规则，不打印密钥正文。

该检查不是完整 DLP，也不能识别所有私人信息；提交者必须确认数据是合成、图片和文档具有公开权限。`.gitignore` 不会移除已跟踪文件；如误提交密钥，立即撤销/轮换，再处理历史，不能只追加忽略规则。

允许公开示例时放入指定目录、添加用途和“合成数据”说明；不要用 git add -f 绕过规则。真实园区数据、账单、客户模型不应进入 Issue、PR、Actions 日志或本项目讨论记录。

## 验证样例

使用 `git check-ignore --no-index <path>` 验证新增规则。预期忽略 .env.local、真实 CSV、数据库备份、模型文件；预期允许 .env.example、迁移 SQL、合成 CSV。无需创建真实敏感文件来做验证。
