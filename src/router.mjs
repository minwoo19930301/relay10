const DIMENSIONS = Object.freeze([
  "complexity",
  "risk",
  "blastRadius",
  "verifiability",
  "reversibility",
]);

const ADVISOR_MODES = Object.freeze(["conditional", "always", "never"]);

const PATTERNS = Object.freeze({
  complex: /architect|architecture|distributed|concurren|multi[- ]?(service|repo|step)|refactor|redesign|migration|migrate|아키텍처|동시성|분산|멀티|리팩터|마이그레이션/i,
  veryComplex: /rewrite|platform|framework|protocol|compiler|operating system|대규모|전면 개편|플랫폼|프레임워크|프로토콜/i,
  security: /security|secure|auth|oauth|permission|credential|secret|encrypt|vulnerab|exploit|보안|인증|권한|자격 증명|시크릿|암호화|취약점/i,
  deploy: /deploy|deployment|production|prod\b|release|publish|ship|rollout|배포|운영 환경|프로덕션|릴리스|출시/i,
  destructive: /delete|destroy|drop\b|truncate|purge|wipe|erase|hard reset|overwrite|삭제|파기|드롭|초기화|덮어쓰기|제거/i,
  financial: /payment|billing|invoice|bank|money|financial|결제|청구|금융|송금/i,
  broad: /global|repo[- ]?wide|all (files|users|services)|everywhere|cross[- ]?(repo|service)|organization|전역|전체 파일|모든 사용자|전사|리포 전체/i,
  database: /database|schema|sql|migration|data store|데이터베이스|스키마|마이그레이션/i,
  testable: /test|tests|spec|lint|typecheck|compile|build|assert|테스트|검증|린트|타입체크|컴파일|빌드/i,
  subjective: /design|visual|copy|wording|tone|report|explain|ux|ui\b|디자인|시각|문구|톤|보고서|설명|사용성/i,
  readOnly: /\b(read|inspect|analy[sz]e|research|review|summari[sz]e|explain|find|list|show)\b|읽|살펴|분석|조사|검토|요약|설명|찾|목록|보여/i,
  mutation: /\b(write|edit|change|modify|implement|fix|create|add|remove|build|deploy|delete|refactor|migrate)\b|작성|편집|변경|수정|구현|고치|생성|추가|제거|빌드|배포|삭제|리팩터|마이그레이션/i,
});

function clampDimension(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 3) {
    throw new RangeError(`${name} must be an integer from 0 to 3`);
  }
  return number;
}

function taskText(task) {
  if (typeof task === "string") return task.trim();
  if (task && typeof task === "object") {
    return String(task.description ?? task.task ?? task.title ?? "").trim();
  }
  throw new TypeError("task must be a string or an object with description/task/title");
}

function dimensionOverrides(task, options) {
  const taskValues = task && typeof task === "object" ? task : {};
  const configured = options.dimensions ?? {};
  return Object.fromEntries(DIMENSIONS.flatMap((name) => {
    const value = configured[name] ?? options[name] ?? taskValues[name];
    return value === undefined ? [] : [[name, clampDimension(value, name)]];
  }));
}

function assessHeuristically(text, options) {
  const words = text.split(/\s+/u).filter(Boolean).length;
  const files = Array.isArray(options.files) ? options.files.length : Number(options.fileCount ?? 0);
  const readOnly = options.readOnly ?? (PATTERNS.readOnly.test(text) && !PATTERNS.mutation.test(text));

  let complexity = words > 80 ? 2 : words > 25 ? 1 : 0;
  if (PATTERNS.complex.test(text)) complexity = Math.max(complexity, 2);
  if (PATTERNS.veryComplex.test(text) || files > 20) complexity = 3;
  else if (files > 5) complexity = Math.max(complexity, 2);
  else if (files > 1) complexity = Math.max(complexity, 1);

  let risk = readOnly ? 0 : 1;
  if (PATTERNS.security.test(text) || PATTERNS.database.test(text)) risk = Math.max(risk, 2);
  if (PATTERNS.deploy.test(text) || PATTERNS.destructive.test(text) || PATTERNS.financial.test(text)) risk = 3;

  let blastRadius = readOnly ? 0 : files > 20 ? 3 : files > 5 ? 2 : files > 1 ? 1 : 0;
  if (PATTERNS.database.test(text)) blastRadius = Math.max(blastRadius, 2);
  if (PATTERNS.broad.test(text)) blastRadius = 3;
  if (PATTERNS.deploy.test(text) || PATTERNS.destructive.test(text)) blastRadius = Math.max(blastRadius, 2);

  let verifiability = PATTERNS.testable.test(text) || options.hasTests ? 3 : 2;
  if (PATTERNS.subjective.test(text)) verifiability = Math.min(verifiability, 1);
  if (options.hasTests === false) verifiability = Math.min(verifiability, 1);
  if (readOnly && !PATTERNS.subjective.test(text)) verifiability = 3;

  let reversibility = readOnly ? 3 : 2;
  if (options.versionControlled !== false && !PATTERNS.deploy.test(text)) reversibility = 3;
  if (PATTERNS.deploy.test(text) || PATTERNS.database.test(text)) reversibility = Math.min(reversibility, 1);
  if (PATTERNS.destructive.test(text)) reversibility = 0;

  return {
    dimensions: { complexity, risk, blastRadius, verifiability, reversibility },
    readOnly,
  };
}

