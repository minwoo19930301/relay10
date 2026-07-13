import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { evaluateReader10, evaluateReader10Payload } from '../src/reader10.mjs';
import { generateReport } from '../src/report.mjs';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const outputs = path.join(root, 'outputs');
await mkdir(outputs, { recursive: true });

const repository = 'https://github.com/minwoo19930301/relay10';
const releaseTarget = `${repository}/releases/tag/v0.1.1`;
const verificationLog = JSON.parse(await readFile(path.join(root, 'docs', 'launch-verification.json'), 'utf8'));
if (verificationLog.passed !== true || !Array.isArray(verificationLog.commands)) {
  throw new Error('Run npm run verify:launch successfully before building the launch report.');
}
const task = '국내 OMO·OMP·OMC·OMX·GJC·LazyCodex와 글로벌 코딩 에이전트 프로젝트를 공개 근거로 비교해 각각의 장점과 단점, Relay10이 채택하거나 제외한 설계, 공급자와 CLI·앱 지원 경계를 명확히 밝히고, 단계별 모델·추론 노력 라우팅과 10회 저비용 독자 검수를 갖춘 더 가벼운 하네스를 GitHub에 출시한다.';
const summary = '결론부터 말하면 Relay10 v0.1.1의 검증된 공식 실행 경로는 Codex CLI와 현재 로컬 OpenAI 모델뿐이다. Grok은 Codex의 xAI custom provider를 거치는 Responses 호환 실험 후보지만 실제 종단간 검증이 없고 한 실행 안의 단계별 공급자 혼합도 지원하지 않는다. Claude·Gemini API 직접 연결은 지원하지 않는다. Codex 데스크톱에서는 터미널이나 Skill이 r10을 호출하는 간접 사용만 가능하고, 앱의 현재 task 모델을 바꾸는 네이티브 Plugin·MCP·Apps SDK·독립 GUI 통합은 아직 없다. Relay10이 비교 하네스에서 선택한 것은 코드를 복사한 것이 아니라 역할별 모델 배정, plan·build·review 분리, doctor와 inspectable evidence, external wrapper, 간단한 진입 UX라는 설계 패턴이다. 반대로 agent 군집, tmux·worktree team, 장기 loop, TUI·native runtime, 전역 plugin 주입은 경량성을 위해 제외했다. Relay10 고유 부분은 위험·파급·검증 가능성·되돌림 가능성을 함께 쓰는 초기 router, 정확성과 설명 명료성의 분리, hash-bound frozen replay, Reader-10 열 번 검수다. 제품 v0.1.1은 2026-07-13에 GitHub에 공개 완료됐다. 이 HTML의 상태는 생성 시점에 실제 Reader-10 판독 대기이며 제품 출시 보류를 뜻하지 않는다. 최종 전달물은 이 HTML과 별도 Reader-10 JSON이다. JSON의 passedPersonas가 10, criticalCount가 0이고 reportSha256이 이 HTML의 SHA-256과 같으면 사후 판독 통과다. 자동 구조 검사는 제목·링크·접근성을 확인하지만 뜻을 이해하지 못하며, 실제 판독은 economy 역할 모델을 low 노력으로 열 번 호출해 목적, 결과, 근거, 위험, 다음 행동을 다시 말하게 한다. 구현 근거는 74개 자동 테스트, 문법 검사, 실제 모델 탐색, 모델 배정 미리보기, 패키지 검사다. 용어: OMO(Oh My OpenAgent), OMP(Oh My Pi), OMC(Oh My ClaudeCode), OMX(Oh My Codex), GJC(Gajae-Code), CLI(명령줄 인터페이스), GUI(그래픽 화면 인터페이스), TUI(터미널 화면 인터페이스), UI(사용자 화면), UX(사용 경험), IDE(통합 개발 환경), SDK(개발 도구 모음), HTML(웹 문서 형식), HTTP(웹 통신 규격), JSON(구조화 데이터 파일), SHA-256(파일 내용 식별값), URL(웹 주소), MIT(오픈소스 라이선스), LICENSE(라이선스 파일), NOTICE(출처·권리 고지 파일), SUL(지속가능 사용 라이선스), RPC(원격 프로시저 호출), ACP(에이전트 통신 규격), MCP(앱과 도구를 연결하는 규격), DSL(도메인 전용 언어), API(프로그램 연결 규격), LSP(언어 서버 규격), DAP(디버거 연결 규격), AST(코드 문법 트리), PRD(제품 요구사항 문서), QA(품질 검증), HUD(상태 표시 화면), RLM(긴 문맥 처리 연구 방식), E2E(처음부터 끝까지의 통합 검증), SWE(소프트웨어 엔지니어링), Reader-10(열 가지 독자 역할 검수), 하네스(작업 단계를 연결하는 실행 도구), 라우팅 또는 모델 배정(단계별로 쓸 모델을 고르는 것), economy·balanced·frontier(가벼운·중간·고성능 역할 이름), low(낮은 추론 노력), Codex subprocess(현재 프로그램이 별도 Codex 작업을 실행하는 방식), dry-run(파일을 바꾸지 않는 미리보기), npm(자바스크립트 도구 실행·설치 명령).';

