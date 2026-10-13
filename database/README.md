# 数据库目录

M0 不连接数据库、不运行迁移、不复制旧项目数据。概念模型见 [数据模型](../docs/architecture/data-model.md)。

M1 开始添加 `migrations/YYYYMMDDHHmm_<module>_<change>.sql`，注明模块、前置版本、锁影响、回退/修复方式。只在此目录放 DDL，不把真实数据导出伪装为迁移。已合并迁移不可改写。

合成种子放 `seeds/` 并标注合成；真实导入通过应用批次流程。SQL 默认被 gitignore 忽略，仅 migrations/seeds 的直接子文件允许跟踪。每个开发者使用独立库。
