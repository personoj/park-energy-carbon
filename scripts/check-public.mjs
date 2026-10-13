import { execFileSync, spawnSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';

// Inspect both the tracked working tree and index. Never print matching secret contents.
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const names = git('ls-files', '-z', '--cached').split('\0').filter(Boolean);
const staged = new Set(
  git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z').split('\0').filter(Boolean),
);
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-[A-Za-z0-9_-]{24,}\b/,
  /postgres(?:ql)?:\/\/(?!USER:PASSWORD@)[^\s:@/]+:[^\s@/]+@/i,
];
let errors = 0;
function reject(file, reason) {
  console.error(`${file}: ${reason}`);
  errors++;
}
const ignoreResult = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
  input: names.join('\0') + '\0',
  encoding: 'utf8',
});
if (![0, 1].includes(ignoreResult.status)) throw new Error('Cannot evaluate gitignore rules');
const ignored = new Set(ignoreResult.stdout.split('\0').filter(Boolean));
for (const file of new Set(names)) {
  if (ignored.has(file)) reject(file, '已跟踪文件违反 gitignore 公开边界');
  let buffer;
  try {
    if ((await stat(file)).size > 2 * 1024 * 1024) {
      reject(file, '文件超过 2 MiB，请审阅并使用资产存储');
      continue;
    }
    buffer = await readFile(file);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  if (patterns.some((pattern) => pattern.test(buffer.toString('utf8'))))
    reject(file, '疑似凭据内容');
  if (staged.has(file)) {
    const indexed = git('show', `:${file}`);
    if (patterns.some((pattern) => pattern.test(indexed))) reject(file, '暂存版本疑似包含凭据');
  }
}
if (errors) process.exitCode = 1;
else console.log(`Public repository content: OK (${new Set(names).size} tracked files)`);
