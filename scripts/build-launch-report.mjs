import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { evaluateReader10, evaluateReader10Payload } from '../src/reader10.mjs';
import { generateReport } from '../src/report.mjs';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const outputs = path.join(root, 'outputs');
await mkdir(outputs, { recursive: true });

const repository = 'https://github.com/minwoo19930301/relay10';
const releaseTarget = `${repository}/releases/tag/v0.1.0`;
const task = '국내 OMO·OMP·OMC·OMX·GJC·LazyCodex와 글로벌 코딩 에이전트 프로젝트를 공개 근거로 비교하고, 단계별 모델·추론 노력 라우팅과 10회 저비용 독자 검수를 갖춘 더 가벼운 Codex 하네스를 구현해 GitHub 출시를 준비한다.';
const summary = '현재 상태: 공개 저장소와 코드는 준비됐지만 v0.1.0 릴리스는 보류 중이다. 이 HTML은 새 수정본이며 아직 실제 모델 판독을 받지 않았다. 바로 전 수정본의 실제 판독은 8/10으로 실패했다. @minwoo19930301이 이 HTML을 npm run audit:launch로 10회 판독하고, 9/10 이상이며 치명적 구조 문제가 0개이면 같은 담당자가 릴리스를 승인한다. 자동 구조 검사의 10/10은 모델을 호출하지 않는 별도 형식 검사이므로 실제 판독 8/10과 합치거나 평균내지 않는다. 구현 근거는 73개 자동 테스트, 문법 검사, 실제 모델 탐색, 모델 배정 미리보기, 패키지 검사다. 남은 위험은 초기 규칙 기반 모델 배정의 실전 정확도, 같은 모델 계열 판단의 상관성, 비교 프로젝트의 빠른 변경이다. 용어: OMO(Oh My OpenAgent), OMP(Oh My Pi), OMC(Oh My ClaudeCode), OMX(Oh My Codex), GJC(Gajae-Code), CLI(명령줄 인터페이스), HTML(웹 문서 형식), URL(웹 주소), MIT(오픈소스 라이선스), LICENSE(라이선스 파일), RPC(원격 프로시저 호출), DSL(도메인 전용 언어), Reader-10(열 가지 독자 역할 검수), 하네스(작업 단계를 연결하는 실행 도구), 라우팅(단계별 모델 배정), economy(가벼운 역할), balanced(중간 역할), frontier(고성능 역할), low(낮은 추론 노력).';

const evidence = [
  { title: 'Relay10 공개 저장소', url: repository, note: 'GitHub CLI로 게시한 공식 저장소다.' },
  { title: 'Relay10 v0.1.0 릴리스 예정 주소', url: releaseTarget, note: '최종 실제 독자 검수 통과 전에는 존재하지 않는 것이 정상이다.' },
  { title: '직전 실제 Reader-10 실패 기록', url: `${repository}/blob/main/docs/launch-reader-live.json`, note: 'gpt-5.6-luna/low 10회 중 8회 통과. 이번 HTML의 판독 전 입력이며, 최종 실행 시 같은 파일이 새 결과로 교체된다.' },
  { title: '자동 테스트', url: `${repository}/tree/main/test`, note: '73개 회귀 테스트: 모델 배정, 구성, 하위 프로세스, 파이프라인, 동결 재생, 보고서 안전성.' },
  { title: '한국 하네스 조사 원문', url: `${repository}/blob/main/docs/korea-landscape.md`, note: '사실·추론·명칭 혼선을 분리한 2026-07-13 스냅샷.' },
  { title: '글로벌 오픈소스 조사 원문', url: `${repository}/blob/main/docs/global-landscape.md`, note: '실사용 점유율이 아닌 공개 프로젝트 지형과 선행 패턴.' },
  { title: 'OpenAI 최신 모델 가이드', url: 'https://developers.openai.com/api/docs/guides/latest-model.md', note: '현재 모델 계열과 추론 노력 안내.' },
  { title: 'Codex 설정 참고', url: 'https://learn.chatgpt.com/docs/config-file/config-reference', note: '모델 노력도와 읽기·쓰기 격리 권한 설정.' },
  { title: 'OMO · Oh My OpenAgent', url: 'https://github.com/code-yeongyu/oh-my-openagent' },
  { title: 'OMP · Oh My Pi', url: 'https://github.com/can1357/oh-my-pi' },
  { title: 'OMC · Oh My ClaudeCode', url: 'https://github.com/Yeachan-Heo/oh-my-claudecode' },
  { title: 'OMX · Oh My Codex', url: 'https://github.com/Yeachan-Heo/oh-my-codex' },
  { title: 'GJC · Gajae-Code', url: 'https://github.com/Yeachan-Heo/gajae-code' },
  { title: 'LazyCodex', url: 'https://github.com/code-yeongyu/lazycodex' },
  { title: 'OpenDev', url: 'https://github.com/opendev-to/opendev', note: '실행·사고·압축·자기검토 모델 슬롯을 나누는 직접 선행 사례.' },
  { title: 'Aider Architect와 Editor', url: 'https://aider.chat/2024/09/26/architect.html', note: '추론과 편집 모델을 분리한 선행 사례.' },
  { title: 'Continue 모델 역할', url: 'https://docs.continue.dev/customize/model-roles', note: '채팅·자동완성·편집·적용·임베딩·재순위화 역할 분리.' },
  { title: 'mini software-engineering agent', url: 'https://github.com/SWE-agent/mini-swe-agent', note: '작고 이해 가능한 코딩 에이전트 기준선.' },
];

