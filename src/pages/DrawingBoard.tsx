import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera } from '@/components/Camera/Camera'
import { DrawingCanvas } from '@/components/Canvas/DrawingCanvas'
import { DrawingToolbar } from '@/components/Canvas/DrawingToolbar'
import { LandmarkRenderer } from '@/components/HandTracking/LandmarkRenderer'
import { BrushSize } from '@/components/UI/BrushSize'
import { ColorPicker } from '@/components/UI/ColorPicker'
import { DocumentationModal } from '@/components/UI/DocumentationModal'
import { GestureGuide } from '@/components/UI/GestureGuide'
import { Toolbar } from '@/components/UI/Toolbar'
import { useCamera } from '@/hooks/useCamera'
import { useDrawing } from '@/hooks/useDrawing'
import { useGesture } from '@/hooks/useGesture'
import { useMediaPipe } from '@/hooks/useMediaPipe'
import { createDrawing } from '@/models/Drawing'
import { StorageService } from '@/services/StorageService'
import { CanvasService } from '@/services/CanvasService'
import { useVideoLayout } from '@/hooks/useVideoLayout'
import { normalizedToContainer } from '@/utils/videoLayout'

export function DrawingBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const exportCanvasRef = useRef<HTMLCanvasElement>(null)
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [docsOpen, setDocsOpen] = useState(false)
  const [fps, setFps] = useState(0)
  const [savedDrawings, setSavedDrawings] = useState(
    () => StorageService.listDrawings(),
  )
  const prevStableGestureRef = useRef<string>('none')
  const isDrawingRef = useRef(false)

  const { videoRef, error, isActive, start } = useCamera()
  const layout = useVideoLayout(containerRef, videoRef, isActive)
  const { isLoading, error: mpError, result, startDetection, stopDetection } =
    useMediaPipe(videoRef)
  const {
    strokes,
    tool,
    color,
    brushSize,
    canUndo,
    canRedo,
    setTool,
    setColor,
    setBrushSize,
    startStroke,
    continueStroke,
    endStroke,
    undo,
    redo,
    clear,
    loadStrokes,
  } = useDrawing()
  const { gesture, pendingGesture, processLandmarks } = useGesture()

  useEffect(() => {
    if (isActive && !isLoading) {
      startDetection()
      return () => stopDetection()
    }
  }, [isActive, isLoading, startDetection, stopDetection])

  useEffect(() => {
    let frames = 0
    let lastTime = performance.now()
    let raf: number

    const tick = () => {
      frames++
      const now = performance.now()
      if (now - lastTime >= 1000) {
        setFps(frames)
        frames = 0
        lastTime = now
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const landmarks = result?.landmarks?.[0] ?? null

  const handleSave = useCallback(() => {
    const canvas = exportCanvasRef.current
    if (!canvas) return

    const service = new CanvasService(canvas)
    service.resize(layout.containerWidth, layout.containerHeight)
    service.renderStrokes(strokes)

    const name = `Drawing ${savedDrawings.length + 1}`
    StorageService.exportAsPng(canvas, `${name}.png`)

    const saved = createDrawing(
      name,
      layout.containerWidth,
      layout.containerHeight,
    )
    saved.strokes = strokes
    StorageService.saveDrawing(saved)
    setSavedDrawings(StorageService.listDrawings())
  }, [layout.containerWidth, layout.containerHeight, strokes, savedDrawings.length])

  const loadDrawing = useCallback(
    (id: string) => {
      const loaded = StorageService.loadDrawing(id)
      if (loaded) loadStrokes(loaded.strokes)
    },
    [loadStrokes],
  )

  useEffect(() => {
    const landmarks = result?.landmarks?.[0] ?? null

    if (!landmarks) {
      if (isDrawingRef.current) {
        endStroke()
        isDrawingRef.current = false
      }
      processLandmarks(null)
      return
    }

    const command = processLandmarks(landmarks)
    if (!command) return

    const stableType = command.type

    if (stableType === 'draw' || stableType === 'erase') {
      if (!command.position) return

      const point = normalizedToContainer(
        command.position.x,
        command.position.y,
        layout,
      )

      if (stableType === 'erase') setTool('eraser')
      else if (tool === 'eraser') setTool('brush')

      if (!isDrawingRef.current) {
        startStroke(point)
        isDrawingRef.current = true
      } else {
        continueStroke(point)
      }
    } else if (isDrawingRef.current) {
      endStroke()
      isDrawingRef.current = false
    }

    if (stableType !== prevStableGestureRef.current) {
      if (stableType === 'clear') clear()
      if (stableType === 'undo') undo()
      if (stableType === 'redo') redo()
      prevStableGestureRef.current = stableType
    }
  }, [
    result,
    layout,
    processLandmarks,
    startStroke,
    continueStroke,
    endStroke,
    clear,
    undo,
    redo,
    setTool,
    tool,
  ])

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        gesture={gesture.type}
        pendingGesture={pendingGesture}
        fps={fps}
        isLoading={isLoading}
        showLandmarks={showLandmarks}
        onToggleLandmarks={() => setShowLandmarks((v) => !v)}
        onOpenDocs={() => setDocsOpen(true)}
      />

      <DocumentationModal open={docsOpen} onClose={() => setDocsOpen(false)} />

      {(mpError || error) && (
        <div className="bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {mpError ?? error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <main ref={containerRef} className="relative flex-1">
          <Camera
            videoRef={videoRef}
            error={error}
            isActive={isActive}
            onStart={start}
          />
          <DrawingCanvas
            strokes={strokes}
            width={layout.containerWidth}
            height={layout.containerHeight}
          />
          {showLandmarks && (
            <LandmarkRenderer landmarks={landmarks} layout={layout} />
          )}
        </main>

        <aside className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <GestureGuide
            activeGesture={gesture.type}
            pendingGesture={pendingGesture}
          />

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Tools
            </h2>
            <DrawingToolbar
              tool={tool}
              color={color}
              brushSize={brushSize}
              canUndo={canUndo}
              canRedo={canRedo}
              onToolChange={setTool}
              onColorChange={setColor}
              onBrushSizeChange={setBrushSize}
              onUndo={undo}
              onRedo={redo}
              onClear={clear}
              onSave={handleSave}
            />
          </section>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Color
            </h2>
            <ColorPicker color={color} onChange={setColor} />
          </section>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Brush Size
            </h2>
            <BrushSize size={brushSize} onChange={setBrushSize} />
          </section>

          <section>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Saved Drawings
            </h2>
            {savedDrawings.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No saved drawings yet.</p>
            ) : (
              <ul className="space-y-1">
                {savedDrawings.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => loadDrawing(d.id)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--color-border)]"
                    >
                      {d.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <canvas ref={exportCanvasRef} className="hidden" />
    </div>
  )
}
