import assert from "node:assert/strict";
import test from "node:test";

import { assessTask, routeTask } from "../src/router.mjs";

test("simple read-only work stays economy and disables mutation stages", () => {
  const route = routeTask("Read package.json and summarize the scripts.");
  assert.equal(route.assessment.role, "economy");
  assert.equal(route.assessment.readOnly, true);
  assert.equal(route.byId.scout.modelRole, "economy");
  assert.equal(route.byId.architect.modelRole, "frontier");
  assert.equal(route.byId.architect.effort, "max");
  assert.equal(route.byId.maker.enabled, false);
  assert.equal(route.byId.reviewer.enabled, true);
});

test("security, deployment, and deletion language deterministically escalates risk", () => {
  const security = assessTask("Implement OAuth credential rotation and permission checks.");
  assert.equal(security.risk, 2);
  assert.equal(security.role, "balanced");

  const deploy = assessTask("Deploy the database schema migration to production.");
  assert.equal(deploy.risk, 3);
  assert.equal(deploy.blastRadius, 2);
  assert.equal(deploy.reversibility, 1);
  assert.equal(deploy.role, "frontier");

  const deletion = assessTask("운영 데이터베이스의 모든 사용자 데이터를 삭제해줘.");
  assert.equal(deletion.risk, 3);
  assert.equal(deletion.blastRadius, 3);
  assert.equal(deletion.reversibility, 0);
  assert.equal(deletion.role, "frontier");
});

test("explicit dimensions override heuristics and are validated", () => {
  const assessment = assessTask("Delete production data", {
    dimensions: {
      complexity: 0,
      risk: 0,
      blastRadius: 0,
      verifiability: 3,
      reversibility: 3,
    },
  });
  assert.equal(assessment.score, 0);
  assert.equal(assessment.role, "economy");
  assert.throws(() => assessTask("Task", { risk: 4 }), /risk must be an integer from 0 to 3/);
});

test("routeTask emits all six stage contracts and a 10-reader clarity jury", () => {
  const route = routeTask("Refactor authentication across multiple services and add tests.");
  assert.deepEqual(route.stages.map((stage) => stage.id), [
    "scout",
    "architect",
    "maker",
    "reviewer",
    "explainer",
    "reader",
  ]);
  assert.equal(route.byId.maker.modelRole, "balanced");
  assert.equal(route.byId.reviewer.modelRole, "frontier");
  assert.equal(route.byId.reader.modelRole, "economy");
  assert.equal(route.byId.reader.fanout, 10);
  assert.equal(route.byId.reader.quorum, 9);
  assert.equal(route.byId.reader.maxRounds, 2);
});

test("report and jury options adjust reader contracts without changing assessment", () => {
  const noReport = routeTask("Implement a small helper", { report: false });
  assert.equal(noReport.byId.explainer.enabled, false);
  assert.equal(noReport.byId.reader.enabled, false);

  const custom = routeTask("Implement a small helper", { jurySize: 5, quorum: 4, maxRounds: 1 });
  assert.equal(custom.byId.reader.fanout, 5);
  assert.equal(custom.byId.reader.quorum, 4);
  assert.equal(custom.byId.reader.maxRounds, 1);
  assert.throws(() => routeTask("Task", { jurySize: 2, quorum: 3 }), /quorum cannot exceed jurySize/);
});
