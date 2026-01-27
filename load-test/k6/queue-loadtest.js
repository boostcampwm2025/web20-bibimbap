import http from "k6/http";
import { check, sleep } from "k6";
import exec from "k6/execution";
import { Counter, Rate, Trend } from "k6/metrics";
import { randomSeed } from "k6";
import { SharedArray } from "k6/data";

/**
 * =========================
 * Config
 * =========================
 */
const BASE_URL = (__ENV.BASE_URL || "http://localhost/api").replace(/\/$/, "");
const EVENT_ID = Number(__ENV.EVENT_ID || 5);

const USERS_FILE = __ENV.USERS_FILE || "./data/users.json";
const SCENARIOS = (__ENV.SCENARIOS || "functional")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const HTTP_TIMEOUT = __ENV.HTTP_TIMEOUT || "10s";

// polling (기본 5초, ±2.5초 지터)
const POLL_BASE_MS = Number(__ENV.POLL_BASE_MS || 5000);
const POLL_JITTER_MS = Number(__ENV.POLL_JITTER_MS || 2500);

const MAX_STATUS_POLLS = Number(__ENV.MAX_STATUS_POLLS || 120);

// 재진입 테스트는 functional/smoke 에서만 (기본 true)
const REENTER_ENABLED =
  (__ENV.REENTER_ENABLED || "true").toLowerCase() === "true";
const REENTER_PROB = Number(__ENV.REENTER_PROB || 0.5);
const REENTER_DELAY_MS = Number(__ENV.REENTER_DELAY_MS || 200);

const ENTER_PATH = `/queue/${EVENT_ID}/enter`;
const STATUS_PATH = `/queue/${EVENT_ID}/status`;

const FUNCTIONAL_VUS = Number(__ENV.FUNCTIONAL_VUS || 10);
const FUNCTIONAL_ITERATIONS = Number(__ENV.FUNCTIONAL_ITERATIONS || 30);
const FUNCTIONAL_MAX_DURATION = __ENV.FUNCTIONAL_MAX_DURATION || "10m";

const SMOKE_VUS = Number(__ENV.SMOKE_VUS || 5);
const SMOKE_DURATION = __ENV.SMOKE_DURATION || "20s";

const SOAK_VUS = Number(__ENV.SOAK_VUS || 50);
const SOAK_DURATION = __ENV.SOAK_DURATION || "10m";

/**
 * =========================
 * Users
 * =========================
 */
const users = new SharedArray("users", () => JSON.parse(open(USERS_FILE)));
if (!Array.isArray(users) || users.length === 0) {
  throw new Error(`USERS_FILE(${USERS_FILE})에 사용자 데이터가 없습니다.`);
}

/**
 * =========================
 * Options
 * =========================
 */
function parseStages(value, fallback) {
  const raw = String(value ?? fallback ?? "").trim();
  if (!raw) return [];

  return raw.split(",").map((part) => {
    const [duration, targetRaw] = part.split(":").map((s) => s.trim());
    const target = Number(targetRaw);

    if (!duration || !Number.isFinite(target)) {
      throw new Error(`Invalid stage "${part}". Use "30s:50,1m:200" format.`);
    }

    return { duration, target };
  });
}

const LOAD_STAGES = parseStages(
  __ENV.LOAD_STAGES,
  "30s:50,1m:200,2m:200,30s:0",
);
const STRESS_STAGES = parseStages(
  __ENV.STRESS_STAGES,
  "30s:200,1m:800,2m:800,30s:0",
);
const SPIKE_STAGES = parseStages(
  __ENV.SPIKE_STAGES,
  "10s:0,5s:800,30s:800,20s:0",
);

