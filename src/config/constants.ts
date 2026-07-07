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

/** Thumb–index distance below this = pinch (erase) */
export const PINCH_THRESHOLD = 0.045

/** Thumb–index must be at least this far apart to count as draw */
export const DRAW_MIN_PINCH_DISTANCE = 0.07

/** Finger must stay raised this long before tap-down counts as a click */
export const FINGER_TAP_MIN_UP_MS = 50

/** Minimum gap between virtual mouse clicks */
export const VIRTUAL_MOUSE_CLICK_COOLDOWN_MS = 150

/** Palm movement multiplier — small hand slides move the cursor farther */
export const VIRTUAL_MOUSE_MOVE_GAIN = 4

/** Frames sampled while hand rests flat during calibration */
export const VIRTUAL_MOUSE_CALIBRATION_FRAMES = 30

/** Tap lift above rest (tip Z/Y) to count finger as raised — keep low for table taps */
export const VIRTUAL_MOUSE_TAP_THRESHOLD = 0.008

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