const risks = [
  'economy·balanced·frontier는 Codex 카탈로그 메타데이터와 우선순위에 따른 역할 이름이지, 실시간 가격·지능·성공률 측정값이 아니다.',
  '실제 Reader-10은 같은 모델 계열을 여러 번 호출할 수 있으므로 10개의 독립적인 사람 판단으로 해석하면 안 된다.',
  '스카우트는 범용 Codex 읽기·검색 단계이며 전용 크롤러가 아니다. 복잡한 사이트 수집은 별도 도구가 필요하다.',
  '비교 프로젝트의 별, 릴리스, 기능, 라이선스 표시는 빠르게 바뀐다. 특히 OMO 코어의 Sustainable Use License는 상업 재사용 전 다시 확인해야 한다.',
  'Relay10 0.1에는 실행 중 자동 모델 승격, 재개 지점, 장기 예약 실행, 자체 목표 명령이 없다.',
];

const verificationChecks = [
  { name: 'Node 자동 테스트', passed: true, detail: 'npm test: 73개 통과, 실패 0개.' },
  { name: '문법 검사', passed: true, detail: 'npm run lint: src와 test의 모든 mjs 파일 node --check 통과.' },
  { name: '실제 Codex 모델 카탈로그', passed: true, detail: 'doctor에서 frontier=gpt-5.6-sol/max, balanced=gpt-5.6-terra/medium, economy=gpt-5.6-luna/low 확인.' },
  { name: '라우팅 스모크', passed: true, detail: '출시 성격의 요청을 frontier 위험도로 분류하고 5개 모델 단계와 구조 Reader-10 계획을 출력.' },
  { name: '패키지 검사', passed: true, detail: 'npm pack --dry-run: 19개 파일, 약 45 kB 압축, third-party npm runtime dependency 0개.' },
  { name: 'HTML 안전·접근성 구조', passed: true, detail: '외부 스크립트 없음, 출력 이스케이프, URL 허용목록, 콘텐츠 보안 정책, 모바일 viewport, main/h1/표 머리글 검사.' },
  { name: '직전 실제 저비용 독자 검수', passed: false, detail: 'gpt-5.6-luna/low 10회 중 8회 통과. 초보자와 쉬운 문장 독자가 점수 비교, 치명적 문제 기준, 수정·승인 담당자를 더 명확히 쓰라고 지적했다. 이 HTML은 그 지적을 반영한 판독 전 수정본이다.' },
];

