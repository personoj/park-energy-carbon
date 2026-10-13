# 项目协作入口

## 项目共识

### 目标与使用场景

新能源较多的园区，提供园区/厂房 3D 展示、设备点选、能耗/碳排/告警，以及 Agent 辅助数据处理、导入和核算。

### 本次范围

新建独立公开 GitHub 仓库，建立文档与可运行初始化骨架，支持 Windows/macOS 协作。Docker 暂不考虑。本阶段不接入旧校园项目的数据、凭据、数据库或代码。

### 关键决定

- 用户明确要求公开独立仓库、设计好 gitignore，以及低耦合、可扩展的文件结构。
- Agent 范围：查询、调用核算工具、保存草稿，并处理新数据和导入数据库。任意 SQL 写入、DDL、直接发布核算结果不在当前确认范围。
- 技术基线采用 React/TypeScript/Vite、Three.js/R3F、NestJS、PostgreSQL 方向；初始骨架不连接数据库。细节是实现选择，见 [ADR](docs/decisions/0001-foundation.md)。
- 原始依据与建议状态见 [讨论记录](docs/project-discussion.md)，不得把未确认的核算口径写成项目事实。

### 完成标准

文档入口完整，初始化可安装/类型检查/构建，页面与演示接口联通；公开仓库提交内容经过检查。业务功能完成标准按里程碑逐步验收，不把文档中的设计描述为已实现。

## 开发边界

- 改动前阅读相应模块文档；保留他人改动。依赖只通过公开契约和接口，见 [架构](docs/architecture/system.md)。
- `viewer-3d` 不请求业务 API、不核算、不访问数据库；`contracts` 不依赖应用和供应商 SDK。
- 新后端业务模块采用 `domain/application/ports/adapters`；API 控制器不放核算公式。跨模块不导入内部实现，不直接写他人数据表。
- Agent 工具不得从模型参数采信用户/园区身份；SQL 网关与导入/草稿写入工具独立。
- 示例必须合成并显式标注；真实数据、密钥、大模型文件不得提交。SQL 迁移只能放指定路径；不要用 `git add -f` 绕过规则。
- 使用 pnpm 10.32.0，提交 lockfile。依赖精确锁定；不升级或重装已有依赖，除非用户明确授权。
- Python 工作默认使用 `D:\conda\envs_dirs\codex\Scripts\python.exe`；macOS 或项目专用环境按任务约定。缺包再安装，不预先探测依赖。Windows 安装命令：`uv pip install --python "D:\conda\envs_dirs\codex\Scripts\python.exe" PACKAGE_NAME`。
- 提交前运行 `pnpm check` 和 `pnpm check:public`，说明未验证项。实现核算、导入、权限时需补充有业务意义的测试。
- 提交和文档默认中文；短分支 + PR 协作，不覆盖其他人的历史。仓库设置是否启用保护必须实际核实，不能仅凭文档宣称开启。