const evidence = [
  { title: 'Relay10 공개 저장소', url: repository, note: 'GitHub CLI로 게시한 공식 저장소다.' },
  { title: 'Relay10 v0.1.1 공개 릴리스', url: releaseTarget, note: '2026-07-13T05:15:21Z에 공개된 고정 배포본 주소다.' },
  { title: 'Reader-10 결과 저장 위치', url: `${repository}/blob/main/docs/launch-reader-live.json`, note: '이 HTML 생성 뒤 판독 명령이 10회 결과와 reportSha256으로 갱신한다. 링크의 결과는 reportSha256이 현재 HTML과 같을 때만 유효하다.' },
  { title: '출시 검증 원본 명령 로그', url: `${repository}/blob/main/docs/launch-verification.json`, note: `실행 시각 ${verificationLog.generatedAt}. 테스트·문법·모델 탐색·모델 배정·패키지 검사의 명령, 종료 코드, stdout, stderr 원문.` },
  { title: '자동 구조 검사 원본', url: `${repository}/blob/main/docs/launch-reader-deterministic.json`, note: '내용 구조와 최종 HTML 렌더를 각각 검사하고 치명적 문제 수를 기록한다.' },
  { title: '자동 테스트', url: `${repository}/tree/main/test`, note: '74개 회귀 테스트: 모델 배정, 구성, 하위 프로세스, 파이프라인, 동결 재생, 보고서 안전성.' },
  { title: '한국 하네스 조사 원문', url: `${repository}/blob/main/docs/korea-landscape.md`, note: '사실·추론·명칭 혼선을 분리한 2026-07-13 스냅샷.' },
  { title: '글로벌 오픈소스 조사 원문', url: `${repository}/blob/main/docs/global-landscape.md`, note: '실사용 점유율이 아닌 공개 프로젝트 지형과 선행 패턴.' },
  { title: 'Relay10 설계 계보와 이식성 판정', url: `${repository}/blob/main/docs/lineage-and-portability.md`, note: '여섯 하네스의 장단점·채택·제외와 공급자·앱별 현재 지원 경계.' },
  { title: 'OpenAI 최신 모델 가이드', url: 'https://developers.openai.com/api/docs/guides/latest-model.md', note: '현재 모델 계열과 추론 노력 안내.' },
  { title: 'Codex 설정 참고', url: 'https://learn.chatgpt.com/docs/config-file/config-reference', note: '모델 노력도와 읽기·쓰기 격리 권한 설정.' },
  { title: 'Codex Skill 공식 문서', url: 'https://learn.chatgpt.com/docs/build-skills', note: 'Codex 앱·CLI·IDE에서 재사용 가능한 지침과 스크립트의 지원 표면.' },
  { title: 'Codex Plugin 공식 문서', url: 'https://learn.chatgpt.com/docs/build-plugins', note: 'Skill, MCP app, manifest를 묶는 앱 배포 경로.' },
  { title: 'Codex App Server 공식 문서', url: 'https://learn.chatgpt.com/docs/app-server', note: 'Codex 기반 custom client의 thread·turn·model API.' },
  { title: 'xAI Responses API', url: 'https://docs.x.ai/developers/quickstart', note: 'Grok의 Responses-compatible 실험 가능성을 판단한 공식 근거.' },
  { title: 'Anthropic OpenAI SDK compatibility', url: 'https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk', note: 'Claude 호환 계층과 현재 Codex Responses-only 경계의 차이.' },
  { title: 'Gemini OpenAI compatibility', url: 'https://ai.google.dev/gemini-api/docs/openai', note: 'Gemini 호환 계층과 네이티브 adapter 필요성을 판단한 공식 근거.' },
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
  '현재 코드는 codex executable, codex debug models, Codex 전용 sandbox·search·output-schema 인수에 결합돼 있다. OpenAI 호환 API라는 이유만으로 완전한 코딩 agent runtime 호환이 성립하지 않는다.',
  'Grok은 Codex custom provider를 통한 프로토콜상 실험 후보일 뿐 실제 파일 도구·검색·structured output·Reader-10 종단간 검증이 없으므로 현재 지원으로 광고하면 안 된다.',
  'Codex Skill이나 Plugin은 앱에서 호출 경로를 만들 수 있지만 그 자체가 현재 앱 task의 모델을 Relay10 단계마다 교체하지는 않는다.',
  '비교 프로젝트의 별, 릴리스, 기능, 라이선스 표시는 빠르게 바뀐다. 특히 OMO 코어의 Sustainable Use License는 상업 재사용 전 다시 확인해야 한다.',
  'Relay10 0.1에는 실행 중 자동 모델 승격, 재개 지점, 장기 예약 실행, 자체 목표 명령이 없다.',
];