export function assessTask(task, options = {}) {
  const text = taskText(task);
  if (!text) throw new TypeError("task description cannot be empty");
  const heuristic = assessHeuristically(text, options);
  const dimensions = {
    ...heuristic.dimensions,
    ...dimensionOverrides(task, options),
  };
  const score = dimensions.complexity * 2
    + dimensions.risk * 3
    + dimensions.blastRadius * 2
    + (3 - dimensions.verifiability)
    + (3 - dimensions.reversibility) * 2;

  const balancedThreshold = Number(options.balancedThreshold ?? 7);
  const frontierThreshold = Number(options.frontierThreshold ?? 15);
  const role = dimensions.risk === 3
    || dimensions.blastRadius === 3
    || dimensions.reversibility === 0
    || score >= frontierThreshold
    ? "frontier"
    : score >= balancedThreshold
      ? "balanced"
      : "economy";

  return {
    task: text,
    ...dimensions,
    score,
    role,
    readOnly: heuristic.readOnly,
  };
}

function contract(id, purpose, modelRole, effort, mode, extra = {}) {
  return {
    id,
    purpose,
    modelRole,
    effort,
    mode,
    ...extra,
  };
}

function advisorActivation(assessment, requestedMode) {
  const advisorMode = requestedMode ?? "conditional";
  if (!ADVISOR_MODES.includes(advisorMode)) {
    throw new RangeError(`advisorMode must be one of: ${ADVISOR_MODES.join(", ")}`);
  }
  if (advisorMode === "never") return { advisorMode, activation: "never" };
  if (advisorMode === "always") return { advisorMode, activation: "always" };
  return {
    advisorMode,
    activation: assessment.role === "economy" ? "conditional" : "always",
  };
}

export function routeTask(task, options = {}) {
  const assessment = assessTask(task, options);
  const advisor = advisorActivation(assessment, options.advisorMode);
  const reportEnabled = options.report !== false;
  const jurySize = clampPositiveInteger(options.jurySize ?? 10, "jurySize");
  const quorum = clampPositiveInteger(options.quorum ?? Math.ceil(jurySize * 0.9), "quorum");
  if (quorum > jurySize) throw new RangeError("quorum cannot exceed jurySize");

  const reviewerEffort = assessment.role === "frontier" ? "max" : "high";
  const makerEffort = assessment.risk >= 2 ? "high" : "medium";

  const stages = [
    contract("scout", "Gather evidence and read source material.", "economy", "low", "read", {
      enabled: true,
      writes: false,
      output: "evidence",
    }),
    contract("architect", "Advise on non-obvious scope, risk, and direction after evidence gathering.", "frontier", "max", "plan", {
      enabled: advisor.activation !== "never",
      writes: false,
      output: "plan",
      activation: advisor.activation,
      checkpoint: "after-scout",
      decision: advisor.activation === "always" ? "invoke" : advisor.activation === "never" ? "skip" : "pending",
      reasonCode: advisor.activation === "always"
        ? (advisor.advisorMode === "always" ? "policy-always" : "assessment-non-economy")
        : advisor.activation === "never" ? "policy-never" : "await-scout-evidence",
    }),
    contract("maker", "Implement the approved plan in the isolated workspace.", "balanced", makerEffort, "write", {
      enabled: !assessment.readOnly,
      writes: true,
      output: "changes",
    }),
    contract("reviewer", "Verify correctness, safety, and acceptance criteria.", "frontier", reviewerEffort, "verify", {
      enabled: true,
      writes: false,
      output: "review",
    }),
    contract("explainer", "Create the final human-facing HTML explanation.", "balanced", "low", "report", {
      enabled: reportEnabled,
      writes: true,
      output: "html",
    }),
    contract("reader", "Judge whether the report is understandable without hidden context.", "economy", "low", "read", {
      enabled: reportEnabled,
      writes: false,
      fanout: jurySize,
      quorum,
      maxRounds: clampPositiveInteger(options.maxRounds ?? 2, "maxRounds"),
      output: "clarity-verdicts",
    }),
  ];

  return {
    assessment,
    policy: { version: 1, advisorMode: advisor.advisorMode },
    stages,
    byId: Object.fromEntries(stages.map((stage) => [stage.id, stage])),
  };
}

function clampPositiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new RangeError(`${name} must be a positive integer`);
  }
  return number;
}
