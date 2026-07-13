import assert from 'node:assert/strict';
import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { DEFAULT_CONFIG } from '../src/config.mjs';
import { buildRunPlan, runPipeline, verifyFrozenRun } from '../src/pipeline.mjs';
import { routeTask } from '../src/router.mjs';
import { readJson, readText, writeText } from '../src/utils.mjs';

const catalog = {
  roles: {
    frontier: { model: 'frontier', effort: 'max', supportedEfforts: ['low', 'high', 'max'] },
    balanced: { model: 'balanced', effort: 'medium', supportedEfforts: ['low', 'medium', 'high'] },
    economy: { model: 'economy', effort: 'low', supportedEfforts: ['low'] },
  },
};

const task = '작은 CLI를 구현하고 테스트해줘';

test('buildRunPlan counts deterministic and live reader calls', () => {
  const route = routeTask(task, { quorum: 9 });
  const deterministic = buildRunPlan({ task, route, catalog, config: DEFAULT_CONFIG });
  const live = buildRunPlan({ task, route, catalog, config: DEFAULT_CONFIG, liveReaders: true });
  assert.equal(deterministic.callEstimate.minimum, 5);
  assert.equal(deterministic.callEstimate.maximum, 5);
  assert.equal(live.callEstimate.minimum, 15);
  assert.equal(live.callEstimate.maximum, 26);
  assert.equal(deterministic.stages.find((stage) => stage.id === 'architect').effort, 'max');
});

test('runPipeline completes with injected model execution and writes a frozen report', async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'relay10-pipeline-'));
  const route = routeTask(task, { quorum: 9 });
  const calls = [];
  const fakeCodex = async (options) => {
    calls.push(options);
    let output = '작은 CLI 구현 작업의 목적과 결과를 기록했습니다. 다음 단계는 변경 내용을 사람이 확인하는 것입니다. 실패하면 로그를 확인하세요.';
    if (options.outputFile.endsWith('scout.json')) {
      output = JSON.stringify({
        summary: '작은 CLI 구현에 필요한 파일을 확인했습니다.',
        facts: ['Node 프로젝트입니다.'],
        evidence: [{ title: 'package.json', url: 'package.json', excerpt: '테스트 명령이 있습니다.' }],
        open_questions: [],
      });
    }
    if (options.outputFile.endsWith('reviewer.json')) {
      output = JSON.stringify({
        verdict: 'pass',
        summary: '요청과 구현이 일치합니다.',
        findings: [],
        acceptance_checks: [{ criterion: '작은 CLI 구현', passed: true, evidence: 'maker.md와 검증 결과' }],
      });
    }
    if (options.outputFile.endsWith('summary.md')) {
      output = '결과 요약\n\n요청한 작은 CLI 구현을 완료했습니다. 승인된 테스트 검증은 통과했습니다. 다음 단계는 변경 내용을 확인하는 것입니다. 오류가 발생하면 검증 로그를 확인하세요.';
    }
    await writeText(options.outputFile, output);
    return { code: 0, durationMs: 1, stdout: '', stderr: '' };
  };

  const result = await runPipeline({
    task,
    cwd,
    config: {
      ...structuredClone(DEFAULT_CONFIG),
      verification: { commands: [{ command: 'npm', args: ['test'] }] },
    },
    catalog,
    route,
    runCodexImpl: fakeCodex,
    runVerificationImpl: async () => ({ code: 0, timedOut: false, stdout: 'ok', stderr: '' }),
    allowVerificationCommands: true,
    now: () => new Date('2026-07-13T00:00:00Z'),
  });

  assert.equal(result.manifest.status, 'pass');
  assert.equal(result.manifest.calls.used, 5);
  assert.equal(calls.find((call) => call.outputFile.endsWith('maker.md')).sandbox, 'workspace-write');
  assert.equal(calls.find((call) => call.outputFile.endsWith('scout.json')).sandbox, 'read-only');
  assert.match(await readText(path.join(result.runDir, 'report.html')), /Reader-10 검수/);
  assert.equal((await readJson(path.join(result.runDir, 'readers.json'))).passed, true);
  assert.ok(result.manifest.artifacts['report.html'].sha256);
  assert.equal((await verifyFrozenRun(result.runDir)).manifest.status, 'pass');
  await writeText(path.join(result.runDir, 'report.html'), 'tampered');
  await assert.rejects(verifyFrozenRun(result.runDir), /hash mismatch: report\.html/);
});

test('mutation without verification commands is WARN, never a verified pass', async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'relay10-unverified-'));
  const route = routeTask(task, { quorum: 9 });
  const fakeCodex = async ({ outputFile }) => {
    let output = '작은 CLI 구현 결과입니다. 다음 단계는 사람이 결과를 확인하는 것입니다. 오류가 생기면 실행 기록을 확인하세요.';
    if (outputFile.endsWith('scout.json')) output = JSON.stringify({
      summary: '작은 CLI 파일을 읽었습니다.', facts: ['Node 프로젝트'],
      evidence: [{ title: 'package.json', url: 'package.json', excerpt: '프로젝트 정보' }], open_questions: [],
    });
    if (outputFile.endsWith('reviewer.json')) output = JSON.stringify({
      verdict: 'pass', summary: '구조는 맞습니다.', findings: [],
      acceptance_checks: [{ criterion: '구현 존재', passed: true, evidence: 'maker.md' }],
    });
    await writeText(outputFile, output);
    return { code: 0, durationMs: 1, stdout: '', stderr: '' };
  };
  const result = await runPipeline({
    task, cwd, config: structuredClone(DEFAULT_CONFIG), catalog, route, runCodexImpl: fakeCodex,
  });
  assert.equal(result.verification.status, 'unverified');
  assert.equal(result.verification.passed, false);
  assert.equal(result.manifest.status, 'warn');
});

test('a run never removes a workspace lock that it did not acquire', async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'relay10-locked-'));
  const stateDir = path.join(cwd, '.relay10');
  const lockFile = path.join(stateDir, 'workspace.lock');
  await mkdir(stateDir, { recursive: true });
  await writeText(lockFile, 'other-run\n');
  const route = routeTask(task, { quorum: 9 });

  await assert.rejects(
    runPipeline({
      task,
      cwd,
      config: structuredClone(DEFAULT_CONFIG),
      catalog,
      route,
      runCodexImpl: async () => { throw new Error('must not execute'); },
    }),
    /another mutating Relay10 run holds/,
  );
  assert.equal(await readText(lockFile), 'other-run\n');
});