const comparisons = [
  {
    name: 'OMO · Oh My OpenAgent',
    strengths: '전문 역할, 모델별 배정, 검색·편집·검증·Team·복구를 포함한 배터리 포함형 기능 폭이 크다.',
    weaknesses: 'Ultimate와 Codex Light의 차이가 크고 11 agent·54+ hook·MCP·장기 loop가 상태 소유권과 진단 표면을 늘린다. telemetry와 SUL 조건도 확인해야 한다.',
    adopted: 'scout→architect→maker→reviewer→explainer 역할 분리와 역할별 모델·노력도 명시.',
    excluded: 'OMO 코드, agent 군집, Team Mode, background agent, hook·MCP·LSP·AST 묶음, telemetry, 멈추지 않는 loop.',
  },
  {
    name: 'OMP · Oh My Pi',
    strengths: '40개 이상 provider, 역할별 모델, TUI·SDK·RPC·ACP, hash-anchored edit, LSP·DAP를 갖춘 완성형 독립 runtime이다.',
    weaknesses: 'TypeScript·Rust·native addon·browser·debugger까지 유지하는 큰 제품이라 인증·보안·회귀 비용이 높다.',
    adopted: '읽기는 낮은 비용, 계획은 강한 모델처럼 역할에 따라 모델 등급을 달리하고 실행을 별도 process 경계에 두는 원칙.',
    excluded: '다중 provider runtime, TUI·SDK·RPC·ACP, native 도구, LSP·DAP, credential rotation, hash-anchored editing. Relay10 artifact hash는 편집 기능이 아니다.',
  },
  {
    name: 'OMC · Oh My ClaudeCode',
    strengths: 'plan→PRD→exec→verify→fix 단계와 전문 역할, 실패를 수정으로 돌리는 QA loop가 명시적이다.',
    weaknesses: 'Claude host 안에 Team·tmux Team·Autopilot·Ralph·UltraQA 등 여러 loop와 실행 권위가 공존한다.',
    adopted: '계획·구현·검토 단계 분리, 명령 검증과 모델 reviewer 분리, architect·reviewer read-only와 maker write 권한 분리.',
    excluded: '19 agent, native Team·tmux worker, 자동 병렬화·learned memory, 중첩 completion loop와 자동 fix 반복.',
  },
  {
    name: 'OMX · Oh My Codex',
    strengths: 'Codex 엔진을 유지하면서 durable goal, doctor, evidence, worktree 격리와 smoke test를 보강한다.',
    weaknesses: 'Codex CLI·tmux 중심이며 hook·skill·worktree·.omx 상태를 함께 배워야 한다. 앱 경로는 덜 지원된다.',
    adopted: 'doctor, 실행 전 route 미리보기, .relay10/runs의 공개 evidence, artifact hash와 frozen replay.',
    excluded: '/goal DSL, checkpoint·resume, worktree·tmux team·HUD·hook, 여러 completion loop와 광범위 자율 권한.',
  },
  {
    name: 'GJC · Gajae-Code',
    strengths: 'host를 패치하지 않는 external harness이며 공개 workflow와 기본 역할 수가 비교적 좁고 명료하다.',
    weaknesses: '겉의 명령은 작지만 TUI·Rust·Python·tmux·RPC·Telegram·notebook·computer-use를 포함한 experimental beta다.',
    adopted: 'external wrapper 경계, 작은 CLI 명령 집합, maker만 쓰기 가능하게 한 역할 권한, 근거 파일 보존.',
    excluded: '자체 TUI·native binary, tmux·worktree team, RPC·Bridge·Telegram, RLM notebook, computer-use, 다중 runtime 묶음.',
  },
  {
    name: 'LazyCodex',
    strengths: 'OMO Codex Light를 한 줄 install·doctor·uninstall 흐름으로 포장해 초기 도입이 단순하다.',
    weaknesses: '독립 엔진이 아니라 OMO 배포 layer이며 세 이름과 plugin cache·hook·config 변경, OMO SUL 조건이 함께 따라온다.',
    adopted: '짧은 quick start, 하나의 r10 진입점, 설치 직후 doctor로 상태를 확인하는 UX.',
    excluded: 'Codex plugin 주입, 전역 config 자동 변경, marketplace·startup hook, OMO submodule과 SUL 코드. 한 줄 설치·upgrade·uninstall은 아직 미구현.',
  },
];

