import { createHash, randomUUID } from 'node:crypto';
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function writeJson(file, value) {
  const directory = path.dirname(file);
  await ensureDir(directory);
  const temporary = path.join(
    directory,
    `.${path.basename(file)}.${process.pid}.${randomUUID()}.tmp`,
  );

  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    });
    await rename(temporary, file);
  } catch (error) {
    try {
      await unlink(temporary);
    } catch (cleanupError) {
      if (cleanupError?.code !== 'ENOENT' && error.cause === undefined) {
        error.cause = cleanupError;
      }
    }
    throw error;
  }
}

export async function writeText(file, value) {
  await ensureDir(path.dirname(file));
  await writeFile(file, value, 'utf8');
}

/**
 * Read UTF-8 text without hiding I/O failures. A string second argument keeps
 * the former explicit-fallback call shape, but only missing files use it.
 */
export async function readText(file, options = {}) {
  const normalized = typeof options === 'string'
    ? { allowMissing: true, fallback: options }
    : options;
  const { allowMissing = false, fallback = '' } = normalized;

  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (allowMissing && error?.code === 'ENOENT') return fallback;
    throw error;
  }
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function runId(now = new Date(), random = randomUUID) {
  const suffix = String(random()).replace(/[^a-z0-9]/gi, '').slice(0, 8);
  if (suffix.length !== 8) {
    throw new TypeError('runId random source must provide at least 8 alphanumeric characters');
  }
  const timestamp = now.toISOString().replace(/[-:.]/g, '');
  return `${timestamp}-${suffix}`;
}

export function stripAnsi(value) {
  return String(value).replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, '');
}

export async function latestRun(runsDir) {
  let entries;
  try {
    entries = await readdir(runsDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }

  const names = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const name of names) {
    try {
      await readJson(path.join(runsDir, name, 'run.json'));
      return name;
    } catch (error) {
      if (error?.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error;
    }
  }
  return null;
}

export function rel(from, to) {
  return path.relative(from, to) || '.';
}

export function parseCli(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    const [rawKey, inline] = token.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inline !== undefined) {
      flags[key] = inline;
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      flags[key] = argv[index + 1];
      index += 1;
    } else {
      flags[key] = true;
    }
  }
  return { positional, flags };
}

export function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
