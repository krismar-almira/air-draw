export const MEDIAPIPE_WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

export const HAND_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export const STORAGE_KEY = 'air-draw-drawings'

export const DEFAULT_BRUSH_COLOR = '#6366f1'
export const DEFAULT_BRUSH_SIZE = 4
export const DEFAULT_ERASER_SIZE = 24

/** How long a gesture must be held before tool/action changes */
export const GESTURE_DEBOUNCE_MS = 400

/** Shorter hold time for continuous draw/erase gestures */
export const GESTURE_DRAW_DEBOUNCE_MS = 150

export const BRUSH_SIZES = [2, 4, 8, 12, 20] as const

export const COLOR_PALETTE = [
  '#6366f1',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#a855f7',
  '#ffffff',
  '#000000',
] as const