const comparisonSummary = '여기서 체리피킹은 소스 코드 복제가 아니라 공개 문서에서 확인한 동작 패턴의 clean-room 독립 구현을 뜻한다. 국내 여섯 프로젝트에서는 역할별 모델, 단계 분리, doctor·evidence, external wrapper, 단순한 진입 UX만 골랐다. 글로벌 OpenDev·Continue의 역할별 모델 slot, Aider의 architect/editor 분리, mini-SWE-agent의 작은 코어도 참고했다. Relay10은 위험·파급·검증 가능성·되돌림 가능성 router와 correctness·clarity 분리, hash-bound Reader-10을 추가했다.';

const supportMatrix = [
  { target: 'Codex CLI + 현재 OpenAI 모델', status: 'pass', current: '지원·검증됨', reason: '모든 stage가 codex exec를 호출하고 codex debug models로 catalog를 읽는다. 현재 출시 검증 경로다.', required: '추가 작업 없음. Node 20+, 인증된 Codex CLI 필요.' },
  { target: 'Codex + xAI/Grok custom provider', status: 'warn', current: '실험 후보·미검증', reason: 'Codex custom provider와 xAI가 Responses API를 제공해 프로토콜 조건은 맞지만 Relay10 종단간 검증과 단계별 provider 선택은 없다.', required: 'user-level xAI profile, 모델 override, effort high 이하, 파일 도구·검색·schema·Reader-10 E2E 검증.' },
  { target: 'OpenAI Responses API 직접', status: 'fail', current: '미지원', reason: 'Relay10은 HTTP API client가 아니라 Codex subprocess wrapper이며 provider 설정도 없다.', required: 'catalog·executor adapter와 로컬 file/shell/search tool loop 또는 agent host.' },
  { target: 'Anthropic/Claude API 직접', status: 'fail', current: '미지원', reason: '현재 Codex custom provider는 Responses 규격에 결합되고 Claude의 공식 호환 표면은 Chat Completions이며 네이티브는 Messages API다.', required: 'Anthropic native executor 또는 Responses 변환 proxy와 tool runtime.' },
  { target: 'Google Gemini API 직접', status: 'fail', current: '미지원', reason: 'Gemini의 OpenAI 호환 표면은 Chat Completions이며 Relay10에는 Gemini catalog·executor가 없다.', required: 'Gemini native executor 또는 Responses 변환 proxy와 tool runtime.' },
  { target: '한 run의 OpenAI·Grok·Claude 혼합', status: 'fail', current: '미지원', reason: 'stage config에는 model만 있고 providerId·profile·capability negotiation이 없다.', required: 'stage별 providerId, adapter registry, effort·tool·schema capability 검사.' },
  { target: 'Codex 데스크톱·IDE', status: 'warn', current: '셸·Skill 간접 사용', reason: '앱 task가 r10을 실행할 수는 있지만 내부에서는 별도 Codex CLI subprocess를 띄운다. 현재 repo에 Skill·Plugin·MCP manifest는 없다.', required: 'v0.2 Codex Plugin + Skill + local stdio MCP. 앱 task 모델 자체의 stage 전환과는 구분.' },
  { target: 'ChatGPT 앱·웹', status: 'fail', current: '미지원', reason: 'ChatGPT App UI나 remote MCP backend가 없고 로컬 Mac repo에 직접 접근하는 구조도 아니다.', required: 'Apps SDK UI, remote MCP worker 또는 안전한 local sidecar 연결.' },
  { target: '독립 데스크톱 GUI', status: 'fail', current: '미구현', reason: '현재 package는 r10·relay10 CLI bin만 제공한다.', required: 'core 분리 뒤 Codex App Server client 또는 provider-neutral local sidecar와 Electron·Tauri·Swift UI.' },
];

