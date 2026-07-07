import { useCallback, useEffect, useRef, useState } from 'react'
import { CaptchaInstructions } from '@/components/PinchCaptcha/CaptchaInstructions'
import { CaptchaModePicker } from '@/components/PinchCaptcha/CaptchaModePicker'
import { CaptchaOverlay } from '@/components/PinchCaptcha/CaptchaOverlay'
import { LeafCaptchaOverlay } from '@/components/PinchCaptcha/LeafCaptchaOverlay'
import { Camera } from '@/components/Camera/Camera'
import { LandmarkRenderer } from '@/components/HandTracking/LandmarkRenderer'
import { LoadingOverlay } from '@/components/UI/LoadingOverlay'
import { useCamera } from '@/hooks/useCamera'
import { useMediaPipe } from '@/hooks/useMediaPipe'
import { usePinchDrag } from '@/hooks/usePinchDrag'
import { useVideoLayout } from '@/hooks/useVideoLayout'
import type { CaptchaItem, CaptchaMode } from '@/models/CaptchaItem'
import { randomCaptchaCharacter } from '@/utils/captchaCharacters'
import {
  createScreenLayout,
  GRAB_DISTANCE,
  isAtTarget,
  isNearPoint,
  mapPinchToScreen,
} from '@/utils/captchaLayout'
import {
  createGarbageLeafLayout,
  findNearestLeaf,
  isInsideBin,
  LEAF_COUNT,
  LEAF_GRAB_DISTANCE,
  type DryLeafState,
  type GarbageBinLayout,
} from '@/utils/captchaLeafLayout'

