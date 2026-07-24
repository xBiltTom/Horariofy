import type { Block, Day } from "@/types";

export interface BlockLayout {
  block: Block;
  column: number;
  columnCount: number;
}

/**
 * Comprueba si dos bloques se solapan en el tiempo.
 * El contacto en un extremo (end === start) NO cuenta como solapamiento.
 */
export function overlaps(a: Block, b: Block): boolean {
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

/**
 * Agrupa bloques del mismo día en clusters de solapamiento transitivo.
 * Si A solapa con B, y B con C, todos van al mismo cluster (aunque A y C no se solapen).
 */
export function clusterBlocks(blocks: Block[]): Block[][] {
  const sorted = [...blocks].sort((a, b) => a.startMin - b.startMin);
  const clusters: Block[][] = [];
  let current: Block[] = [];
  let clusterEnd = -1;

  for (const block of sorted) {
    if (current.length === 0) {
      current = [block];
      clusterEnd = block.endMin;
    } else if (block.startMin < clusterEnd) {
      current.push(block);
      clusterEnd = Math.max(clusterEnd, block.endMin);
    } else {
      clusters.push(current);
      current = [block];
      clusterEnd = block.endMin;
    }
  }
  if (current.length > 0) clusters.push(current);
  return clusters;
}

/**
 * Asigna columnas a los bloques de un cluster usando greedy por startMin.
 * Cada bloque recibe la columna más baja disponible (sin solapar con otros
 * de la misma columna). Devuelve el layout con el número total de columnas
 * del cluster (todas las filas comparten el ancho del cluster).
 */
function layoutCluster(cluster: Block[]): BlockLayout[] {
  const sorted = [...cluster].sort((a, b) => a.startMin - b.startMin);
  const columns: Block[][] = [];
  const layouts: BlockLayout[] = [];

  for (const block of sorted) {
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const last = col[col.length - 1];
      if (last && !overlaps(last, block)) {
        col.push(block);
        layouts.push({ block, column: i, columnCount: 0 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([block]);
      layouts.push({ block, column: columns.length - 1, columnCount: 0 });
    }
  }

  const columnCount = columns.length;
  return layouts.map((l) => ({ ...l, columnCount }));
}

/**
 * Calcula el layout de columnas para todos los bloques de un día.
 * Bloques no solapados reciben columnCount = 1 (full width).
 */
export function layoutDay(blocks: Block[]): BlockLayout[] {
  const clusters = clusterBlocks(blocks);
  const result: BlockLayout[] = [];
  for (const cluster of clusters) {
    if (cluster.length === 1) {
      result.push({ block: cluster[0], column: 0, columnCount: 1 });
    } else {
      result.push(...layoutCluster(cluster));
    }
  }
  return result;
}

/**
 * Obtiene los bloques de un día específico.
 */
export function blocksByDay(blocks: Block[], day: Day): Block[] {
  return blocks.filter((b) => b.day === day);
}