const supportSummary = '현재 공식 지원은 Codex CLI뿐이다. 모델은 현재 OpenAI 경로만 실제 검증했다. Grok은 Codex의 xAI custom provider를 거치는 실험 후보이지 지원 완료가 아니며, Claude·Gemini 직접 연결과 한 run의 공급자 혼합은 미지원이다. Codex 앱은 r10을 셸 또는 Skill로 부르는 간접 사용만 가능하다. Plugin·MCP·Apps SDK·독립 GUI는 구현 가능한 다음 단계지만 v0.1.1에 들어 있지 않다. Grok 검증은 @minwoo19930301 담당의 v0.3 후보 작업이며 달력 날짜는 약속하지 않았다. 종단간 검증 전까지 계속 미지원으로 표시한다.';

const verificationChecks = [
  ...verificationLog.commands.map((command) => ({
    name: command.label,
    passed: command.passed,
    detail: `${command.commandLine}; 시작 ${command.startedAt}; 종료 코드 ${command.code}; ${command.durationMs}ms; 전체 stdout/stderr는 docs/launch-verification.json에 기록.`,
  })),
  { name: 'HTML 안전·접근성 구조', passed: true, detail: '외부 스크립트 없음, 출력 이스케이프, URL 허용목록, 콘텐츠 보안 정책, 모바일 viewport, main/h1/표 머리글 검사.' },
  { name: '현재 HTML 실제 모델 판독', status: 'warn', detail: '생성 시점에는 대기 상태다. npm run audit:launch가 완성된 HTML을 읽고 10회 결과와 이 HTML의 reportSha256을 docs/launch-reader-live.json에 기록한다. 제품 v0.1.1 공개 상태와는 별개다.' },
];

