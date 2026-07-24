export const SLOT_MINUTES = 15;
export const SLOT_MINUTES_MS = SLOT_MINUTES * 60 * 1000;

/** Convierte minutos desde medianoche a "HH:MM" (24h). */
export function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Convierte "HH:MM" a minutos desde medianoche. */
export function timeToMin(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Duración en minutos entre dos minutos absolutos. */
export function durationMin(startMin: number, endMin: number): number {
  return Math.max(0, endMin - startMin);
}

/** Formatea una duración en minutos como "1h 30min" o "45min". */
export function formatDuration(mins: number): string {
  if (mins <= 0) return "0min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Redondea un minuto absoluto al slot más cercano (por defecto 15 min). */
export function snapToSlot(min: number, slotMin = SLOT_MINUTES): number {
  return Math.round(min / slotMin) * slotMin;
}

/** Sujeta un valor entre min y max inclusive. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Genera un id corto y razonablemente único. */
export function uid(prefix = ""): string {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

/** Convierte minutos desde medianoche a un porcentaje de un rango dado. */
export function minToPercent(
  min: number,
  rangeStart: number,
  rangeEnd: number,
): number {
  const total = rangeEnd - rangeStart;
  if (total <= 0) return 0;
  return clamp((min - rangeStart) / total, 0, 1);
}

/** Genera las marcas de hora enteras dentro de un rango. */
export function hourMarks(startMin: number, endMin: number): number[] {
  const marks: number[] = [];
  const first = Math.ceil(startMin / 60) * 60;
  for (let m = first; m <= endMin; m += 60) marks.push(m);
  return marks;
}