const stages = [
  {
    title: '검수 상태를 읽는 법', status: 'warn', profile: '출시 게이트', model: '@minwoo19930301',
    summary: '자동 형식 검사, 직전 실제 판독, 이번 판독 입력을 서로 다른 상태로 분리한다.',
    output: '자동 구조 검사: 10/10 통과. 모델 호출 없음. HTML 형식과 접근성만 검사.\n직전 실제 모델 판독: 8/10 실패. 이 HTML을 만들기 전 결과.\n현재 HTML: 판독 전 입력. npm run audit:launch가 같은 저비용 모델을 열 가지 역할로 호출.\n출시 기준: 실제 판독 9/10 이상, 치명적 구조 문제 0개.\n치명적 구조 문제: 본문 없음, 실행 가능한 위험 링크, 활성 외부 삽입, 이미지 설명 누락처럼 읽기나 안전을 막는 문제.\n수정 담당: @minwoo19930301. 검수 실행 담당: @minwoo19930301. 최종 릴리스 승인과 GitHub 게시 담당: @minwoo19930301.',
  },
  {
    title: 'OMO(Oh My OpenAgent)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 가장 넓은 기능과 큰 공개 관심 신호, 단점은 큰 운영 표면과 라이선스 제약이다.',
    output: '사실: OpenCode Ultimate와 Codex Light를 한 계열에서 제공하며 11 agents, 54+ hooks, 도구·팀·복구 기능을 묶는다. 장점: 기능 폭과 생태계 신호가 크다. 단점: 상태·hook·도구의 상호작용이 많아 작은 하네스보다 진단 비용이 높다. 주의: 코어는 MIT가 아니라 Sustainable Use License 1.0이다. Relay10은 코드를 복제하지 않은 클린룸 구현을 택했다.',
  },
  {
    title: 'OMP(Oh My Pi)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 완성형 독립 엔진, 단점은 경량 라우터보다 훨씬 큰 구현·배포 범위다.',
    output: '사실: 자체 터미널 화면, 언어 서버, 디버거, 실행 환경, 하위 에이전트, 검색과 여러 공급자를 포함한 독립 코딩 에이전트다. 장점: 호스트 플러그인 한계를 벗어난 깊은 도구 통합과 MIT 라이선스. 단점: TypeScript·Rust·Python과 네이티브 기능을 함께 품어 단순한 Codex 래퍼의 기준에는 무겁다.',
  },
  {
    title: 'OMC(Oh My ClaudeCode)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 단계형 팀 실행, 단점은 여러 반복 실행 모드와 Claude Code 중심 경계다.',
    output: '사실: Claude Code 플러그인과 명령줄 도구로 계획·요구사항·실행·검증·수정 흐름과 전문 역할을 제공한다. 장점: staged team workflow가 명시적이다. 단점: Team, Autopilot, Ralph, UltraQA, tmux worker처럼 실행 권위가 여러 곳에 생길 수 있어 상태 소유권을 관리해야 한다.',
  },
  {
    title: 'OMX(Oh My Codex)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 Codex 위 durable goal·worktree 흐름, 단점은 설정·tmux·상태 학습면이다.',
    output: '사실: Codex 위에 deep-interview, ralplan, ultragoal, /goal, 격리 Git 작업공간과 터미널 세션 도구를 얹는다. 장점: 목표·근거·격리 작업공간을 오래 유지하는 운영 흐름. 단점: 설치 범위, 자동 연결 동작, 터미널 세션, 격리 작업공간, .omx 상태를 이해해야 한다. README는 MIT를 말하지만 조사 시점 root 표준 LICENSE 파일은 비어 있어 재사용 전 재확인이 필요하다.',
  },
  {
    title: 'GJC(Gajae-Code)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 좁은 공개 workflow, 단점은 내부 구현과 실험 기능이 여전히 크다는 점이다.',
    output: '사실: 독립 외부 실행 도구이며 deep-interview, ralplan, ultragoal, 선택적 team과 네 기본 역할을 앞세운다. 장점: 사용자에게 보이는 기본 방법이 비교적 작고 MIT다. 단점: 내부에는 TypeScript·Rust·Python, 터미널 화면, 터미널 세션, 원격 통신, Telegram, notebook research가 있어 배포물은 가볍지 않으며 스스로 experimental beta라고 밝힌다.',
  },
  {
    title: 'LazyCodex', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 한 줄 설치, 단점은 독립 엔진이 아니라 OMO Codex Light 배포층이라는 점이다.',
    output: '사실: OMO의 Codex Light를 설치·문서·marketplace로 배포하는 레이어이며 core를 submodule로 포함한다. 장점: 도입과 doctor 경험이 단순하다. 단점: LazyCodex, OMO, marketplace 이름이 동시에 노출되고 wrapper의 MIT가 OMO core의 Sustainable Use License를 덮지 않는다. OMO와 별도 엔진처럼 중복 집계하면 안 된다.',
  },
  {
    title: '글로벌 공개 프로젝트 지형', status: 'pass', profile: '해외 조사', model: '공식 문서',
    summary: '해외에도 단일 표준은 없으며, multi-CLI runner·workflow pack·독립 runtime·조직형 비동기 플랫폼으로 갈린다.',
    output: '확인된 선행 사례: OpenDev는 Normal·Thinking·Compact·Self-Critique·vision 역할별 모델 슬롯을 둔다. Continue는 chat·autocomplete·edit·apply·embed·rerank 역할을 나눈다. Aider는 Architect가 해결 방향을 만들고 Editor가 실제 편집을 만든다. Claude Squad와 Agent Orchestrator는 worktree에서 기존 CLI를 병렬 운영한다. mini software-engineering agent는 최소 코어 기준선이고 OpenHands·Open software-engineering agent·Ruflo는 더 큰 플랫폼 축이다. 공개 별은 발견 신호일 뿐 실제 해외 사용 점유율의 증거가 아니다.',
  },
  {
    title: 'Relay10 라우팅 설계', status: 'pass', profile: 'frontier', model: 'gpt-5.6-sol / max 원칙',
    summary: '사용자 아이디어를 난이도 하나가 아니라 오류 파급·검증 가능성·되돌림 가능성과 결합했다.',
    output: '기본 정책: 읽기·검색은 economy/low, 분석·계획은 frontier/max, 구현은 balanced/medium, 사실 검토는 frontier/high, 쉬운 설명은 balanced/low, 마지막 독자 검수는 economy/low 10회다. 복잡성, 위험, 영향 범위, 검증 가능성, 되돌림 가능성을 0~3으로 기록한다. 이 점수는 실행 전 초기 모델 배정이며 0.1은 실패 후 자동 승격하지 않는다. Codex task-level /goal로 이번 출시 목표를 추적했지만 Relay10 자체에는 /goal 명령 문법이 없다.',
  },
  {
    title: '경량·안전 구현', status: 'pass', profile: 'balanced', model: 'Node 20+ 내장 모듈',
    summary: '별도 데이터베이스·터미널 화면·runtime npm 패키지 없이 Codex subprocess와 파일 계약만 둔다.',
    output: '명령: init, doctor, route, run, inspect, report, replay. 안전 경계: 프로젝트가 모델 목록 확인 명령을 바꾸지 못함, 검증은 실행 파일과 인수 목록을 사람이 승인한 경우만 허용, 명령 해석기 없이 실행, 시간 초과 시 자식 실행 묶음 종료, 출력 크기 제한, 변경 실행 잠금, 실행 식별자 경로 제한, 안전한 파일 교체, 검토 근거 요구, 누락 검증은 통과 대신 주의, 파일 해시가 바뀌면 동결 재생 거부.',
  },
  {
    title: '출시·운영 안내', status: 'warn', profile: '사람 승인 필요', model: '@minwoo19930301',
    summary: '공개 저장소는 준비됐고 v0.1.0 릴리스는 보류다. 최종 실제 Reader-10 재검수 통과 뒤 릴리스를 게시한다.',
    output: `현재 상태: 저장소 공개 완료, v0.1.0 릴리스 보류.\n저장소: ${repository}\n릴리스 예정 주소: ${releaseTarget}\n로컬 설치: git clone ${repository}.git && cd relay10 && npm link\n검증: npm test && npm run lint && r10 doctor\n모델 배정 확인: r10 route "research and build a small CLI" --json\n실행 전 미리보기: r10 run "your task" --dry-run\n실제 독자 검수 기록: docs/launch-reader-live.json 및 outputs/relay10-launch-reader-live.json\n수정·검수 실행·최종 승인·GitHub 게시 담당: @minwoo19930301. 0.1 평가 제안은 읽기 10건, 구현 10건, 고위험 미리보기 10건에서 기대 모델 배정과 실패 상태를 기록하는 것이다. 완료 기준은 30건 전체에 기대 배정 라벨, 허위 통과 0건, 치명적 독자 문제 0건이다. 비교 코드 재사용이나 OMO 계열 상업 사용이 생기면 릴리스 전에 별도 라이선스 검토를 연다.`,
  },
];

