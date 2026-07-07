import { useCallback, useState } from 'react'
import type { Point } from '@/models/Point'
import { createStroke } from '@/models/Stroke'
import type { Stroke } from '@/models/Stroke'
import {
  DEFAULT_BRUSH_COLOR,
  DEFAULT_BRUSH_SIZE,
  DEFAULT_ERASER_SIZE,
} from '@/config/constants'

export type DrawingTool = 'brush' | 'eraser'

export function useDrawing() {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [activeStroke, setActiveStroke] = useState<Stroke | null>(null)
  const [undoStack, setUndoStack] = useState<Stroke[][]>([])
  const [redoStack, setRedoStack] = useState<Stroke[][]>([])
  const [color, setColor] = useState(DEFAULT_BRUSH_COLOR)
  const [brushSize, setBrushSize] = useState(DEFAULT_BRUSH_SIZE)
  const [tool, setTool] = useState<DrawingTool>('brush')

  const pushUndo = useCallback((current: Stroke[]) => {
    setUndoStack((prev) => [...prev, current])
    setRedoStack([])
  }, [])

  const startStroke = useCallback(
    (point: Point, strokeTool: DrawingTool = tool) => {
      const size = strokeTool === 'eraser' ? DEFAULT_ERASER_SIZE : brushSize
      const stroke = createStroke(color, size, strokeTool)
      stroke.points.push(point)
      setActiveStroke(stroke)
    },
    [color, brushSize, tool],
  )

  const continueStroke = useCallback((point: Point) => {
    setActiveStroke((prev) => {
      if (!prev) return prev
      return { ...prev, points: [...prev.points, point] }
    })
  }, [])

  const endStroke = useCallback(() => {
    setActiveStroke((current) => {
      if (!current || current.points.length < 2) return null

      setStrokes((prev) => {
        pushUndo(prev)
        return [...prev, current]
      })
      return null
    })
  }, [pushUndo])

  const undo = useCallback(() => {
    setStrokes((current) => {
      if (undoStack.length === 0) return current
      const previous = undoStack[undoStack.length - 1]!
      setUndoStack((stack) => stack.slice(0, -1))
      setRedoStack((stack) => [...stack, current])
      return previous
    })
  }, [undoStack])

  const redo = useCallback(() => {
    setStrokes((current) => {
      if (redoStack.length === 0) return current
      const next = redoStack[redoStack.length - 1]!
      setRedoStack((stack) => stack.slice(0, -1))
      setUndoStack((stack) => [...stack, current])
      return next
    })
  }, [redoStack])

  const clear = useCallback(() => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev
      pushUndo(prev)
      return []
    })
    setActiveStroke(null)
  }, [pushUndo])

  const loadStrokes = useCallback((loaded: Stroke[]) => {
    setStrokes(loaded)
    setActiveStroke(null)
    setUndoStack([])
    setRedoStack([])
  }, [])

  const allStrokes = activeStroke ? [...strokes, activeStroke] : strokes

  return {
    strokes: allStrokes,
    color,
    brushSize,
    tool,
    setColor,
    setBrushSize,
    setTool,
    startStroke,
    continueStroke,
    endStroke,
    undo,
    redo,
    clear,
    loadStrokes,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  }
}
