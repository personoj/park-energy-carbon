# 园区能源与碳管理平台

面向新能源园区的多人协作项目：园区/厂房 3D、设备与计量、能源流、碳核算、告警，以及 Agent 辅助查询和数据导入。

**当前为初始化骨架**：可运行 React 页面与 NestJS 演示接口，可点选 3D 占位资产并联动详情。所有演示数据均为合成数据；没有连接真实数据库、设备、模型服务或 Agent。导入、核算、权限和正式 3D 模型尚未实现。Docker 暂不纳入范围。

## 快速开始

Windows PowerShell 与 macOS 终端使用相同命令。安装 Node.js 24.10.0 和 pnpm 10.32.0 后：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

- 页面：http://127.0.0.1:5173
- 健康检查：http://127.0.0.1:3001/api/health
- 合成数据：http://127.0.0.1:3001/api/demo/campus
- 验证：`pnpm check`；公开仓库文件检查：`pnpm check:public`（需在 Git 仓库内）。

当前启动无需数据库、环境变量和模型 API Key。接口只监听本机，尚无身份验证，不应直接作为公网服务运行。

## 从哪里读起

1. [文档索引与维护责任](docs/README.md)
2. [产品范围与未决事项](docs/product/scope.md)
3. [架构和模块边界](docs/architecture/system.md)
4. [新能源与能源流](docs/domain/renewable-energy.md)
5. [碳核算](docs/domain/carbon-accounting.md)
6. [Agent 工具、SQL 与导入权限](docs/architecture/agent-tools.md)
7. [开发环境](docs/development/local-setup.md)、[参与协作](CONTRIBUTING.md)

## 目录

```text
apps/web/                 前端路由、页面与业务组合
apps/api/                 NestJS 入口、业务模块与基础设施适配
packages/contracts/       按领域划分的跨端契约，无运行时基础设施
packages/viewer-3d/       纯展示组件：场景输入、选择事件
database/                 数据归属、迁移与合成种子约定
examples/synthetic/       可公开、明确标注的合成示例
scripts/                  跨平台工程检查
docs/                     产品、领域、架构、契约、协作与决策
.github/                  CI、Issue 与 PR 模板
```

Ant Design、ECharts、数据库驱动、队列和模型供应商 SDK 随对应功能引入，避免初始化时安装没有使用的依赖。3D 目前使用程序生成几何体，不代表最终视觉效果。

## 公开仓库约定

不提交真实账单、设备数据、数据库备份、客户模型、密钥和本地配置。配置模板只含占位符。详见 [文件与数据边界](docs/development/public-repository.md)。仓库公开不等于已授予开源许可；项目许可证仍待维护者决定。
