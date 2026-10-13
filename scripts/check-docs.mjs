import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { filesUnder } from './files.mjs';
let errors = 0;
for (const file of (await filesUnder('.')).filter((file) => file.endsWith('.md'))) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    try {
      await access(path.resolve(path.dirname(file), decodeURIComponent(target)));
    } catch {
      console.error(`Broken relative link: ${file} → ${target}`);
      errors++;
    }
  }
}
if (errors) process.exitCode = 1;
else console.log('Markdown relative links: OK');
