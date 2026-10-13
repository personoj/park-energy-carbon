import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { filesUnder } from './files.mjs';
const normalize = (value) => value.replaceAll('\\', '/');
const root = process.cwd();
const packages = ['contracts', 'viewer-3d'];
const sourceFiles = [...(await filesUnder('apps')), ...(await filesUnder('packages'))].filter(
  (file) => /\.(tsx?|mts|cts)$/.test(file),
);
let errors = 0;
const ignoredSources = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
  input: sourceFiles.map(normalize).join('\0') + '\0',
  encoding: 'utf8',
});
if (![0, 1].includes(ignoredSources.status))
  throw new Error('Cannot check source visibility in Git');
for (const ignored of ignoredSources.stdout.split('\0').filter(Boolean)) {
  console.error(`${ignored}: 源码被 gitignore 忽略，干净克隆将缺失此文件`);
  errors++;
}
function reject(file, target, reason) {
  console.error(`${file} → ${target}: ${reason}`);
  errors++;
}
for (const file of sourceFiles) {
  const current = normalize(file);
  const content = await readFile(file, 'utf8');
  const owner = current.match(/^(apps|packages)\/([^/]+)\//)?.[0];
  const imports = [
    ...content.matchAll(
      /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g,
    ),
  ].map((match) => match[1]);
  for (const target of imports) {
    const resolved = target.startsWith('.')
      ? normalize(path.relative(root, path.resolve(path.dirname(file), target)))
      : target;
    if (target.startsWith('.') && owner && !resolved.startsWith(owner))
      reject(current, target, '跨工作区只能使用公开包入口');
    if (target.startsWith('@park/')) {
      const packageName = target.split('/')[1];
      if (!packages.includes(packageName)) reject(current, target, '未知工作区依赖');
      if (target.split('/').length > 2) reject(current, target, '不允许包内部深路径导入');
      if (current.startsWith('packages/contracts/'))
        reject(current, target, 'contracts 不依赖其他工作区');
      if (current.startsWith('packages/viewer-3d/') && packageName !== 'contracts')
        reject(current, target, 'viewer 只能依赖场景契约');
      if (current.startsWith('apps/api/') && packageName !== 'contracts')
        reject(current, target, 'API 不依赖界面包');
    }
    const moduleOwner = current.match(/apps\/api\/src\/modules\/([^/]+)\//)?.[1];
    const importedModule = resolved.match(/apps\/api\/src\/modules\/([^/]+)\/(.*)/);
    if (
      moduleOwner &&
      importedModule &&
      importedModule[1] !== moduleOwner &&
      !/^public(?:\.ts)?$/.test(importedModule[2])
    )
      reject(current, target, '跨业务模块仅允许 public 入口');
    const featureOwner = current.match(/apps\/web\/src\/features\/([^/]+)\//)?.[1];
    const importedFeature = resolved.match(/apps\/web\/src\/features\/([^/]+)\//)?.[1];
    if (featureOwner && importedFeature && featureOwner !== importedFeature)
      reject(current, target, '跨 feature 组合放在 app 层');
    if (current.includes('/domain/') && (!target.startsWith('.') || !resolved.includes('/domain/')))
      reject(current, target, 'domain 保持纯领域依赖');
    if (current.startsWith('packages/contracts/') && !target.startsWith('.'))
      reject(current, target, 'contracts 不引入运行时外部依赖');
  }
  if (
    current.startsWith('packages/viewer-3d/') &&
    /\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(content)
  )
    reject(current, 'network', 'viewer 不直接调用业务网络');
}
if (errors) process.exitCode = 1;
else console.log(`Module boundaries: OK (${sourceFiles.length} source files)`);
