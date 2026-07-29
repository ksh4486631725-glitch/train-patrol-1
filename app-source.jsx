import React, { useState, useEffect, useRef, useCallback } from "react";

function Icon({ children, size = 18, color = "currentColor", style }) {
  return React.createElement("svg",
    { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", style },
    children);
}
const Settings = (p) => React.createElement(Icon, p, React.createElement("circle", { cx: 12, cy: 12, r: 3 }), React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" }));
const X = (p) => React.createElement(Icon, p, React.createElement("line", { x1: 18, y1: 6, x2: 6, y2: 18 }), React.createElement("line", { x1: 6, y1: 6, x2: 18, y2: 18 }));
const Check = (p) => React.createElement(Icon, p, React.createElement("polyline", { points: "20 6 9 17 4 12" }));
const Square = (p) => React.createElement(Icon, p, React.createElement("rect", { x: 5, y: 5, width: 14, height: 14, rx: 2 }));
const ArrowLeft = (p) => React.createElement(Icon, p, React.createElement("line", { x1: 19, y1: 12, x2: 5, y2: 12 }), React.createElement("polyline", { points: "12 19 5 12 12 5" }));
const RefreshCw = (p) => React.createElement(Icon, p, React.createElement("polyline", { points: "23 4 23 10 17 10" }), React.createElement("polyline", { points: "1 20 1 14 7 14" }), React.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }));
const Copy = (p) => React.createElement(Icon, p, React.createElement("rect", { x: 9, y: 9, width: 13, height: 13, rx: 2 }), React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));

window.storage = {
  async get(key, shared) {
    try { const raw = window.localStorage.getItem("kr_patrol:" + key); if (raw === null) return null; return { key, value: raw, shared: !!shared }; } catch (e) { return null; }
  },
  async set(key, value, shared) {
    try { window.localStorage.setItem("kr_patrol:" + key, value); return { key, value, shared: !!shared }; } catch (e) { return null; }
  },
  async delete(key, shared) {
    try { window.localStorage.removeItem("kr_patrol:" + key); return { key, deleted: true, shared: !!shared }; } catch (e) { return null; }
  },
};


// ---------- Defaults ----------
const DEFAULT_SECTIONS = [
  { id: "s01", name: "조차장구내", min: 1, max: 15 },
  { id: "s02", name: "조차장~서대전", min: 1, max: 60 },
  { id: "s03", name: "서대전구내", min: 1, max: 13 },
  {
    id: "s04",
    name: "서대전~가수원",
    min: 1,
    max: 105,
    landmarks: [
      { id: "jeongnim1", type: "tunnel", name: "정림1터널", icon: "🚇", afterNumber: 100, count: 7 },
      { id: "jeongnim2", type: "tunnel", name: "정림2터널", icon: "🚇", afterNumber: 104, count: 4 },
    ],
  },
  { id: "s05", name: "가수원구내", min: 1, max: 40 },
  { id: "s06", name: "가수원~흑석리", min: 1, max: 94 },
  { id: "s07", name: "흑석리구내", min: 1, max: 27 },
  { id: "s08", name: "흑석리~계룡", min: 1, max: 187 },
  { id: "s09", name: "계룡구내", min: 1, max: 37 },
  { id: "s10", name: "계룡~개태사", min: 1, max: 199 },
  { id: "s11", name: "개태사구내", min: 1, max: 25 },
  { id: "s12", name: "개태사~연산", min: 1, max: 87 },
  { id: "s13", name: "연산구내", min: 1, max: 27 },
  { id: "s14", name: "연산~논산", min: 0, max: 237 },
  { id: "s15", name: "논산구내", min: 1, max: 31 },
  { id: "s16", name: "논산~채운", min: 1, max: 127 },
  { id: "s17", name: "채운구내", min: 1, max: 27 },
  { id: "s18", name: "채운~강경", min: 1, max: 44 },
  { id: "s19", name: "강경구내", min: 1, max: 25 },
];
const DEFAULT_TAGS = ["지장수목", "조류둥지", "넝쿨"];
const LINE_LABEL = { up: "상선", down: "하선" };

const clone = (o) => JSON.parse(JSON.stringify(o));
const recKey = (sectionId, num, line) => `${sectionId}#${num}#${line}`;

// ---------- landmark / tunnel helpers ----------
// A section's pole numbers are normally plain integers. Poles inside a tunnel
// use their own T1..Tn numbering, so we key those as the string "TUN:<landmarkId>:<index>"
// (still just a string plugged into recKey, so the rest of the record-storage code
// doesn't need to know or care that it's a tunnel pole).
function describeNumKey(numKeyStr, sec) {
  if (typeof numKeyStr === "string" && numKeyStr.startsWith("TUN:")) {
    const [, landmarkId, idxStr] = numKeyStr.split(":");
    const landmarks = sec?.landmarks || [];
    const lmIdx = landmarks.findIndex((l) => l.id === landmarkId);
    const lm = landmarks[lmIdx];
    const name = lm ? lm.name : landmarkId;
    const lmSortIdx = lmIdx < 0 ? 999 : lmIdx;
    if (idxStr === "IN") return { sortKey: [1, lmSortIdx, -1], label: `${name} 입구` };
    if (idxStr === "OUT") return { sortKey: [1, lmSortIdx, 9999], label: `${name} 출구` };
    return { sortKey: [1, lmSortIdx, parseInt(idxStr, 10) || 0], label: `${name} T${idxStr}` };
  }
  const n = parseInt(numKeyStr, 10);
  return { sortKey: [0, n, 0], label: `${n}` };
}