export const options = {
  discardResponseBodies: false,
  scenarios: (() => {
    const defs = {
      functional: {
        executor: "shared-iterations",
        vus: FUNCTIONAL_VUS,
        iterations: FUNCTIONAL_ITERATIONS,
        maxDuration: FUNCTIONAL_MAX_DURATION,
        exec: "queue_flow",
        tags: { scenario: "functional" },
      },
      smoke: {
        executor: "constant-vus",
        vus: SMOKE_VUS,
        duration: SMOKE_DURATION,
        exec: "queue_flow",
        tags: { scenario: "smoke" },
      },
      load: {
        executor: "ramping-vus",
        startVUs: 0,
        stages: LOAD_STAGES,
        exec: "queue_flow",
        tags: { scenario: "load" },
      },
      stress: {
        executor: "ramping-vus",
        startVUs: 0,
        stages: STRESS_STAGES,
        exec: "queue_flow",
        tags: { scenario: "stress" },
      },
      spike: {
        executor: "ramping-vus",
        startVUs: 0,
        stages: SPIKE_STAGES,
        exec: "queue_flow",
        tags: { scenario: "spike" },
      },
      soak: {
        executor: "constant-vus",
        vus: SOAK_VUS,
        duration: SOAK_DURATION,
        exec: "queue_flow",
        tags: { scenario: "soak" },
      },
    };

    const selected = {};
    for (const name of SCENARIOS) {
      if (!defs[name]) throw new Error(`Unknown scenario: ${name}`);
      selected[name] = defs[name];
    }
    if (Object.keys(selected).length === 0) {
      throw new Error("SCENARIOS가 비어 있습니다.");
    }

    return selected;
  })(),

  thresholds: {
    http_req_failed: ["rate<0.02"], // 전체 HTTP 실패율 2% 미만
    http_req_duration: ["p(95)<1000"], // p95 1초 미만 (전체 요청 기준)

    queue_enter_failures: ["rate<0.05"], // enter 실패율 5% 미만
    queue_status_failures: ["rate<0.05"], // status 실패율 5% 미만
    queue_token_timeouts: ["rate<0.1"], // 토큰 못받고 종료 10% 미만
    queue_position_regressions: ["rate<0.01"], // 순번이 뒤로 가는 경우 1% 미만
  },
};

/**
 * =========================
 * Metrics
 * =========================
 */
const enterFailures = new Rate("queue_enter_failures");
const statusFailures = new Rate("queue_status_failures");
const tokenTimeouts = new Rate("queue_token_timeouts");
const positionRegressRate = new Rate("queue_position_regressions");

const tokensIssued = new Counter("queue_tokens_issued");

const enterLatency = new Trend("queue_enter_ms", true);
const statusLatency = new Trend("queue_status_ms", true);
const timeToToken = new Trend("queue_wait_ms", true);

/**
 * =========================
 * Helpers
 * =========================
 */
function pickUser() {
  // __VU는 1부터 시작
  return users[(__VU - 1) % users.length];
}

function userCookie(user) {
  if (user.cookie) return user.cookie;
  if (user.token) return `access_token=${user.token}`;
  return "";
}

function safeJson(res) {
  try {
    return res.json();
  } catch {
    return null;
  }
}

function httpParams(cookie, extraTags = {}) {
  const tags = { scenario: exec.scenario.name, ...extraTags };
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.Cookie = cookie;

  return {
    timeout: HTTP_TIMEOUT,
    headers,
    tags,
  };
}

// 대기 시간: base + jitter로 동시 요청 분산
function sleepPoll() {
  const base = Number.isFinite(POLL_BASE_MS) ? POLL_BASE_MS : 0;
  const jitterRange = Number.isFinite(POLL_JITTER_MS) ? POLL_JITTER_MS : 0;
  const jitter = (Math.random() * 2 - 1) * jitterRange;
  const ms = Math.max(250, base + jitter);
  sleep(ms / 1000);
}

function shouldReenter() {
  const name = exec.scenario.name;
  if (!REENTER_ENABLED) return false;
  if (name !== "functional" && name !== "smoke") return false;
  return Math.random() < REENTER_PROB;
}

function reenterCheck(cookie, initialPosition) {
  sleep(REENTER_DELAY_MS / 1000);

  const reRes = http.post(
    `${BASE_URL}${ENTER_PATH}`,
    null,
    httpParams(cookie, { name: "queue_reenter", endpoint: "enter" }),
  );
  const reBody = safeJson(reRes);

  check(reRes, {
    "reenter: status 200/201": (r) => r.status === 200 || r.status === 201,
    "reenter: success true (if exists)": () =>
      reBody?.success === undefined ? true : reBody?.success === true,
    "reenter: isNew false (if exists)": () =>
      reBody?.data?.isNew === undefined ? true : reBody?.data?.isNew === false,
    "reenter: position stable (if exists)": () => {
      if (!Number.isFinite(initialPosition)) return true;
      const pos = Number(reBody?.data?.position);
      return Number.isFinite(pos) ? pos === initialPosition : true;
    },
  });
}

