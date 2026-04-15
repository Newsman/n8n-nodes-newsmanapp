import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const copies = [
  {
    from: resolve(root, 'nodes', 'Newsman', 'newsman.icon.png'),
    to: resolve(root, 'dist', 'nodes', 'Newsman', 'newsman.icon.png'),
  },
];

for (const item of copies) {
  if (!existsSync(item.from)) {
    // Keep build resilient if asset is temporarily missing.
    continue;
  }

  mkdirSync(dirname(item.to), { recursive: true });
  cpSync(item.from, item.to, { force: true });
}