const stages = [
  {
    title: '검수 상태를 읽는 법', status: 'warn', profile: '최종 보고 게이트', model: '@minwoo19930301',
    summary: '제품 출시는 완료됐고, 완성된 이 HTML의 실제 판독은 생성 뒤 별도 파일에 기록한다.',
    output: '제품 상태: v0.1.1 공개 완료.\n자동 구조 검사: 10/10 통과. 프로그램 규칙으로 제목, 링크, 접근성만 확인하며 글의 뜻은 이해하지 못함.\n이 HTML의 실제 모델 판독: 생성 시점에는 대기. 이는 제품 출시 대기가 아님.\n판독 방식: economy 역할 모델 열 번이 목적, 결과, 근거, 위험, 다음 행동을 다시 말함.\n최종 점수 위치: docs/launch-reader-live.json과 outputs/relay10-launch-reader-live.json. passedPersonas 10, criticalCount 0, reportSha256이 이 HTML의 SHA-256과 같아야 통과함.\n치명적 구조 문제: 본문 없음, 실행 가능한 위험 링크, 활성 외부 삽입, 이미지 설명 누락처럼 읽기나 안전을 막는 문제.\n실행 위치: clone한 relay10 저장소의 최상위 폴더.\n수정, 검수 실행, 최종 확인, GitHub 게시 담당: 모두 @minwoo19930301.',
  },
  {
    title: 'OMO(Oh My OpenAgent)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 가장 넓은 기능과 큰 공개 관심 신호, 단점은 큰 운영 표면과 라이선스 제약이다.',
    output: '사실: OpenCode Ultimate와 Codex Light를 한 계열에서 제공하며 11 agents, 54+ hooks, 도구·팀·복구 기능을 묶는다. 장점: 기능 폭과 생태계 신호가 크다. 단점: 상태·hook·도구의 상호작용이 많아 작은 하네스보다 진단 비용이 높다. 주의: 코어는 MIT가 아니라 Sustainable Use License 1.0이다. Relay10은 코드를 복제하지 않은 클린룸 구현을 택했다.',
    evidence: [{ title: 'OMO 공식 README와 라이선스', url: 'https://github.com/code-yeongyu/oh-my-openagent' }],
  },
  {
    title: 'OMP(Oh My Pi)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 완성형 독립 엔진, 단점은 경량 라우터보다 훨씬 큰 구현·배포 범위다.',
    output: '사실: 자체 터미널 화면, 언어 서버, 디버거, 실행 환경, 하위 에이전트, 검색과 여러 공급자를 포함한 독립 코딩 에이전트다. 장점: 호스트 플러그인 한계를 벗어난 깊은 도구 통합과 MIT 라이선스. 단점: TypeScript·Rust·Python과 네이티브 기능을 함께 품어 단순한 Codex 래퍼의 기준에는 무겁다.',
    evidence: [{ title: 'OMP 공식 README', url: 'https://github.com/can1357/oh-my-pi' }],
  },
  {
    title: 'OMC(Oh My ClaudeCode)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 단계형 팀 실행, 단점은 여러 반복 실행 모드와 Claude Code 중심 경계다.',
    output: '사실: Claude Code 플러그인과 명령줄 도구로 계획·요구사항·실행·검증·수정 흐름과 전문 역할을 제공한다. 장점: staged team workflow가 명시적이다. 단점: Team, Autopilot, Ralph, UltraQA, tmux worker처럼 실행 권위가 여러 곳에 생길 수 있어 상태 소유권을 관리해야 한다.',
    evidence: [{ title: 'OMC 공식 README', url: 'https://github.com/Yeachan-Heo/oh-my-claudecode' }],
  },
  {
    title: 'OMX(Oh My Codex)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 Codex 위 durable goal·worktree 흐름, 단점은 설정·tmux·상태 학습면이다.',
    output: '사실: Codex 위에 deep-interview, ralplan, ultragoal, /goal, 격리 Git 작업공간과 터미널 세션 도구를 얹는다. 장점: 목표·근거·격리 작업공간을 오래 유지하는 운영 흐름. 단점: 설치 범위, 자동 연결 동작, 터미널 세션, 격리 작업공간, .omx 상태를 이해해야 한다. README는 MIT를 말하지만 조사 시점 root 표준 LICENSE 파일은 비어 있어 재사용 전 재확인이 필요하다.',
    evidence: [{ title: 'OMX 공식 README', url: 'https://github.com/Yeachan-Heo/oh-my-codex' }],
  },
  {
    title: 'GJC(Gajae-Code)', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 좁은 공개 workflow, 단점은 내부 구현과 실험 기능이 여전히 크다는 점이다.',
    output: '사실: 독립 외부 실행 도구이며 deep-interview, ralplan, ultragoal, 선택적 team과 네 기본 역할을 앞세운다. 장점: 사용자에게 보이는 기본 방법이 비교적 작고 MIT다. 단점: 내부에는 TypeScript·Rust·Python, 터미널 화면, 터미널 세션, 원격 통신, Telegram, notebook research가 있어 배포물은 가볍지 않으며 스스로 experimental beta라고 밝힌다.',
    evidence: [{ title: 'GJC 공식 README와 NOTICE', url: 'https://github.com/Yeachan-Heo/gajae-code' }],
  },
  {
    title: 'LazyCodex', status: 'pass', profile: '국내 비교', model: '공식 저장소',
    summary: '장점은 한 줄 설치, 단점은 독립 엔진이 아니라 OMO Codex Light 배포층이라는 점이다.',
    output: '사실: OMO의 Codex Light를 설치·문서·marketplace로 배포하는 레이어이며 core를 submodule로 포함한다. 장점: 도입과 doctor 경험이 단순하다. 단점: LazyCodex, OMO, marketplace 이름이 동시에 노출되고 wrapper의 MIT가 OMO core의 Sustainable Use License를 덮지 않는다. OMO와 별도 엔진처럼 중복 집계하면 안 된다.',
    evidence: [{ title: 'LazyCodex 공식 README와 submodule', url: 'https://github.com/code-yeongyu/lazycodex' }],
  },
  {
    title: '글로벌 공개 프로젝트 지형', status: 'pass', profile: '해외 조사', model: '공식 문서',
    summary: '해외에도 단일 표준은 없으며, multi-CLI runner·workflow pack·독립 runtime·조직형 비동기 플랫폼으로 갈린다.',
    output: '확인된 선행 사례: OpenDev는 Normal·Thinking·Compact·Self-Critique·vision 역할별 모델 슬롯을 둔다. Continue는 chat·autocomplete·edit·apply·embed·rerank 역할을 나눈다. Aider는 Architect가 해결 방향을 만들고 Editor가 실제 편집을 만든다. Claude Squad와 Agent Orchestrator는 worktree에서 기존 CLI를 병렬 운영한다. mini software-engineering agent는 최소 코어 기준선이고 OpenHands·Open software-engineering agent·Ruflo는 더 큰 플랫폼 축이다. 공개 별은 발견 신호일 뿐 실제 해외 사용 점유율의 증거가 아니다.',
    evidence: [
      { title: 'OpenDev 공식 저장소', url: 'https://github.com/opendev-to/opendev' },
      { title: 'Aider Architect와 Editor 문서', url: 'https://aider.chat/2024/09/26/architect.html' },
      { title: 'Continue 모델 역할 문서', url: 'https://docs.continue.dev/customize/model-roles' },
    ],
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
    title: '출시·운영 안내', status: 'pass', profile: '공개 릴리스', model: '@minwoo19930301',
    summary: 'v0.1.1은 공개됐고 v0.1.0의 예제 설정 누락을 바로잡은 현재 배포본이다.',
    output: `현재 상태: 저장소 공개 완료. v0.1.0은 예제 설정 누락 때문에 대체됨. v0.1.1은 2026-07-13T05:15:21Z에 공개됨.\n저장소: ${repository}\n공개 릴리스: ${releaseTarget}\n로컬 설치: git clone ${repository}.git && cd relay10 && npm link\n검증: npm test && npm run lint && r10 doctor\n모델 배정 확인: r10 route "research and build a small CLI" --json\n실행 전 미리보기: r10 run "your task" --dry-run\n실제 독자 검수 기록: docs/launch-reader-live.json 및 outputs/relay10-launch-reader-live.json. reportSha256으로 검수 대상 HTML과 연결함.\n수정·검수 실행·최종 확인·GitHub 게시 담당: @minwoo19930301. 0.1 평가 제안은 읽기 10건, 구현 10건, 고위험 미리보기 10건에서 기대 모델 배정과 실패 상태를 기록하는 것이다. 완료 기준은 30건 전체에 기대 배정 라벨, 허위 통과 0건, 치명적 독자 문제 0건이다. 비교 코드 재사용이나 OMO 계열 상업 사용이 생기면 별도 라이선스 검토를 연다.`,
  },
];

