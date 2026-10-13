# 系统架构与模块边界

状态：M0 为可运行骨架；下文业务分层是后续实现约定。

## 部署与代码组织

一个 pnpm 工作区，一个 Web 应用，一个模块化 NestJS 后端。多人协作不要求微服务。耗时解析/核算需要队列后，再增加独立 worker；领域逻辑保持可在 API 或 worker 中调用。

```text
web/features → contracts ← api/modules 的公开接口
      ↓                         ↓
viewer-3d                application → domain
                               ↓ ports
                    adapters: PostgreSQL / 对象存储 / 模型供应商
```

## 目录约定

```text
apps/web/src/
  app/                         路由、布局、依赖组合
  features/<feature>/          页面、状态、接口适配、组件
apps/api/src/
  main.ts                      进程入口
  app.module.ts                组合根
  modules/<domain>/
    domain/                    实体、值对象、确定性规则
    application/               用例编排与事务意图
    ports/                     仓储、外部能力接口
    adapters/                  HTTP、数据库、文件、供应商实现
    public.ts                  供其他模块调用的稳定接口
packages/contracts/src/<domain>/ 跨端 DTO/事件；不放 ORM 实体
packages/viewer-3d/             场景呈现；不依赖业务接口
```

只在出现真实代码时建立对应层，不提前堆空目录。模块 README 描述职责、输入输出、依赖和数据归属。新增模块同步本文件和契约索引。

## 业务模块归属

| 模块 | 自己管理的职责 | 可调用的其他能力 |
|---|---|---|
| identity | 用户、组织、园区授权 | 无业务数据依赖 |
| assets | 资产树、测点、计量拓扑、生效期 | identity 的授权上下文 |
| telemetry | 原始/标准化读数、质量标记 | assets 公开目录 |
| imports | 文件、映射、预览、批次与错误 | 通过 telemetry/factors 等的批量接收接口入库 |
| energy | 发用储流量、聚合、分摊 | telemetry/ assets 的查询接口 |
| factors | 因子与方法引用、版本、适用性 | 来源证据存储接口 |
| accounting | 边界、核算运行、草稿、发布 | energy、factors 的版本化快照 |
| alarms | 规则、事件、确认与关闭 | telemetry 或领域事件 |
| scenes | 模型版本、构件与资产绑定 | assets 目录 |
| agent | 对话、工具编排、供应商适配 | 工具端口调用上述用例，不直写其他表 |
| audit | 操作与运行记录 | 接收各模块事件，不反向调用业务 |

## 依赖规则

- 同模块内部可相对导入；跨模块仅导入 `public.ts`，禁止读取对方 adapters 或 repository。
- domain 不依赖 NestJS、ORM、文件系统、LLM SDK。数据库实体不得作为 HTTP DTO。
- 模块只写自己拥有的表。跨领域事务先由应用用例明确编排；需要异步可靠发布时再引入 outbox。
- 报表跨域查询使用有归属、版本和权限的查询视图，不将前端绑定物理表结构。
- 共享包仅放确实跨端使用的契约；不创建收纳所有逻辑的 common 包。
- 新能源类型以设备能力和能源流分类扩展；新模型引擎通过场景适配器实现；新 LLM 供应商实现 provider port。
- 跨模块事件使用 `eventId/type/version/occurredAt/parkId/actorId/payload`；发布方负责语义，消费者负责幂等。M0 尚无事件总线。

`pnpm check:boundaries` 对当前代码导入进行静态检查：工作区方向、跨模块 public 入口、跨 feature 隔离与 domain 外部依赖。它是早期检查，不替代 PR 设计审查。

## 拆服务条件

在需要独立扩缩容、长任务隔离或独立发布且已有测量依据时再拆。抽象端口和数据归属提前固定，网络边界延后。
