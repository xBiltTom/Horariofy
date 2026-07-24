import { deflateSync, strToU8, inflateSync, strFromU8 } from "fflate";
import type { Course, ScheduleConfig, Block, CourseSession } from "@/types";
import { uid } from "@/utils/time";

export interface SharedData {
  courses: Course[];
  blocks: Block[];
  config: ScheduleConfig;
}

// ─── Packed binary format (arrays instead of objects) ───────────────────────
// Eliminamos todas las keys de JSON para que el compresor tenga menos data.
// Format: [type, professor, location]
type PackedSession = [string, string, string];
// Format: [name, color, packedSessions]
type PackedCourse = [string, string, PackedSession[]];
// Format: [courseIndex, sessionIndex, day, startMin, endMin]
type PackedBlock = [number, number, number, number, number];
// Format: [startMin, endMin]
type PackedConfig = [number, number];
// Format: [courses, blocks, config]
type PackedSchedule = [PackedCourse[], PackedBlock[], PackedConfig];

// ─── Base64url helpers (no padding, URL-safe) ────────────────────────────────
function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compresses the schedule data using DEFLATE + base64url.
 * ~18-25% shorter than the previous LZString approach.
 */
export function encodeScheduleData(
  courses: Course[],
  blocks: Block[],
  config: ScheduleConfig
): string {
  // 1. Pack Courses and build index maps
  const courseIdToIndex = new Map<string, number>();
  const sessionIdToIndex = new Map<string, number>();

  const packedCourses: PackedCourse[] = courses.map((c, i) => {
    courseIdToIndex.set(c.id, i);
    const packedSessions: PackedSession[] = (c.sessions || []).map((s, j) => {
      sessionIdToIndex.set(s.id, j);
      return [s.type, s.professor || "", s.location || ""];
    });
    return [c.name, c.color, packedSessions];
  });

  // 2. Pack Blocks (replace IDs with numeric indices)
  const packedBlocks: PackedBlock[] = blocks.map((b) => {
    const cIdx = courseIdToIndex.get(b.courseId) ?? 0;
    const sIdx = sessionIdToIndex.get(b.sessionId) ?? 0;
    return [cIdx, sIdx, b.day, b.startMin, b.endMin];
  });

  // 3. Pack Config
  const packedConfig: PackedConfig = [config.startMin, config.endMin];

  // 4. Serialize and compress with DEFLATE level 9
  const json = JSON.stringify([packedCourses, packedBlocks, packedConfig] as PackedSchedule);
  const compressed = deflateSync(strToU8(json), { level: 9 });

  // 5. Encode as base64url (no padding, URL-safe, no extra encoding needed)
  return toBase64Url(compressed);
}

/**
 * Decompresses a base64url+DEFLATE encoded string back into schedule data.
 * Falls back to the older LZString format for backwards compatibility.
 */
export async function decodeScheduleData(encoded: string): Promise<SharedData | null> {
  try {
    let jsonString: string;

    // Detect format: DEFLATE (base64url) vs legacy LZString
    // LZString strings use chars like Q, N, h, I, etc. and can contain +
    // base64url uses only A-Z, a-z, 0-9, -, _
    const isBase64Url = /^[A-Za-z0-9\-_]+$/.test(encoded);

    if (isBase64Url) {
      // New format: DEFLATE + base64url
      const compressed = fromBase64Url(encoded);
      jsonString = strFromU8(inflateSync(compressed));
    } else {
      // Legacy format: LZString (dynamically imported to avoid bundle cost)
      const LZString = (await import("lz-string")).default;
      const result = LZString.decompressFromEncodedURIComponent(encoded);
      if (!result) return null;
      jsonString = result;
    }

    const rawData = JSON.parse(jsonString);

    // Fallback: old uncompressed SharedData object
    if (rawData && !Array.isArray(rawData) && rawData.courses && rawData.blocks) {
      return rawData as SharedData;
    }

    const payload = rawData as PackedSchedule;
    if (!Array.isArray(payload) || payload.length !== 3) return null;

    const [packedCourses, packedBlocks, packedConfig] = payload;

    // Unpack Courses
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

    // Unpack Blocks
    const blocks: Block[] = packedBlocks.map((pb) => {
      const [cIdx, sIdx, day, startMin, endMin] = pb;
      const courseId = courseIndexToId.get(cIdx) || courses[0]?.id || uid("c_");
      const sessionId =
        sessionIndexToId.get(cIdx)?.get(sIdx) ||
        courses[0]?.sessions?.[0]?.id ||
        uid("s_");
      return { id: uid("b_"), courseId, sessionId, day: day as any, startMin, endMin };
    });

    // Unpack Config
    const config: ScheduleConfig = { startMin: packedConfig[0], endMin: packedConfig[1] };

    return { courses, blocks, config };
  } catch (err) {
    console.error("Failed to decode schedule data:", err);
    return null;
  }
}