function parseStatus(body) {
  const data = body?.data ?? body?.result ?? body;

  const hasToken =
    data?.hasToken === true ||
    data?.tokenIssued === true ||
    typeof data?.token === "string";

  const pos = Number(data?.position);
  const rank = Number(data?.rank);

  return {
    hasToken,
    position: Number.isFinite(pos) ? pos : undefined,
    rank: Number.isFinite(rank) ? rank : undefined,
    raw: data,
  };
}

function positionBucket(position) {
  if (position === undefined || position === null) return "none";
  if (position < 10) return "0-9";
  if (position < 50) return "10-49";
  if (position < 100) return "50-99";
  if (position < 200) return "100-199";
  if (position < 500) return "200-499";
  return "500+";
}

/**
 * =========================
 * 메인 scenario: queue_flow
 * enter -> (optional reenter) -> poll status -> token
 * =========================
 */
export function queue_flow() {
  randomSeed(__VU * 100000 + __ITER);

  const user = pickUser();
  const cookie = userCookie(user);

  // 1) enter
  const enterParams = httpParams(cookie, {
    name: "queue_enter",
    endpoint: "enter",
  });
  const enterRes = http.post(`${BASE_URL}${ENTER_PATH}`, null, enterParams);
  enterLatency.add(enterRes.timings.duration, enterParams.tags);

  const enterBody = safeJson(enterRes);
  const enterOk = check(enterRes, {
    "enter: status 200/201": (r) => r.status === 200 || r.status === 201,
    "enter: success true (if exists)": () =>
      enterBody?.success === undefined ? true : enterBody?.success === true,
  });
  enterFailures.add(!enterOk, enterParams.tags);

  if (!enterOk) {
    sleep(0.5);
    return;
  }

  const enterAt = Date.now();
  const enterPosition = Number.isFinite(Number(enterBody?.data?.position))
    ? Number(enterBody?.data?.position)
    : undefined;

  if (shouldReenter()) {
    reenterCheck(cookie, enterPosition);
  }

  // 2) poll until token
  let polls = 0;
  let lastPos = undefined;
  let firstPosition = enterPosition;
  let timedOut = true;

  while (MAX_STATUS_POLLS <= 0 || polls < MAX_STATUS_POLLS) {
    const statusParams = httpParams(cookie, {
      name: "queue_status",
      endpoint: "status",
    });
    const statusRes = http.get(`${BASE_URL}${STATUS_PATH}`, statusParams);
    statusLatency.add(statusRes.timings.duration, statusParams.tags);

    const statusBody = safeJson(statusRes);
    const statusOk = check(statusRes, {
      "status: status 200": (r) => r.status === 200,
      "status: success true (if exists)": () =>
        statusBody?.success === undefined ? true : statusBody?.success === true,
    });
    statusFailures.add(!statusOk, statusParams.tags);

    if (statusOk && statusBody) {
      const parsed = parseStatus(statusBody);

      const currentPosition =
        typeof parsed.position === "number"
          ? parsed.position
          : typeof parsed.rank === "number"
            ? parsed.rank
            : undefined;

      if (firstPosition === undefined && typeof currentPosition === "number") {
        firstPosition = currentPosition;
      }

      // position/rank가 뒤로 밀리면 기록
      if (typeof currentPosition === "number") {
        if (typeof lastPos === "number" && currentPosition > lastPos) {
          positionRegressRate.add(true, statusParams.tags);
        } else {
          positionRegressRate.add(false, statusParams.tags);
        }
        lastPos = currentPosition;
      }

      if (parsed.hasToken) {
        timedOut = false;
        tokensIssued.add(1);

        timeToToken.add(Date.now() - enterAt, {
          scenario: exec.scenario.name,
          pos_bucket: positionBucket(firstPosition),
        });
        break;
      }
    }

    polls += 1;
    sleepPoll();
  }

  tokenTimeouts.add(timedOut, { scenario: exec.scenario.name });
}