export function PinchCaptchaDemo() {
  const cameraRef = useRef<HTMLDivElement>(null)
  const piecePosRef = useRef({ x: 80, y: 200 })
  const targetPosRef = useRef({ x: 400, y: 200 })
  const isDraggingRef = useRef(false)
  const leavesRef = useRef<DryLeafState[]>([])
  const binRef = useRef<GarbageBinLayout>({ x: 0, y: 0, width: 0, height: 0 })
  const activeLeafIdRef = useRef<number | null>(null)
  const layoutReady = useRef(false)

  const [mode, setMode] = useState<CaptchaMode>('delivery')
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [piecePos, setPiecePos] = useState({ x: 80, y: 200 })
  const [targetPos, setTargetPos] = useState({ x: 400, y: 200 })
  const [leaves, setLeaves] = useState<DryLeafState[]>([])
  const [bin, setBin] = useState<GarbageBinLayout>({ x: 400, y: 500, width: 168, height: 112 })
  const [activeLeafId, setActiveLeafId] = useState<number | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [pinchPos, setPinchPos] = useState<{ x: number; y: number } | null>(null)
  const [solved, setSolved] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [item, setItem] = useState<CaptchaItem>(() => randomCaptchaCharacter())

  const { videoRef, error, isActive, start } = useCamera()
  const layout = useVideoLayout(cameraRef, videoRef, isActive)
  const { isLoading, error: mpError, result, startDetection, stopDetection } =
    useMediaPipe(videoRef)
  const { isPinching, processLandmarks, reset: resetPinch } = usePinchDrag()

  piecePosRef.current = piecePos
  targetPosRef.current = targetPos
  isDraggingRef.current = isDragging
  leavesRef.current = leaves
  binRef.current = bin
  activeLeafIdRef.current = activeLeafId

  const spawnDelivery = useCallback((width: number, height: number) => {
    const positions = createScreenLayout(width, height)
    setPiecePos(positions.piece)
    setTargetPos(positions.target)
    piecePosRef.current = positions.piece
    targetPosRef.current = positions.target
    setItem(randomCaptchaCharacter())
  }, [])

  const spawnGarbage = useCallback((width: number, height: number) => {
    const layout = createGarbageLeafLayout(width, height)
    setLeaves(layout.leaves)
    setBin(layout.bin)
    leavesRef.current = layout.leaves
    binRef.current = layout.bin
    setActiveLeafId(null)
    activeLeafIdRef.current = null
    setDragPos(null)
  }, [])

  const spawnObjects = useCallback(
    (width: number, height: number, nextMode: CaptchaMode = mode) => {
      if (nextMode === 'garbage') {
        spawnGarbage(width, height)
      } else {
        spawnDelivery(width, height)
      }
    },
    [mode, spawnDelivery, spawnGarbage],
  )

  const resetPuzzle = useCallback(
    (nextMode?: CaptchaMode) => {
      const activeMode = nextMode ?? mode
      spawnObjects(containerSize.width, containerSize.height, activeMode)
      setSolved(false)
      setIsDragging(false)
      isDraggingRef.current = false
      setPinchPos(null)
      resetPinch()
    },
    [containerSize.width, containerSize.height, mode, resetPinch, spawnObjects],
  )

  const handleModeChange = useCallback(
    (nextMode: CaptchaMode) => {
      setMode(nextMode)
      resetPuzzle(nextMode)
    },
    [resetPuzzle],
  )

  useEffect(() => {
    const container = cameraRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect
      setContainerSize({ width: Math.floor(width), height: Math.floor(height) })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0 && !layoutReady.current) {
      spawnObjects(containerSize.width, containerSize.height)
      layoutReady.current = true
    }
  }, [containerSize.width, containerSize.height, spawnObjects])

  useEffect(() => {
    if (isActive && !isLoading) {
      startDetection()
      return () => stopDetection()
    }
  }, [isActive, isLoading, startDetection, stopDetection])

  useEffect(() => {
    if (!solved) return
    const t = setTimeout(() => resetPuzzle(), 4000)
    return () => clearTimeout(t)
  }, [solved, resetPuzzle])

  useEffect(() => {
    const landmarks = result?.landmarks?.[0] ?? null
    if (!landmarks || solved) return
    if (layout.displayWidth <= 0) return

    const frame = processLandmarks(landmarks)

    if (mode === 'delivery') {
      if (frame.isPinching && frame.pinchCenter) {
        const screen = mapPinchToScreen(frame.pinchCenter.x, frame.pinchCenter.y, layout)
        setPinchPos(screen)

        if (
          !isDraggingRef.current &&
          isNearPoint(screen, piecePosRef.current, GRAB_DISTANCE)
        ) {
          setIsDragging(true)
          isDraggingRef.current = true
        }

        if (isDraggingRef.current) {
          setPiecePos(screen)
          piecePosRef.current = screen
        }
      } else {
        setPinchPos(null)
      }

      if (frame.pinchEnded && isDraggingRef.current) {
        setIsDragging(false)
        isDraggingRef.current = false
        if (isAtTarget(piecePosRef.current, targetPosRef.current)) {
          setPiecePos(targetPosRef.current)
          piecePosRef.current = targetPosRef.current
          setSolved(true)
        }
      }
      return
    }

    // Garbage: collect dry leaves
    if (frame.isPinching && frame.pinchCenter) {
      const screen = mapPinchToScreen(frame.pinchCenter.x, frame.pinchCenter.y, layout)
      setPinchPos(screen)

      if (!isDraggingRef.current) {
        const leaf = findNearestLeaf(screen, leavesRef.current, LEAF_GRAB_DISTANCE)
        if (leaf) {
          setActiveLeafId(leaf.id)
          activeLeafIdRef.current = leaf.id
          setIsDragging(true)
          isDraggingRef.current = true
          setDragPos(screen)
        }
      } else if (activeLeafIdRef.current !== null) {
        setDragPos(screen)
      }
    } else {
      setPinchPos(null)
    }

    if (frame.pinchEnded && isDraggingRef.current && activeLeafIdRef.current !== null) {
      const screen = dragPos ?? pinchPos
      setIsDragging(false)
      isDraggingRef.current = false

      if (screen && isInsideBin(screen, binRef.current)) {
        const nextLeaves = leavesRef.current.map((leaf) =>
          leaf.id === activeLeafIdRef.current ? { ...leaf, collected: true } : leaf,
        )
        setLeaves(nextLeaves)
        leavesRef.current = nextLeaves

        const collected = nextLeaves.filter((l) => l.collected).length
        if (collected >= LEAF_COUNT) {
          setSolved(true)
        }
      }

      setActiveLeafId(null)
      activeLeafIdRef.current = null
      setDragPos(null)
    }
  }, [result, layout, solved, processLandmarks, mode, dragPos, pinchPos])

  const landmarks = result?.landmarks?.[0] ?? null
  const leavesCollected = leaves.filter((l) => l.collected).length
  const nearTarget =
    mode === 'garbage'
      ? !solved && isDragging && dragPos !== null && isInsideBin(dragPos, bin)
      : !solved && isDragging && isAtTarget(piecePos, targetPos)

  return (
    <div ref={cameraRef} className="relative h-full w-full overflow-hidden bg-black">
      <Camera videoRef={videoRef} error={error} onStart={start} />
      <LoadingOverlay
        isLoadingHandTracking={isLoading}
        isStartingCamera={!isActive && !error}
      />

      <LandmarkRenderer
        landmarks={landmarks}
        layout={layout}
        pinchActive={isPinching}
      />

      <CaptchaInstructions
        mode={mode}
        solved={solved}
        leavesCollected={leavesCollected}
      />

      {mode === 'delivery' ? (
        <CaptchaOverlay
          piecePos={piecePos}
          targetPos={targetPos}
          pinchPos={pinchPos}
          isPinching={isPinching}
          isDragging={isDragging}
          solved={solved}
          item={item}
        />
      ) : (
        <LeafCaptchaOverlay
          leaves={leaves}
          bin={bin}
          activeLeafId={activeLeafId}
          dragPos={dragPos}
          isDragging={isDragging}
          isPinching={isPinching}
          pinchPos={pinchPos}
          binHighlight={nearTarget}
          solved={solved}
          collectedCount={leavesCollected}
        />
      )}

      <CaptchaModePicker mode={mode} onChange={handleModeChange} disabled={isDragging} />

      {(mpError || error) && (
        <div className="absolute bottom-16 left-1/2 z-30 max-w-sm -translate-x-1/2 rounded-lg bg-red-500/90 px-4 py-2 text-center text-sm text-white">
          {mpError ?? error}
        </div>
      )}
    </div>
  )
}
