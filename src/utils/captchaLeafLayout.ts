export interface DryLeafState {
  id: number
  x: number
  y: number
  rotation: number
  variant: 0 | 1 | 2
  collected: boolean
}

export interface GarbageBinLayout {
  x: number
  y: number
  width: number
  height: number
}

export const LEAF_SIZE = 96
export const LEAF_GRAB_DISTANCE = 145
export const LEAF_COUNT = 3
export const BIN_WIDTH = 168
export const BIN_HEIGHT = 112
export const BIN_BOTTOM_MARGIN = 28

export function createGarbageLeafLayout(
  width: number,
  height: number,
): { leaves: DryLeafState[]; bin: GarbageBinLayout } {
  const leaves: DryLeafState[] = []
  const topZone = height * 0.12
  const bottomZone = height * 0.52
  const margin = LEAF_SIZE

  for (let i = 0; i < LEAF_COUNT; i++) {
    leaves.push({
      id: i,
      x: margin + ((i + 1) / (LEAF_COUNT + 1)) * (width - margin * 2) + (Math.random() - 0.5) * 40,
      y: topZone + Math.random() * (bottomZone - topZone),
      rotation: -55 + Math.random() * 110,
      variant: (i % 3) as 0 | 1 | 2,
      collected: false,
    })
  }

  const bin: GarbageBinLayout = {
    x: width / 2,
    y: height - BIN_BOTTOM_MARGIN - BIN_HEIGHT / 2,
    width: BIN_WIDTH,
    height: BIN_HEIGHT,
  }

  return { leaves, bin }
}

export function isInsideBin(
  pos: { x: number; y: number },
  bin: GarbageBinLayout,
): boolean {
  return (
    pos.x >= bin.x - bin.width / 2 + 12 &&
    pos.x <= bin.x + bin.width / 2 - 12 &&
    pos.y >= bin.y - bin.height / 2 + 8 &&
    pos.y <= bin.y + bin.height / 2 - 4
  )
}

export function findNearestLeaf(
  pos: { x: number; y: number },
  leaves: DryLeafState[],
  radius: number,
): DryLeafState | null {
  let nearest: DryLeafState | null = null
  let best = radius

  for (const leaf of leaves) {
    if (leaf.collected) continue
    const dist = Math.hypot(pos.x - leaf.x, pos.y - leaf.y)
    if (dist <= best) {
      best = dist
      nearest = leaf
    }
  }

  return nearest
}
