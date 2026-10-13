import { readdir } from 'node:fs/promises';
import path from 'node:path';
export async function filesUnder(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.local'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await filesUnder(file)));
    else if (entry.isFile()) output.push(file);
  }
  return output;
}
