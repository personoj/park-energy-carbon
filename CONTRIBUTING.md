# 参与协作

先读 [范围](docs/product/scope.md)、[架构](docs/architecture/system.md) 和 [本地环境](docs/development/local-setup.md)。

1. 建立 Issue，描述用户行为、模块、接口变化、验收和数据是否合成。
2. 从最新 main 创建短分支：`feat/import-preview`、`fix/meter-reset`、`docs/accounting-boundary`。
3. 提前对齐 contracts、API 和迁移；模块内部由负责人维护。新包必须有明确消费者和职责，避免泛化的 common/utils。
4. 完成后运行 `pnpm check`；暂存明确文件，再运行 `pnpm check:public`。
5. 提交格式：`feat(imports): 增加导入预览`。提交 PR，写行为变化、验证证据和仍未实现的部分。
6. 由对应模块负责人审阅。建议 squash 合并，保持 main 可运行。

依赖变更单独说明目的，更新 lockfile；数据库迁移文件合并后不可改写历史，后续使用新迁移。公开 Issue/PR 不粘贴真实数据、连接串、客户模型或供应商响应中的敏感内容。

GitHub 角色、分支规则、CODEOWNERS 和 CI 详见 [协作流程](docs/development/github-workflow.md)。
