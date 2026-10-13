# API 与事件契约

## 当前已实现

| 路径 | 说明 |
|---|---|
| GET /api/health | 进程健康，返回 bootstrap 与数据库未配置状态 |
| GET /api/demo/campus | 固定的合成资产、时间区间、能量指标与告警数 |

响应类型位于 `packages/contracts/src`。当前 API 无认证，只监听 127.0.0.1，仅用于本地演示。尚无导入、SQL、核算、文件或管理接口。

## 后续业务 API 约定

- 正式业务接口使用 `/api/v1`；破坏性变更新版本。M1 用 OpenAPI 生成前端客户端与运行时校验。
- 字段使用稳定 ID；数值明确单位、聚合粒度、期间、质量与来源；高精度十进制通过字符串传输。
- 列表显式分页与排序；核算/导入长任务返回 jobId 和状态查询接口。
- 写入支持幂等键；版本更新使用 expectedVersion 防止覆盖并发修改。
- 错误结构：`code/message/traceId/details`，details 不含凭据和内部堆栈。
- 鉴权和园区授权由服务端实现，返回字段也遵循权限。
- 时间区间为 startInclusive/endExclusive；明确时间戳时区与业务时区。
- 事件与可靠发布约定见 [系统架构](../architecture/system.md)。

接口变更由拥有该用例的模块发起，前端只依赖契约，不能从后端内部路径导入类型。
