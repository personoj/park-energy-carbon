# GitHub 协作

公开仓库：personoj/park-energy-carbon。main 保存可运行版本，日常通过短分支与 PR 合并。M0 初始化首次推送 main；后续按本流程协作。

## 模块分工

| 责任 | 路径 |
|---|---|
| 页面与设备详情 | apps/web |
| 3D | packages/viewer-3d、docs/3d |
| 后端各领域 | apps/api/src/modules/<domain> |
| 数据结构 | database，需对应领域负责人审阅 |
| 公共契约 | packages/contracts，需生产者和消费者共同审阅 |
| 工程与协作 | scripts、.github、根配置 |

初期 CODEOWNERS 由 personoj 承担；真实成员加入后按路径分配。只有具备仓库权限的人能作为有效审阅者。公开仓库外部贡献者走 fork + PR，协作成员可建分支。

建议 main 保护：要求 PR、至少一次审阅、通过 quality (ubuntu-latest/windows-latest/macos-latest)，禁止 force-push 与删除。保护设置属于 GitHub 状态，是否实际启用见初始化记录，不把建议等同已生效。CI 对外部 PR 不使用 secrets，也不使用 pull_request_target 执行不可信代码。

2026-10-13 初始化已通过 GitHub API 启用：PR 一次审阅、三系统检查、分支保持最新、线性历史、会话解决、禁止强推/删除；管理员仍可按 GitHub 默认豁免路径处理初始化维护，未强制管理员执行审阅限制。普通协作遵循 PR 流程。

Issue 模板区分功能与缺陷；PR 写明问题、变化、模块、数据/契约/迁移变化、验证。接口或架构变化同步文档；跨模块内部导入由静态检查拒绝。

项目许可证未确定，不擅自声明 MIT/Apache。分支保护、许可证与正式成员分配分别处理，不把仓库公开当成已完成所有协作治理。
