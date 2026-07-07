export type GestureType =
  | 'draw'
  | 'move'
  | 'erase'
  | 'clear'
  | 'undo'
  | 'redo'
  | 'none'

export type CommandType = GestureType

export interface FingerState {
  indexExtended: boolean
  middleExtended: boolean
  ringExtended: boolean
  pinkyExtended: boolean
  thumbExtended: boolean
  pinch: boolean
  fist: boolean
  openPalm: boolean
}

export interface Gesture {
  type: GestureType
  confidence: number
  position?: { x: number; y: number }
}

export interface Command {
  type: CommandType
  /** Instant detection before debounce */
  detectedType: CommandType
  timestamp: number
  position?: { x: number; y: number }
}

export function createDefaultFingerState(): FingerState {
  return {
    indexExtended: false,
    middleExtended: false,
    ringExtended: false,
    pinkyExtended: false,
    thumbExtended: false,
    pinch: false,
    fist: false,
    openPalm: false,
  }
}