function cmpSortKey(a, b) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

// Resolve a label from pasted-in previous-record text (e.g. "83" or "정림1터널 T3")
// back into the internal numKey used for records ("83" or "TUN:jeongnim1:3").
function numKeyFromLabel(label, sec) {
  const trimmed = label.trim();
  const inMatch = trimmed.match(/^(.+?)\s+입구$/);
  if (inMatch) {
    const lm = (sec?.landmarks || []).find((l) => l.name === inMatch[1].trim());
    return lm ? `TUN:${lm.id}:IN` : null;
  }
  const outMatch = trimmed.match(/^(.+?)\s+출구$/);
  if (outMatch) {
    const lm = (sec?.landmarks || []).find((l) => l.name === outMatch[1].trim());
    return lm ? `TUN:${lm.id}:OUT` : null;
  }
  const tMatch = trimmed.match(/^(.+?)\s+T(\d+)$/);
  if (tMatch) {
    const name = tMatch[1].trim();
    const idx = tMatch[2];
    const lm = (sec?.landmarks || []).find((l) => l.name === name);
    return lm ? `TUN:${lm.id}:${idx}` : null;
  }
  const n = parseInt(trimmed, 10);
  return Number.isNaN(n) ? null : `${n}`;
}

// Build the ordered list of grid items for a section: normal pole numbers,
// with tunnel sub-sequences spliced in after their afterNumber, and
// start/end banners for both tunnels and overpasses.
// Build an ordered list of "segments" for a section: plain runs of normal pole
// numbers, and landmark groups (tunnel T-poles, or an overpass's pole range)
// that should render inside their own labeled, colored box.
function buildGridSegments(sec) {
  const segments = [];
  const landmarks = sec.landmarks || [];
  const overpasses = landmarks.filter((l) => l.type === "overpass");
  const tunnelsByAfter = {};
  landmarks.filter((l) => l.type === "tunnel").forEach((l) => { tunnelsByAfter[l.afterNumber] = l; });

  let currentRun = [];
  function flushRun() {
    if (currentRun.length) {
      segments.push({ kind: "normal", poles: currentRun.map((n) => ({ key: n, label: `${n}`, modalLabel: `${n}번` })) });
      currentRun = [];
    }
  }

  for (let n = sec.min; n <= sec.max; n++) {
    const op = overpasses.find((l) => n === l.fromNumber);
    if (op) {
      flushRun();
      const poles = [];
      for (let m = op.fromNumber; m <= op.toNumber; m++) poles.push({ key: m, label: `${m}`, modalLabel: `${m}번` });
      segments.push({ kind: "landmark", landmark: op, poles });
      n = op.toNumber;
      continue;
    }

    currentRun.push(n);

    const tunnel = tunnelsByAfter[n];
    if (tunnel) {
      flushRun();
      const poles = [];
      poles.push({ key: `TUN:${tunnel.id}:IN`, label: "입구", modalLabel: `${tunnel.name} 입구` });
      for (let i = 1; i <= tunnel.count; i++) poles.push({ key: `TUN:${tunnel.id}:${i}`, label: `T${i}`, modalLabel: `${tunnel.name} T${i}` });
      poles.push({ key: `TUN:${tunnel.id}:OUT`, label: "출구", modalLabel: `${tunnel.name} 출구` });
      segments.push({ kind: "landmark", landmark: tunnel, poles });
    }
  }
  flushRun();
  return segments;
}

// ---------- optional shared-server sync (Firebase Realtime Database) ----------
// Feature-detected: if window.firebase isn't present (e.g. previewing this as a
// Claude artifact, or the person hasn't configured sync), every function below
// just quietly does nothing and the app behaves exactly like the local-only version.
let _fbApp = null;
let _fbDb = null;

function fbEnsure(cfg) {
  if (!window.firebase || !cfg) return null;
  try {
    if (!_fbApp) _fbApp = window.firebase.initializeApp(cfg);
    if (!_fbDb) _fbDb = window.firebase.database();
    return _fbDb;
  } catch (e) {
    return null;
  }
}

async function fbFetchRecords(cfg) {
  const db = fbEnsure(cfg);
  if (!db) return null;
  try {
    const snap = await db.ref("records").get();
    return snap.exists() ? snap.val() : {};
  } catch (e) {
    return null;
  }
}

async function fbPushRecords(cfg, mergedRecords) {
  const db = fbEnsure(cfg);
  if (!db) return false;
  try {
    await db.ref("records").set(mergedRecords);
    return true;
  } catch (e) {
    return false;
  }
}

