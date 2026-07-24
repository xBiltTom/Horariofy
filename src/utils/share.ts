import { deflateSync, strToU8, inflateSync, strFromU8 } from "fflate";
import type { Course, ScheduleConfig, Block, CourseSession } from "@/types";
import { uid } from "@/utils/time";

export interface SharedData {
  courses: Course[];
  blocks: Block[];
  config: ScheduleConfig;
}

// ─── Wire format (internal, versioned) ──────────────────────────────────────
// Each version is a self-contained type so migrating is straightforward.

// V1 — Initial packed format
// Sessions: [type, professor, location]
// Courses:  [name, color, sessions[]]
// Blocks:   [courseIdx, sessionIdx, day, startMin, endMin]   ← absolute minutes
// Config:   [startMin, endMin]
type V1Session = [string, string, string];
type V1Course  = [string, string, V1Session[]];
type V1Block   = [number, number, number, number, number];
type V1Config  = [number, number];
type V1Payload = { v: 1; d: [V1Course[], V1Block[], V1Config] };

// V2 — Relative offsets (smaller numbers → better DEFLATE compression)
// Blocks:   [courseIdx, sessionIdx, day, startOffset, duration]
//           where startOffset = startMin - config.startMin
//           and   duration    = endMin   - startMin
type V2Block   = [number, number, number, number, number];
type V2Payload = { v: 2; d: [V1Course[], V2Block[], V1Config] };

// CURRENT_VERSION — bump this when changing the format
const CURRENT_VERSION = 2;

// ─── Base64url helpers ────────────────────────────────────────────────────────
function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ─── Encoder ─────────────────────────────────────────────────────────────────
/**
 * Serializes and compresses schedule data into a short, URL-safe string.
 * Format: DEFLATE(JSON({ v: 2, d: [...] })) → base64url
 */
export function encodeScheduleData(
  courses: Course[],
  blocks: Block[],
  config: ScheduleConfig
): string {
  // 1. Build index maps (IDs never leave the wire)
  const courseIdToIndex = new Map<string, number>();
  const sessionIdToIndex = new Map<string, number>();

  const packedCourses: V1Course[] = courses.map((c, i) => {
    courseIdToIndex.set(c.id, i);
    const sessions: V1Session[] = (c.sessions || []).map((s, j) => {
      sessionIdToIndex.set(s.id, j);
      return [s.type, s.professor || "", s.location || ""];
    });
    return [c.name, c.color, sessions];
  });

  // 2. Pack blocks with relative offsets (v2)
  const packedBlocks: V2Block[] = blocks.map((b) => {
    const cIdx = courseIdToIndex.get(b.courseId) ?? 0;
    const sIdx = sessionIdToIndex.get(b.sessionId) ?? 0;
    const startOffset = b.startMin - config.startMin;
    const duration = b.endMin - b.startMin;
    return [cIdx, sIdx, b.day, startOffset, duration];
  });

  // 3. Config
  const packedConfig: V1Config = [config.startMin, config.endMin];

  // 4. Versioned payload → JSON → DEFLATE → base64url
  const payload: V2Payload = {
    v: 2,
    d: [packedCourses, packedBlocks, packedConfig],
  };

  const json = JSON.stringify(payload);
  const compressed = deflateSync(strToU8(json), { level: 9 });
  return toBase64Url(compressed);
}

// ─── Decoder ─────────────────────────────────────────────────────────────────
/**
 * Decompresses and deserializes a share URL payload.
 * Supports: v2 (current), v1, and legacy LZString format.
 */
export async function decodeScheduleData(encoded: string): Promise<SharedData | null> {
  try {
    let jsonString: string;

    // Detect encoding: base64url chars only → new DEFLATE format
    // LZString URLs contain chars outside [A-Za-z0-9-_] (e.g. '+', letters like 'Q')
    const isBase64Url = /^[A-Za-z0-9\-_]+$/.test(encoded);

    if (isBase64Url) {
      jsonString = strFromU8(inflateSync(fromBase64Url(encoded)));
    } else {
      // Legacy LZString — lazy import so it doesn't bloat the bundle
      const LZString = (await import("lz-string")).default;
      const result = LZString.decompressFromEncodedURIComponent(encoded);
      if (!result) return null;
      jsonString = result;
    }

    const raw = JSON.parse(jsonString);

    // ── Legacy: raw SharedData object (very old links, pre-packing) ──────────
    if (raw && !Array.isArray(raw) && raw.courses && raw.blocks && !raw.v) {
      return raw as SharedData;
    }

    // ── Legacy: packed array without version (LZString era) ─────────────────
    if (Array.isArray(raw) && raw.length === 3) {
      return unpackV1(raw[0], raw[1], raw[2], false);
    }

    // ── Versioned payload ────────────────────────────────────────────────────
    const version: number = raw?.v;

    if (version === 1) {
      const [packedCourses, packedBlocks, packedConfig] = raw.d as [V1Course[], V1Block[], V1Config];
      return unpackV1(packedCourses, packedBlocks, packedConfig, false);
    }

    if (version === 2) {
      const [packedCourses, packedBlocks, packedConfig] = raw.d as [V1Course[], V2Block[], V1Config];
      return unpackV1(packedCourses, packedBlocks, packedConfig, true);
    }

    console.warn("Unknown share format version:", version);
    return null;
  } catch (err) {
    // Return null silently. Invalid links are expected (truncated URL, copy-paste errors)
    // and we want the UI to gracefully show the "Horario no encontrado" screen
    // without triggering Next.js dev error overlays.
    return null;
  }
}

// ─── Shared unpacking logic ───────────────────────────────────────────────────
function unpackV1(
  packedCourses: V1Course[],
  packedBlocks: V1Block[] | V2Block[],
  packedConfig: V1Config,
  relativeOffsets: boolean
): SharedData {
  const courses: Course[] = [];
  const courseIndexToId = new Map<number, string>();
  const sessionIndexToId = new Map<number, Map<number, string>>();

  packedCourses.forEach((pc, i) => {
    const courseId = uid("c_");
    courseIndexToId.set(i, courseId);

    const sMap = new Map<number, string>();
    sessionIndexToId.set(i, sMap);

    const sessions: CourseSession[] = pc[2].map((ps, j) => {
      const sessionId = uid("s_");
      sMap.set(j, sessionId);
      return { id: sessionId, type: ps[0], professor: ps[1], location: ps[2] };
    });

    courses.push({ id: courseId, name: pc[0], color: pc[1] as any, sessions });
  });

  const [configStartMin, configEndMin] = packedConfig;

  const blocks: Block[] = packedBlocks.map((pb) => {
    const [cIdx, sIdx, day, field3, field4] = pb;
    const courseId = courseIndexToId.get(cIdx) || courses[0]?.id || uid("c_");
    const sessionId = sessionIndexToId.get(cIdx)?.get(sIdx) || courses[0]?.sessions?.[0]?.id || uid("s_");

    // V2: field3=startOffset, field4=duration → reconstruct absolute minutes
    // V1: field3=startMin,    field4=endMin   → already absolute
    const startMin = relativeOffsets ? configStartMin + field3 : field3;
    const endMin   = relativeOffsets ? startMin + field4 : field4;

    return { id: uid("b_"), courseId, sessionId, day: day as any, startMin, endMin };
  });

  const config: ScheduleConfig = { startMin: configStartMin, endMin: configEndMin };
  return { courses, blocks, config };
}