const nextSteps = [
  `설치: git clone ${repository}.git && cd relay10 && npm link`,
  '검증: npm test && npm run lint && r10 doctor',
  '안전한 첫 확인: r10 route "research and build a small CLI" --json 후 --dry-run 옵션으로 실제 변경 없이 계획만 확인한다.',
  '담당자 @minwoo19930301이 이 HTML을 npm run audit:launch로 최종 10회 판독한다. 9/10 미만 또는 치명적 구조 문제 1개 이상이면 출시하지 않는다.',
  '실패하면 outputs/relay10-launch-reader-live.json의 “막힌 모호점” 목록을 고치고 HTML을 다시 생성한 뒤 10회 전체를 재실행한다.',
  '검수 통과 후 같은 담당자가 gh repo view minwoo19930301/relay10, gh release view v0.1.0 --repo minwoo19930301/relay10로 공개 상태를 확인하고 릴리스를 승인한다.',
  '30개 라우팅 평가 세트를 @minwoo19930301이 관리한다. 실측 전에는 비용·속도·품질 우월성을 광고하지 않는다.',
];

const base = {
  title: 'Relay10 0.1 출시 준비 보고서',
  task,
  summary,
  runId: 'relay10-launch-20260713',
  generatedAt: '2026-07-13T14:30:00+09:00',
  status: 'warn',
  routing: {
    decisions: [
      { stage: '자료 읽기·검색', profile: 'economy', effort: 'low', model: '현재 로컬: gpt-5.6-luna', enabled: true, reason: '되돌릴 수 있고 구조 검증이 쉬운 수집' },
      { stage: '분석·계획', profile: 'frontier', effort: 'max', model: '현재 로컬: gpt-5.6-sol', enabled: true, reason: '판단 오류의 파급이 큰 단계' },
      { stage: '구현', profile: 'balanced', effort: 'medium', model: '현재 로컬: gpt-5.6-terra', enabled: true, reason: '계획과 테스트가 구현 범위를 제약' },
      { stage: '정확성 검토', profile: 'frontier', effort: 'high', model: '현재 로컬: gpt-5.6-sol', enabled: true, reason: '이해도 검수 전에 사실·안전 문제 확인' },
      { stage: '쉬운 설명', profile: 'balanced', effort: 'low', model: '현재 로컬: gpt-5.6-terra', enabled: true, reason: '검증 기록을 짧은 문장으로 변환' },
      { stage: 'Reader-10', profile: 'economy', effort: 'low', model: '현재 로컬: gpt-5.6-luna', enabled: true, reason: '10회 호출로 이해도만 판정; 독립성·사실성 보장 아님' },
    ],
  },
  stages,
  verification: { checks: verificationChecks },
  evidence,
  nextSteps,
};