const nextSteps = [
  `설치: git clone ${repository}.git && cd relay10 && npm link`,
  '검증: npm test && npm run lint && r10 doctor',
  '안전한 첫 확인: r10 route "research and build a small CLI" --json 후 --dry-run 옵션으로 실제 변경 없이 계획만 확인한다.',
  '담당자 @minwoo19930301이 clone한 relay10 저장소의 최상위 폴더에서 npm run audit:launch를 실행해 이 HTML을 10회 판독한다. 10/10 미만 또는 치명적 구조 문제 1개 이상이면 최종 보고를 통과 처리하지 않는다.',
  '실패하면 outputs/relay10-launch-reader-live.json의 “막힌 모호점” 목록을 고치고 HTML을 다시 생성한 뒤 10회 전체를 재실행한다.',
  '공개 상태 확인: gh repo view minwoo19930301/relay10 및 gh release view v0.1.1 --repo minwoo19930301/relay10. 릴리스 주소는 이미 공개됐으며 결과 파일은 reportSha256으로 현재 HTML과 일치 여부를 확인한다.',
  '30개 라우팅 평가 세트를 @minwoo19930301이 관리한다. 실측 전에는 비용·속도·품질 우월성을 광고하지 않는다.',
  'v0.2: Codex Plugin + Skill + local MCP wrapper로 route, run, status, inspect, report를 Codex 앱·CLI·IDE에 노출한다. Skill만으로 현재 앱 task의 모델이 바뀐다고 표현하지 않는다.',
  'v0.3 후보(@minwoo19930301 담당, 달력 날짜 미정): CatalogAdapter와 ExecutorAdapter를 분리하고 stage별 providerId·model·effort·capability를 검증한다. xAI/Grok 종단간 테스트를 통과한 뒤에만 Grok 지원으로 표시한다.',
  'v0.4: ChatGPT용 Apps SDK UI와 remote worker 또는 독립 GUI용 local sidecar를 추가한다. Claude·Gemini는 native adapter나 검증된 Responses proxy가 생기기 전까지 미지원으로 둔다.',
];