function fbSubscribe(cfg, onChange) {
  const db = fbEnsure(cfg);
  if (!db) return () => {};
  const ref = db.ref("records");
  const handler = (snap) => onChange(snap.exists() ? snap.val() : {});
  ref.on("value", handler);
  return () => ref.off("value", handler);
}

export default function TrainPatrolApp() {
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("setup"); // setup | settings | main | final
  const [config, setConfig] = useState({ sections: DEFAULT_SECTIONS, tagLabels: DEFAULT_TAGS });
  const [resumePrompt, setResumePrompt] = useState(false);
  const [savedSession, setSavedSession] = useState(null);

  const [inspector, setInspector] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [previousRecords, setPreviousRecords] = useState({}); // key -> tags[]

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [records, setRecords] = useState({}); // key -> tags[]

  const [numberModal, setNumberModal] = useState(null); // { number, upTags: [], downTags: [] }
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const exportTextRef = useRef(null);

  const [syncConfig, setSyncConfig] = useState(null); // parsed Firebase config, or null if not set up
  const [syncConfigText, setSyncConfigText] = useState(""); // raw textarea contents in Settings
  const [syncStatus, setSyncStatus] = useState(""); // short status message shown in Settings/Setup

  // ---------- load persisted config + active session ----------
  useEffect(() => {
    (async () => {
      try {
        const cfg = await window.storage.get("config", false);
        if (cfg && cfg.value) setConfig(JSON.parse(cfg.value));
      } catch (e) {}
      try {
        const sc = await window.storage.get("sync_config", false);
        if (sc && sc.value) {
          setSyncConfigText(sc.value);
          try { setSyncConfig(JSON.parse(sc.value)); } catch (e) {}
        }
      } catch (e) {}
      try {
        const active = await window.storage.get("active_session_v2", false);
        if (active && active.value) {
          const parsed = JSON.parse(active.value);
          setSavedSession(parsed);
          setResumePrompt(true);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const saveConfig = useCallback(async (cfg) => {
    try {
      await window.storage.set("config", JSON.stringify(cfg), false);
    } catch (e) {}
  }, []);

  async function saveSyncConfig(text) {
    setSyncConfigText(text);
    try {
      await window.storage.set("sync_config", text, false);
    } catch (e) {}
    if (!text.trim()) {
      setSyncConfig(null);
      setSyncStatus("");
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setSyncConfig(parsed);
      setSyncStatus("연결 확인 중...");
      const data = await fbFetchRecords(parsed);
      setSyncStatus(data !== null ? "서버 연결됨" : "연결 실패 (설정값을 확인하세요)");
    } catch (e) {
      setSyncConfig(null);
      setSyncStatus("설정 형식이 올바르지 않습니다 (JSON 확인)");
    }
  }

  // Live subscription: while patrolling, keep previousRecords in sync with the
  // shared server so everyone sees each other's saved records automatically.
  useEffect(() => {
    if (screen !== "main" || !syncConfig) return;
    const unsubscribe = fbSubscribe(syncConfig, (data) => {
      setPreviousRecords(data || {});
    });
    return unsubscribe;
  }, [screen, syncConfig]);

  // Push this session's merged (previous + current) records to the server
  // whenever anything changes, so other phones pick it up via their own listener.
  useEffect(() => {
    if (screen !== "main" || !syncConfig) return;
    if (Object.keys(records).length === 0) return;
    const merged = {};
    for (const sec of config.sections) {
      for (const k of mergedKeysForSection(sec)) merged[k] = effectiveTags(k);
    }
    fbPushRecords(syncConfig, merged);
  }, [records, screen, syncConfig]);

  const saveActiveSession = useCallback(async (data) => {
    try {
      await window.storage.set("active_session_v2", JSON.stringify(data), false);
    } catch (e) {}
  }, []);

  const clearActiveSession = useCallback(async () => {
    try {
      await window.storage.delete("active_session_v2", false);
    } catch (e) {}
  }, []);

  // autosave while on main screen
  useEffect(() => {
    if (screen !== "main" || !loaded) return;
    saveActiveSession({ inspector, currentSectionIdx, previousRecords, records });
  }, [screen, inspector, currentSectionIdx, previousRecords, records, loaded, saveActiveSession]);

  function resume() {
    const s = savedSession;
    setInspector(s.inspector || "");
    setCurrentSectionIdx(s.currentSectionIdx || 0);
    setPreviousRecords(s.previousRecords || {});
    setRecords(s.records || {});
    setResumePrompt(false);
    setScreen("main");
  }
  function discardResume() {
    clearActiveSession();
    setResumePrompt(false);
  }

  // ---------- parse pasted previous-record text ----------
  // format: ■ 구간명 \n  [상선|하선] 유형: 1, 2, 3
  function parsePrevious(text) {
    const map = {};
    let curSectionName = null;
    const lines = text.split("\n");
    for (let raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const headerMatch = line.match(/^■\s*(.+)$/);
      if (headerMatch) { curSectionName = headerMatch[1].trim(); continue; }
      const lineMatch = line.match(/^\[(상선|하선)\]\s*(.+?):\s*(.+)$/);
      if (lineMatch && curSectionName) {
        const lineKey = lineMatch[1] === "상선" ? "up" : "down";
        const tagLabel = lineMatch[2].trim();
        const sec = config.sections.find((s) => s.name === curSectionName);
        const numKeys = lineMatch[3]
          .split(",")
          .map((n) => (sec ? numKeyFromLabel(n, sec) : null))
          .filter((n) => n !== null);
        if (sec) {
          for (const numKey of numKeys) {
            const key = recKey(sec.id, numKey, lineKey);
            if (!map[key]) map[key] = [];
            if (!map[key].includes(tagLabel)) map[key].push(tagLabel);
          }
        }
      }
    }
    return map;
  }

  function startPatrol() {
    if (!syncConfig) {
      const parsed = pasteText.trim() ? parsePrevious(pasteText) : {};
      setPreviousRecords(parsed);
    }
    setRecords({});
    setScreen("main");
  }

  // ---------- number modal (tap a pole number -> choose 상선/하선 -> choose type) ----------
  // effectiveTags: this session's explicit value if the number was touched, otherwise
  // falls back to the pasted-in previous record (so untouched previous entries are
  // still carried into the final result unless explicitly cleared).
  function effectiveTags(key) {
    if (Object.prototype.hasOwnProperty.call(records, key)) return records[key];
    return previousRecords[key] || null;
  }

  function mergedKeysForSection(sec) {
    const keySet = new Set();
    for (const k of Object.keys(previousRecords)) if (k.startsWith(sec.id + "#")) keySet.add(k);
    for (const k of Object.keys(records)) if (k.startsWith(sec.id + "#")) keySet.add(k);
    return [...keySet].filter((k) => {
      const eff = effectiveTags(k);
      return eff && eff.length > 0;
    });
  }

  function openNumberModal(number, displayLabel) {
    const sec = config.sections[currentSectionIdx];
    const upKey = recKey(sec.id, number, "up");
    const downKey = recKey(sec.id, number, "down");
    const upEff = effectiveTags(upKey);
    const downEff = effectiveTags(downKey);
    setNumberModal({
      number,
      displayLabel: displayLabel ?? `${number}번`,
      upTags: upEff ? [...upEff] : [],
      downTags: downEff ? [...downEff] : [],
    });
  }

  function toggleModalTag(line, label) {
    setNumberModal((m) => {
      if (!m) return m;
      const field = line === "up" ? "upTags" : "downTags";
      const current = m[field];
      const next = current.includes(label) ? current.filter((t) => t !== label) : [...current, label];
      return { ...m, [field]: next };
    });
  }

  function saveModal() {
    if (!numberModal) return;
    const sec = config.sections[currentSectionIdx];
    const upKey = recKey(sec.id, numberModal.number, "up");
    const downKey = recKey(sec.id, numberModal.number, "down");
    setRecords((r) => ({ ...r, [upKey]: numberModal.upTags, [downKey]: numberModal.downTags }));
    setNumberModal(null);
  }

  // Bulk-delete: explicitly clears both lines for this number, overriding any
  // carried-over previous record too (not just this session's own edits).
  function deleteModal() {
    if (!numberModal) return;
    const sec = config.sections[currentSectionIdx];
    const upKey = recKey(sec.id, numberModal.number, "up");
    const downKey = recKey(sec.id, numberModal.number, "down");
    setRecords((r) => ({ ...r, [upKey]: [], [downKey]: [] }));
    setNumberModal(null);
  }

  // ---------- final screen ----------
  function endPatrol() { setConfirmEnd(false); setScreen("final"); }

  function generateExportText() {
    let out = "";
    for (const sec of config.sections) {
      const keysForSec = mergedKeysForSection(sec);
      if (keysForSec.length === 0) continue;

      const grouped = { up: {}, down: {} };
      for (const k of keysForSec) {
        const parts = k.split("#");
        const desc = describeNumKey(parts[1], sec);
        const line = parts[2];
        for (const t of effectiveTags(k)) {
          if (!grouped[line][t]) grouped[line][t] = [];
          grouped[line][t].push(desc);
        }
      }

      out += `■ ${sec.name}\n`;
      for (const line of ["up", "down"]) {
        const tagsObj = grouped[line];
        const orderedTags = [
          ...config.tagLabels.filter((t) => tagsObj[t]),
          ...Object.keys(tagsObj).filter((t) => !config.tagLabels.includes(t)),
        ];
        for (const t of orderedTags) {
          const nums = tagsObj[t].slice().sort((a, b) => cmpSortKey(a.sortKey, b.sortKey)).map((e) => e.label);
          out += `  [${LINE_LABEL[line]}] ${t}: ${nums.join(", ")}\n`;
        }
      }
    }
    return out.trim() || "(기록된 이상 없음)";
  }

  async function copyToClipboard() {
    const text = generateExportText();
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("복사됨");
      setTimeout(() => setCopyStatus(""), 2000);
      return;
    } catch (e) {}
    try {
      const el = exportTextRef.current;
      if (el) {
        el.focus();
        el.select();
        el.setSelectionRange(0, text.length);
        const ok = document.execCommand("copy");
        if (ok) {
          setCopyStatus("복사됨");
          setTimeout(() => setCopyStatus(""), 2000);
          return;
        }
      }
    } catch (e) {}
    setCopyStatus("자동 복사가 안 돼요. 아래 텍스트가 선택되어 있으니 길게 눌러 복사하세요.");
  }

  async function resetAll() {
    setRecords({}); setPreviousRecords({}); setPasteText("");
    setInspector(""); setNumberModal(null); setConfirmEnd(false);
    await clearActiveSession();
    setScreen("setup");
  }

  function backToMain() {
    setScreen("main");
  }

  // ================= RENDER =================
  const S = styles;

  if (!loaded) {
    return <div style={{ background: "#181b1f", minHeight: "100vh" }} />;
  }

  if (resumePrompt) {
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={S.title}>이전 순회 기록 발견</div>
          <div style={S.subtle}>진행 중이던 열차순회 기록이 있습니다. 이어서 진행할까요?</div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button style={S.btnGhost} onClick={discardResume}>새로 시작</button>
            <button style={S.btnPrimary} onClick={resume}>이어서 하기</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "settings") {
    return (
      <div style={S.page}>
        <div style={S.headerRow}>
          <button style={S.iconBtn} onClick={() => setScreen("setup")}><ArrowLeft size={20} color="#e7e2d8" /></button>
          <div style={S.headerTitle}>설정</div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ ...S.scroll, padding: "4px 16px 24px" }}>
          <div style={S.sectionLabel}>구간별 번호 범위</div>
          {config.sections.map((sec, i) => (
            <div key={sec.id} style={S.settingsRow}>
              <div style={S.settingsName}>{sec.name}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={S.smallInput}
                  type="number"
                  value={sec.min}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || "0", 10);
                    setConfig((c) => {
                      const next = clone(c);
                      next.sections[i].min = v;
                      saveConfig(next);
                      return next;
                    });
                  }}
                />
                <span style={{ color: "#8a8578", alignSelf: "center" }}>~</span>
                <input
                  style={S.smallInput}
                  type="number"
                  value={sec.max}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || "0", 10);
                    setConfig((c) => {
                      const next = clone(c);
                      next.sections[i].max = v;
                      saveConfig(next);
                      return next;
                    });
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ ...S.sectionLabel, marginTop: 24 }}>이상 유형 (버튼 라벨)</div>
          {config.tagLabels.map((tag, i) => (
            <input
              key={i}
              style={{ ...S.input, marginBottom: 8 }}
              value={tag}
              onChange={(e) => {
                const v = e.target.value;
                setConfig((c) => {
                  const next = clone(c);
                  next.tagLabels[i] = v;
                  saveConfig(next);
                  return next;
                });
              }}
            />
          ))}

          <div style={{ ...S.sectionLabel, marginTop: 24 }}>서버 동기화 (선택)</div>
          <div style={S.hint}>
            여러 사람이 각자 폰으로 같은 기록을 보고 싶다면, 무료 Firebase 프로젝트를 만들어
            아래에 설정값(JSON)을 붙여넣으세요. 한 번 설정하면 모든 폰에 똑같이 붙여넣으면 됩니다.
          </div>
          <textarea
            style={{ ...S.input, height: 110, fontFamily: "monospace", fontSize: 12, marginTop: 8 }}
            value={syncConfigText}
            onChange={(e) => setSyncConfigText(e.target.value)}
            placeholder={'{\n  "apiKey": "...",\n  "authDomain": "...",\n  "databaseURL": "https://....firebaseio.com",\n  "projectId": "..."\n}'}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={{ ...S.btnGhost, flex: 1 }} onClick={() => saveSyncConfig("")}>연결 끊기</button>
            <button style={{ ...S.btnPrimary, flex: 1 }} onClick={() => saveSyncConfig(syncConfigText)}>저장하고 연결</button>
          </div>
          {syncStatus && <div style={{ ...S.hint, textAlign: "center", marginTop: 6 }}>{syncStatus}</div>}
        </div>
      </div>
    );
  }

  if (screen === "setup") {
    return (
      <div style={S.page}>
        <div style={{ ...S.scroll, padding: "28px 20px" }}>
          <div style={S.brand}>KORAIL PATROL</div>
          <div style={S.title}>열차순회 시작</div>

          <label style={S.label}>순회자 이름 / 사번</label>
          <input style={S.input} value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="예: 홍길동 / 12345" />

          <label style={S.label}>구간 선택</label>
          <select style={S.input} value={currentSectionIdx} onChange={(e) => setCurrentSectionIdx(parseInt(e.target.value, 10))}>
            {config.sections.map((s, i) => (
              <option key={s.id} value={i}>{s.name}</option>
            ))}
          </select>
          <div style={S.hint}>순회 중에는 화면 위쪽에서 언제든 다른 구간으로 바꿀 수 있어요.</div>

          {syncConfig ? (
            <div style={{ ...S.card, marginTop: 16 }}>
              <div style={{ color: "#7fd88f", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🔗 서버 동기화 켜짐</div>
              <div style={S.hint}>이전 기록을 붙여넣지 않아도 자동으로 불러옵니다. 다른 사람이 저장한 기록도 실시간으로 같이 보여요.</div>
            </div>
          ) : (
            <>
              <label style={S.label}>이전 기록 붙여넣기 (선택)</label>
              <textarea
                style={{ ...S.input, height: 100, fontFamily: "monospace", fontSize: 13 }}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={"■ 서대전구내\n  [상선] 지장수목: 3, 7\n  [하선] 넝쿨: 12"}
              />
              <div style={S.hint}>이전에 복사한 최종 기록을 붙여넣으면, 번호 목록에서 표시가 나와요.</div>
            </>
          )}

          <button style={{ ...S.btnGhost, marginTop: 20, width: "100%" }} onClick={() => setScreen("settings")}>
            <Settings size={16} style={{ marginRight: 6 }} /> 구간 범위 / 유형 설정
          </button>

          <button style={{ ...S.btnPrimary, marginTop: 12, width: "100%" }} onClick={startPatrol}>
            순회 시작
          </button>
        </div>
      </div>
    );
  }

  if (screen === "final") {
    const sectionsWithData = config.sections.filter((sec) => mergedKeysForSection(sec).length > 0);
    return (
      <div style={S.page}>
        <div style={S.headerRow}>
          <div style={{ width: 36 }} />
          <div style={S.headerTitle}>최종 기록</div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ ...S.scroll, padding: "8px 16px 24px" }}>
          <div style={S.subtle}>{inspector ? `순회자: ${inspector}` : ""}</div>
          {sectionsWithData.length === 0 && (
            <div style={{ ...S.card, marginTop: 16, textAlign: "center", color: "#8a8578" }}>기록된 이상 없음</div>
          )}
          {sectionsWithData.map((sec) => {
            const keysForSec = mergedKeysForSection(sec);
            const grouped = { up: {}, down: {} };
            for (const k of keysForSec) {
              const parts = k.split("#");
              const desc = describeNumKey(parts[1], sec);
              const line = parts[2];
              for (const t of effectiveTags(k)) {
                if (!grouped[line][t]) grouped[line][t] = [];
                grouped[line][t].push(desc);
              }
            }
            return (
              <div key={sec.id} style={{ marginTop: 18 }}>
                <div style={S.sectionLabel}>{sec.name}</div>
                {["up", "down"].map((line) =>
                  Object.keys(grouped[line]).map((t) => (
                    <div key={line + t} style={S.entryRow}>
                      <div style={S.entryNum}>[{LINE_LABEL[line]}] {t}</div>
                      <div style={S.entryTags}>
                        {grouped[line][t].sort((a, b) => cmpSortKey(a.sortKey, b.sortKey)).map((e) => e.label).join(", ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}

          <button style={{ ...S.btnGhost, marginTop: 24, width: "100%" }} onClick={backToMain}>
            <ArrowLeft size={16} style={{ marginRight: 6 }} /> 돌아가서 계속 기록하기
          </button>

          <button style={{ ...S.btnPrimary, marginTop: 12, width: "100%" }} onClick={copyToClipboard}>
            <Copy size={16} style={{ marginRight: 6 }} /> 텍스트로 복사
          </button>
          {copyStatus && <div style={{ ...S.hint, textAlign: "center" }}>{copyStatus}</div>}

          <div style={S.hint}>버튼이 자동으로 복사하지 못하면, 아래 칸을 눌러 전체 선택된 텍스트를 길게 눌러 복사하세요.</div>
          <textarea
            ref={exportTextRef}
            readOnly
            value={generateExportText()}
            onFocus={(e) => e.target.select()}
            style={{ ...S.input, marginTop: 8, height: 140, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre" }}
          />

          <button style={{ ...S.btnGhost, marginTop: 12, width: "100%" }} onClick={resetAll}>
            <RefreshCw size={16} style={{ marginRight: 6 }} /> 초기화하고 새 순회 시작
          </button>
        </div>
      </div>
    );
  }

  // ---- main screen: section switcher + full number grid ----
  const curSec = config.sections[currentSectionIdx];
  const gridSegments = curSec ? buildGridSegments(curSec) : [];

  function cellState(numKey) {
    const upKey = recKey(curSec.id, numKey, "up");
    const downKey = recKey(curSec.id, numKey, "down");
    const upEff = effectiveTags(upKey);
    const downEff = effectiveTags(downKey);
    const hasAny = (upEff && upEff.length > 0) || (downEff && downEff.length > 0);
    if (!hasAny) return { hasCur: false, hasPrev: false };
    const touchedThisSession =
      Object.prototype.hasOwnProperty.call(records, upKey) || Object.prototype.hasOwnProperty.call(records, downKey);
    return { hasCur: touchedThisSession, hasPrev: !touchedThisSession };
  }

  function renderPoleButton(pole, keyPrefix) {
    const { hasCur, hasPrev } = cellState(pole.key);
    const cellStyle = hasCur ? S.cellCur : hasPrev ? S.cellPrev : S.cell;
    return (
      <button
        key={`${keyPrefix}${pole.key}`}
        style={cellStyle}
        onClick={() => openNumberModal(pole.key, pole.modalLabel)}
      >
        {pole.label}
      </button>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.headerRow}>
        <button
          style={S.sectionNavBtn}
          disabled={currentSectionIdx <= 0}
          onClick={() => setCurrentSectionIdx((i) => Math.max(0, i - 1))}
          title="이전 구간"
        >
          ◀
        </button>
        <select
          style={S.sectionSelect}
          value={currentSectionIdx}
          onChange={(e) => setCurrentSectionIdx(parseInt(e.target.value, 10))}
        >
          {config.sections.map((s, i) => (
            <option key={s.id} value={i}>{s.name}</option>
          ))}
        </select>
        <button
          style={S.sectionNavBtn}
          disabled={currentSectionIdx >= config.sections.length - 1}
          onClick={() => setCurrentSectionIdx((i) => Math.min(config.sections.length - 1, i + 1))}
          title="다음 구간"
        >
          ▶
        </button>
        <button style={S.iconBtnDanger} onClick={() => setConfirmEnd(true)}><Square size={16} color="#e7e2d8" /></button>
      </div>

      <div style={{ ...S.scroll, padding: "10px 14px 24px" }}>
        <div style={S.legendRow}>
          <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#ffb020" }} /> 이번 순회 기록</span>
          <span style={S.legendItem}><span style={{ ...S.legendDot, border: "1.5px solid #4a90a4", background: "transparent" }} /> 이전 기록</span>
          {syncConfig && <span style={{ ...S.legendItem, color: "#7fd88f", marginLeft: "auto" }}>🔗 실시간 동기화 중</span>}
        </div>

        {gridSegments.map((seg, segIdx) => {
          if (seg.kind === "landmark") {
            const boxStyle = seg.landmark.type === "tunnel" ? S.landmarkBoxTunnel : S.landmarkBoxOverpass;
            const labelColor = seg.landmark.type === "tunnel" ? "#c7a8e8" : "#7fc3d6";
            return (
              <div key={`seg${segIdx}`} style={boxStyle}>
                <div style={{ ...S.landmarkBoxLabel, color: labelColor }}>
                  <span>{seg.landmark.icon}</span> {seg.landmark.name}
                </div>
                <div style={S.grid}>
                  {seg.poles.map((pole) => renderPoleButton(pole, `l${segIdx}-`))}
                </div>
              </div>
            );
          }
          return (
            <div key={`seg${segIdx}`} style={S.grid}>
              {seg.poles.map((pole) => renderPoleButton(pole, `n${segIdx}-`))}
            </div>
          );
        })}
      </div>

      {numberModal && (
        <div style={S.popupWrap} onClick={() => setNumberModal(null)}>
          <div style={S.popup} onClick={(e) => e.stopPropagation()}>
            <div style={{ color: "#e7e2d8", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {curSec?.name} {numberModal.displayLabel}
            </div>

            {(previousRecords[recKey(curSec.id, numberModal.number, "up")] || previousRecords[recKey(curSec.id, numberModal.number, "down")]) && (
              <div style={{ ...S.hint, marginBottom: 10 }}>
                이전 기록:
                {previousRecords[recKey(curSec.id, numberModal.number, "up")] && ` [상선] ${previousRecords[recKey(curSec.id, numberModal.number, "up")].join(", ")}`}
                {previousRecords[recKey(curSec.id, numberModal.number, "down")] && ` [하선] ${previousRecords[recKey(curSec.id, numberModal.number, "down")].join(", ")}`}
              </div>
            )}

            <div style={S.lineBlock}>
              <div style={S.lineLabel}>상선</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {config.tagLabels.map((label) => (
                  <button
                    key={label}
                    style={numberModal.upTags.includes(label) ? S.tagBtnActive : S.tagBtn}
                    onClick={() => toggleModalTag("up", label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={S.lineBlock}>
              <div style={S.lineLabel}>하선</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {config.tagLabels.map((label) => (
                  <button
                    key={label}
                    style={numberModal.downTags.includes(label) ? S.tagBtnActive : S.tagBtn}
                    onClick={() => toggleModalTag("down", label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={S.popupBtnGhost} onClick={deleteModal}><X size={14} style={{ marginRight: 4 }} />삭제</button>
              <button style={S.popupBtnGhost} onClick={() => setNumberModal(null)}>닫기</button>
              <button style={S.popupBtnPrimary} onClick={saveModal}><Check size={14} style={{ marginRight: 4 }} />저장</button>
            </div>
          </div>
        </div>
      )}

      {confirmEnd && (
        <div style={S.popupWrap}>
          <div style={S.popup}>
            <div style={{ color: "#e7e2d8", fontSize: 15, marginBottom: 12 }}>열차순회를 종료할까요?</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.popupBtnGhost} onClick={() => setConfirmEnd(false)}>취소</button>
              <button style={S.popupBtnPrimary} onClick={endPatrol}><Check size={14} style={{ marginRight: 4 }} />종료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#181b1f", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#e7e2d8", fontFamily: "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" },
  scroll: { flex: 1, overflowY: "auto" },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px", borderBottom: "1px solid #2a2e33", gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: 700, color: "#e7e2d8" },
  brand: { fontSize: 11, letterSpacing: 3, color: "#5c6570", marginBottom: 6 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 18 },
  subtle: { fontSize: 13, color: "#9a958a" },
  label: { display: "block", fontSize: 12, color: "#9a958a", marginTop: 16, marginBottom: 6, letterSpacing: 0.5 },
  hint: { fontSize: 12, color: "#6f7680", marginTop: 6, lineHeight: 1.5 },
  input: { width: "100%", boxSizing: "border-box", background: "#22262b", border: "1px solid #33383e", borderRadius: 8, padding: "10px 12px", color: "#e7e2d8", fontSize: 15, outline: "none" },
  smallInput: { width: 64, boxSizing: "border-box", background: "#22262b", border: "1px solid #33383e", borderRadius: 6, padding: "6px 8px", color: "#e7e2d8", fontSize: 14, outline: "none" },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#ffb020", marginBottom: 8, letterSpacing: 0.5 },
  settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #24282d" },
  settingsName: { fontSize: 14, color: "#e7e2d8" },
  btnPrimary: { display: "flex", alignItems: "center", justifyContent: "center", background: "#ffb020", color: "#181b1f", border: "none", borderRadius: 10, padding: "14px 18px", fontWeight: 700, fontSize: 15 },
  btnGhost: { display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "#e7e2d8", border: "1px solid #33383e", borderRadius: 10, padding: "12px 18px", fontSize: 14 },
  iconBtn: { background: "transparent", border: "none", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" },
  iconBtnDanger: { background: "#3a2020", border: "1px solid #5c2c2c", borderRadius: 8, width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#22262b", border: "1px solid #33383e", borderRadius: 10, padding: 16 },
  sectionSelect: { flex: 1, background: "#22262b", border: "1px solid #33383e", borderRadius: 8, padding: "8px 10px", color: "#e7e2d8", fontSize: 15, fontWeight: 700, textAlign: "center" },
  sectionNavBtn: { background: "#22262b", border: "1px solid #33383e", borderRadius: 8, width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#e7e2d8", fontSize: 15 },
  legendRow: { display: "flex", gap: 16, marginBottom: 12, fontSize: 12, color: "#9a958a" },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3, display: "inline-block" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: 8 },
  cell: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "#22262b", border: "1px solid #33383e", borderRadius: 8, padding: "8px 0", color: "#e7e2d8", fontSize: 14, fontWeight: 600 },
  cellCur: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "#3a2c0f", border: "1.5px solid #ffb020", borderRadius: 8, padding: "8px 0", color: "#ffb020", fontSize: 14, fontWeight: 700 },
  cellPrev: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "#22262b", border: "1.5px dashed #4a90a4", borderRadius: 8, padding: "8px 0", color: "#7fb8c9", fontSize: 14, fontWeight: 600 },
  landmarkBoxTunnel: { border: "1.5px solid #7c5cbf", background: "rgba(124,92,191,0.08)", borderRadius: 12, padding: "10px 10px 12px", margin: "8px 0" },
  landmarkBoxOverpass: { border: "1.5px solid #4a90a4", background: "rgba(74,144,164,0.08)", borderRadius: 12, padding: "10px 10px 12px", margin: "8px 0" },
  landmarkBoxLabel: { fontSize: 12, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 },
  lineBlock: { marginTop: 12 },
  lineLabel: { fontSize: 12, color: "#9a958a", marginBottom: 6, fontWeight: 700 },
  tagBtn: { padding: "10px 12px", borderRadius: 8, border: "1px solid #33383e", background: "#22262b", color: "#e7e2d8", fontSize: 13, fontWeight: 600 },
  tagBtnActive: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ffb020", background: "#ffb02022", color: "#ffb020", fontSize: 13, fontWeight: 700 },
  popupWrap: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 },
  popup: { width: "100%", maxWidth: 420, background: "#22262b", borderTop: "1px solid #33383e", borderRadius: "16px 16px 0 0", padding: 18, maxHeight: "80vh", overflowY: "auto" },
  popupBtnGhost: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0", borderRadius: 8, border: "1px solid #33383e", background: "transparent", color: "#e7e2d8", fontSize: 14 },
  popupBtnPrimary: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0", borderRadius: 8, border: "none", background: "#ffb020", color: "#181b1f", fontWeight: 700, fontSize: 14 },
  entryRow: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#22262b", borderRadius: 8, marginBottom: 6 },
  entryNum: { fontSize: 13, fontWeight: 700, color: "#ffb020" },
  entryTags: { fontSize: 13, color: "#e7e2d8" },
};