const payloadGate = evaluateReader10Payload({
  task,
  summary,
  evidence,
  verification: { checks: verificationChecks },
  risks,
  nextSteps,
}, { minPass: 9 });
if (!payloadGate.passed) {
  const failed = payloadGate.personas
    .filter((persona) => !persona.passed)
    .map((persona) => ({ id: persona.id, recommendations: persona.recommendations }));
  throw new Error(`Launch payload failed structural Reader-10: ${JSON.stringify({ critical: payloadGate.criticalIssues, failed })}`);
}

const final = generateReport({ ...base, reader10: payloadGate });
const renderAudit = evaluateReader10(final, { minPass: 9 });
if (!renderAudit.passed) {
  const failed = renderAudit.personas
    .filter((persona) => !persona.passed)
    .map((persona) => ({ id: persona.id, recommendations: persona.recommendations }));
  throw new Error(`Launch HTML failed render audit: ${JSON.stringify({ critical: renderAudit.criticalIssues, failed })}`);
}

const deterministicAudit = {
  version: 1,
  generatedAt: new Date().toISOString(),
  payloadGate,
  renderAudit,
};
await writeFile(path.join(root, 'docs', 'launch-report.html'), final, 'utf8');
await writeFile(
  path.join(root, 'docs', 'launch-reader-deterministic.json'),
  `${JSON.stringify(deterministicAudit, null, 2)}\n`,
  'utf8',
);
await writeFile(path.join(outputs, 'relay10-launch-report.html'), final, 'utf8');
process.stdout.write(`launch report: payload ${payloadGate.passedPersonas}/10, render ${renderAudit.passedPersonas}/10, ${renderAudit.criticalCount} critical\n`);
