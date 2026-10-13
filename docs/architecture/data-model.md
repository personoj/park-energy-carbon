# 概念数据模型与所有权

本文件不是已部署数据库结构。PostgreSQL 为目标，具体 DDL 在 M1 审阅后添加。

| 数据归属 | 主要实体 |
|---|---|
| identity | organization, user, membership, park_grant |
| assets | park, building, asset, meter_point, meter_mapping_version |
| telemetry | raw_observation, normalized_observation, quality_issue, revision |
| imports | source_file, mapping_version, import_batch, staging_row, import_error |
| energy | energy_flow, aggregation_run, allocation_method |
| factors | emission_factor_version, method_version, source_evidence |
| accounting | boundary_version, run, activity_snapshot, result_line, publication |
| scenes | model_version, scene_manifest, asset_binding |
| alarms | rule_version, alarm_event, alarm_action |
| agent/audit | agent_run, tool_call, query_audit, operation_event |

## 约束

- 业务主键用稳定 ID，跨模块传 ID/DTO，不传数据库连接或 ORM 实体。
- 园区数据的授权键由身份上下文决定，不能信任请求中的 parkId。
- 时间采用带时区时间戳；业务周期采用明确园区时区和左闭右开区间。
- 电量、金额、因子与排放采用适当精度的 NUMERIC；确定精度与溢出策略后生成 DDL。
- 原始记录保留、修订有链、核算有快照、发布不可覆盖。
- 每个迁移标明模块归属；公共分析视图标明版本、授权范围、单位和聚合粒度。
- 高频读数表与业务事务表分开。是否增加 TimescaleDB 由点数、频率、保留期与查询基准决定。
- 组织层级与能源计量拓扑分别建模，防止重复汇总。

PostgreSQL 可以利用权限与行级安全强化园区隔离；实际实施需验证表所有者、超级用户和 BYPASSRLS 的绕过行为，应用与 Agent 不能使用这些角色。

参考：[PostgreSQL 行级安全](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)。生产版本及扩展在 M1 固定，不因参考链接自动选定版本。