const base = {
  title: 'Relay10 0.1 출시 결과 보고서',
  heroSummary: 'Relay10은 여섯 국내 하네스와 해외 선행 패턴에서 역할별 모델·단계 분리·doctor·근거 보존만 골라 독립 구현했다. v0.1.1의 공식 지원은 Codex CLI뿐이며, Grok은 미검증 실험 후보, Claude·Gemini·앱 네이티브 통합은 미지원이다.',
  task,
  summary,
  runId: 'relay10-launch-20260713',
  generatedAt: new Date().toISOString(),
  status: 'warn',
  routing: {
    decisions: [
      { stage: '자료 읽기·검색', profile: 'economy', effort: 'low', model: '현재 로컬: gpt-5.6-luna', enabled: true, reason: '되돌릴 수 있고 구조 검증이 쉬운 수집' },
      { stage: '분석·계획', profile: 'frontier', effort: 'max', model: '현재 로컬: gpt-5.6-sol', enabled: true, reason: '판단 오류의 파급이 큰 단계' },
      { stage: '구현', profile: 'balanced', effort: 'medium', model: '현재 로컬: gpt-5.6-terra', enabled: true, reason: '계획과 테스트가 구현 범위를 제약' },
      { stage: '정확성 검토', profile: 'frontier', effort: 'high', model: '현재 로컬: gpt-5.6-sol', enabled: true, reason: '이해도 검수 전에 사실·안전 문제 확인' },
      { stage: '쉬운 설명', profile: 'balanced', effort: 'low', model: '현재 로컬: gpt-5.6-terra', enabled: true, reason: '검증 기록을 짧은 문장으로 변환' },
      { stage: 'Reader-10', profile: 'economy', effort: 'low', model: '현재 로컬: gpt-5.6-luna', enabled: false, reason: 'HTML 생성 단계에서는 건너뛰고, 완성 뒤 audit:launch가 10회 호출' },
    ],
  },
  comparisons,
  comparisonSummary,
  supportMatrix,
  supportSummary,
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
}, { minPass: 10 });
if (!payloadGate.passed) {
  const failed = payloadGate.personas
    .filter((persona) => !persona.passed)
    .map((persona) => ({ id: persona.id, recommendations: persona.recommendations }));
  throw new Error(`Launch payload failed structural Reader-10: ${JSON.stringify({ critical: payloadGate.criticalIssues, failed })}`);
}

const final = generateReport({
  ...base,
  reader10: {
    version: 1,
    mode: 'pending-live',
    status: 'warn',
    semanticVerified: false,
    passedPersonas: 0,
    totalPersonas: 10,
    minPass: 10,
    criticalCount: 0,
    personas: [],
  },
});
const renderAudit = evaluateReader10(final, { minPass: 10 });
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
