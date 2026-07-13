import { spawn } from 'node:child_process';
import path from 'node:path';
import { stripAnsi } from './utils.mjs';

export const MAX_CAPTURE_BYTES = 2 * 1024 * 1024;
const DEFAULT_KILL_GRACE_MS = 2_000;

export function codexArgs({
  model,
  effort,
  cwd,
  outputFile,
  outputSchema,
  sandbox = 'read-only',
  search = false,
}) {
  const args = [
    '--ask-for-approval',
    'never',
  ];
  if (search) args.push('--search');
  args.push(
    'exec',
    '-',
    '--ephemeral',
    '--skip-git-repo-check',
    '--color',
    'never',
    '--sandbox',
    sandbox,
    '--cd',
    cwd,
    '--output-last-message',
    outputFile,
  );
  if (model && model !== 'auto') args.push('--model', model);
  if (effort) args.push('--config', `model_reasoning_effort=${JSON.stringify(effort)}`);
  if (outputSchema) args.push('--output-schema', outputSchema);
  return args;
}

export function spawnCapture(command, args, options = {}) {
  const {
    cwd = process.cwd(),
    input,
    timeoutMs = 1_200_000,
    shell = false,
    env = process.env,
    killGraceMs = DEFAULT_KILL_GRACE_MS,
  } = options;
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const useProcessGroup = process.platform !== 'win32';
    const child = spawn(command, args, {
      cwd,
      env,
      shell,
      detached: useProcessGroup,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const stdout = boundedCapture(MAX_CAPTURE_BYTES);
    const stderr = boundedCapture(MAX_CAPTURE_BYTES);
    let timedOut = false;
    let settled = false;
    let forceKillSent = false;
    let closeResult;
    let forceKillTimer;

    function clearTimers() {
      clearTimeout(timer);
      clearTimeout(forceKillTimer);
    }

    function finish() {
      if (settled || !closeResult) return;
      settled = true;
      clearTimers();
      const stdoutText = stripAnsi(stdout.text());
      const stderrText = stripAnsi(stderr.text());
      resolve({
        command: [command, ...args].join(' '),
        code: closeResult.code ?? 1,
        signal: closeResult.signal,
        timedOut,
        durationMs: Date.now() - startedAt,
        stdout: stdoutText,
        stderr: stderrText,
        stdoutTruncated: stdout.truncated,
        stderrTruncated: stderr.truncated,
        truncated: stdout.truncated || stderr.truncated,
        captureLimitBytes: MAX_CAPTURE_BYTES,
      });
    }

    function processGroupAlive() {
      if (!useProcessGroup || !child.pid) return false;
      try {
        process.kill(-child.pid, 0);
        return true;
      } catch (error) {
        return error?.code === 'EPERM';
      }
    }

    function signalTree(signal) {
      if (!child.pid) return;
      if (useProcessGroup) {
        try {
          process.kill(-child.pid, signal);
          return;
        } catch (error) {
          if (error?.code !== 'ESRCH') child.kill(signal);
          return;
        }
      }
      const taskkill = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      taskkill.on('error', () => child.kill(signal));
    }

    const timer = setTimeout(() => {
      timedOut = true;
      signalTree('SIGTERM');
      forceKillTimer = setTimeout(() => {
        forceKillSent = true;
        signalTree('SIGKILL');
        if (closeResult) finish();
      }, killGraceMs);
    }, timeoutMs);
    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimers();
      reject(error);
    });
    child.on('close', (code, signal) => {
      closeResult = { code, signal };
      if (!timedOut || forceKillSent || !processGroupAlive()) finish();
    });
    child.stdin.on('error', (error) => {
      if (error?.code === 'EPIPE' || settled) return;
      settled = true;
      clearTimers();
      signalTree('SIGKILL');
      reject(error);
    });
    if (input !== undefined) child.stdin.end(input);
    else child.stdin.end();
  });
}

function boundedCapture(limit) {
  let buffer = Buffer.alloc(0);
  let truncated = false;
  return {
    push(chunk) {
      const incoming = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (incoming.length >= limit) {
        truncated ||= buffer.length > 0 || incoming.length > limit;
        buffer = Buffer.from(incoming.subarray(incoming.length - limit));
        return;
      }
      const overflow = buffer.length + incoming.length - limit;
      if (overflow > 0) {
        truncated = true;
        buffer = Buffer.concat([buffer.subarray(overflow), incoming], limit);
        return;
      }
      buffer = Buffer.concat([buffer, incoming], buffer.length + incoming.length);
    },
    text() {
      return buffer.toString('utf8');
    },
    get truncated() {
      return truncated;
    },
  };
}

export async function runCodex({ prompt, timeoutMs, ...options }) {
  const args = codexArgs(options);
  const result = await spawnCapture('codex', args, {
    cwd: options.cwd,
    input: prompt,
    timeoutMs,
  });
  if (result.code !== 0) {
    const error = new Error(`Codex stage failed (${result.code}): ${result.stderr.slice(-1200)}`);
    error.result = result;
    throw error;
  }
  return result;
}

export async function runVerification(spec, { cwd, timeoutMs }) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
    throw new TypeError('verification must be an object with command and args');
  }
  const unknownKeys = Object.keys(spec).filter((key) => key !== 'command' && key !== 'args');
  if (unknownKeys.length) {
    throw new TypeError(`unsupported verification keys: ${unknownKeys.join(', ')}`);
  }
  const { command, args = [] } = spec;
  if (typeof command !== 'string' || !command.trim()) {
    throw new TypeError('verification.command must be a non-empty string');
  }
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) {
    throw new TypeError('verification.args must be an array of strings');
  }
  const result = await spawnCapture(command, args, { cwd, timeoutMs, shell: false });
  return { ...result, executable: command, args: [...args] };
}

export async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function consume() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, consume));
  return results;
}

export function stageOutput(runDir, stage) {
  return path.join(runDir, `${stage}.md`);
}
