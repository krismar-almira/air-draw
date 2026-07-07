import type { MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera } from '@/components/Camera/Camera'
import { LandmarkRenderer } from '@/components/HandTracking/LandmarkRenderer'
import { VirtualCursor } from '@/components/VirtualMouse/VirtualCursor'
import { VirtualMouseGuide } from '@/components/VirtualMouse/VirtualMouseGuide'
import { LoadingOverlay } from '@/components/UI/LoadingOverlay'
import { useAirMouse } from '@/hooks/useAirMouse'
import { useCamera } from '@/hooks/useCamera'
import { useMediaPipe } from '@/hooks/useMediaPipe'
import { useVideoLayout } from '@/hooks/useVideoLayout'
import { mapHandToSurface } from '@/utils/virtualMouseMath'

export function VirtualMouseDemo() {
  const cameraRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const [desktopSize, setDesktopSize] = useState({ width: 800, height: 600 })
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [leftClicks, setLeftClicks] = useState(0)
  const [rightClicks, setRightClicks] = useState(0)
  const [lastEvent, setLastEvent] = useState('Calibrate your flat hand pose to begin')
  const [clickFlash, setClickFlash] = useState<'left' | 'right' | null>(null)
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)
  const cursorPixelRef = useRef<{ x: number; y: number } | null>(null)
  const [displayCursor, setDisplayCursor] = useState<{ x: number; y: number } | null>(null)

  const { videoRef, error, isActive, start } = useCamera()
  const layout = useVideoLayout(cameraRef, videoRef, isActive)
  const { isLoading, error: mpError, result, startDetection, stopDetection } =
    useMediaPipe(videoRef)
  const {
    cursor,
    isIndexUp,
    isMiddleUp,
    indexLift,
    middleLift,
    calibrationStatus,
    calibrationProgress,
    calibration,
    processLandmarks,
    startCalibration,
  } = useAirMouse()

  useEffect(() => {
    const desktop = desktopRef.current
    if (!desktop) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect
      setDesktopSize({ width: Math.floor(width), height: Math.floor(height) })
    })
    observer.observe(desktop)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isActive && !isLoading) {
      startDetection()
      return () => stopDetection()
    }
  }, [isActive, isLoading, startDetection, stopDetection])

  const fireClickAtCursor = useCallback((button: 'left' | 'right') => {
    const pos = cursorPixelRef.current
    const desktop = desktopRef.current
    if (!pos || !desktop) return

    const rect = desktop.getBoundingClientRect()
    const screenX = rect.left + pos.x
    const screenY = rect.top + pos.y

    const stack = document.elementsFromPoint(screenX, screenY)
    const clickable = stack.find(
      (el) => el instanceof HTMLElement && el.closest('[data-vm-click]'),
    ) as HTMLElement | undefined
    const target = clickable?.closest('[data-vm-click]') as HTMLElement | null

    if (target) {
      if (button === 'left') {
        target.click()
      } else {
        target.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: screenX,
            clientY: screenY,
            button: 2,
          }),
        )
      }
    }
  }, [])

  const updateHover = useCallback((pos: { x: number; y: number }) => {
    const desktop = desktopRef.current
    if (!desktop) return

    const rect = desktop.getBoundingClientRect()
    const target = document.elementFromPoint(rect.left + pos.x, rect.top + pos.y)
    const clickable = target?.closest('[data-vm-click]') as HTMLElement | null
    const label = clickable?.dataset.vmLabel ?? null
    setHoverLabel(label)
    if (label) setLastEvent(`Over: ${label}`)
  }, [])

  useEffect(() => {
    const landmarks = result?.landmarks?.[0] ?? null
    if (!landmarks) {
      return
    }

    const frame = processLandmarks(landmarks)

    if (frame.cursor) {
      const pos = mapHandToSurface(
        frame.cursor.x,
        frame.cursor.y,
        desktopSize.width,
        desktopSize.height,
      )
      cursorPixelRef.current = pos
      setDisplayCursor(pos)
      updateHover(pos)
    } else if (cursorPixelRef.current) {
      updateHover(cursorPixelRef.current)
    }

    if (frame.lastClick === 'left') {
      setLeftClicks((n) => n + 1)
      setLastEvent('Left click detected')
      setClickFlash('left')
      fireClickAtCursor('left')
    } else if (frame.lastClick === 'right') {
      setRightClicks((n) => n + 1)
      setLastEvent('Right click detected')
      setClickFlash('right')
      fireClickAtCursor('right')
    } else if (calibrationStatus === 'sampling') {
      setLastEvent(`Calibrating… ${Math.round(calibrationProgress * 100)}%`)
    } else if (calibrationStatus !== 'ready') {
      setLastEvent('Rest hand flat, then tap Calibrate')
    } else if (frame.action === 'move' && !hoverLabel) {
      setLastEvent('Moving cursor…')
    } else if (!frame.isIndexUp && !frame.isMiddleUp && !hoverLabel) {
      setLastEvent('Slide palm to move, tap fingers to click')
    }
  }, [
    result,
    desktopSize,
    processLandmarks,
    fireClickAtCursor,
    updateHover,
    calibrationStatus,
    calibrationProgress,
  ])

  useEffect(() => {
    if (!clickFlash) return
    const t = setTimeout(() => setClickFlash(null), 400)
    return () => clearTimeout(t)
  }, [clickFlash])

  const landmarks = result?.landmarks?.[0] ?? null

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold tracking-tight">Virtual Mouse</h1>
          <p className="truncate text-xs text-[var(--color-muted)]">{lastEvent}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setShowLandmarks((v) => !v)}
          className={[
            'rounded-md px-2.5 py-1 text-xs transition-colors',
            showLandmarks
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-muted)]',
          ].join(' ')}
        >
          Landmarks
        </button>
        <button
          type="button"
          onClick={() => {
            startCalibration()
            setLastEvent('Hold hand flat on the table…')
          }}
          disabled={!landmarks || calibrationStatus === 'sampling'}
          className="rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white transition-opacity disabled:opacity-40"
        >
          {calibrationStatus === 'ready' ? 'Recalibrate' : 'Calibrate'}
        </button>
        </div>
      </header>

      {(mpError || error) && (
        <div className="bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {mpError ?? error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div
            ref={cameraRef}
            className="relative h-48 shrink-0 border-b border-[var(--color-border)] lg:h-auto lg:w-80 lg:border-b-0 lg:border-r"
          >
            <Camera videoRef={videoRef} error={error} onStart={start} />
            <LoadingOverlay
              isLoadingHandTracking={isLoading}
              isStartingCamera={!isActive && !error}
            />
            {showLandmarks && (
              <LandmarkRenderer landmarks={landmarks} layout={layout} />
            )}
          </div>

          <div
            ref={desktopRef}
            className="relative flex-1 overflow-hidden bg-[#e8ecf4]"
          >
            <VirtualCursor
              x={displayCursor?.x ?? 0}
              y={displayCursor?.y ?? 0}
              visible={displayCursor !== null && calibrationStatus === 'ready'}
              isIndexUp={isIndexUp}
              clickFlash={clickFlash}
            />

            {calibrationStatus !== 'ready' && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#e8ecf4]/90 p-6">
                <div className="max-w-sm rounded-xl border border-[#c5cdd9] bg-white p-6 text-center shadow-lg">
                  <h2 className="text-base font-semibold text-[#334155]">
                    {calibrationStatus === 'sampling' ? 'Calibrating…' : 'Calibrate your hand'}
                  </h2>
                  <p className="mt-2 text-sm text-[#64748b]">
                    {calibrationStatus === 'sampling'
                      ? 'Keep your hand flat on the table with all fingers down.'
                      : 'Place your hand flat on the table with all fingers resting, then tap Calibrate.'}
                  </p>
                  {calibrationStatus === 'sampling' && (
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                        style={{ width: `${calibrationProgress * 100}%` }}
                      />
                    </div>
                  )}
                  {calibrationStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={() => {
                        startCalibration()
                        setLastEvent('Hold hand flat on the table…')
                      }}
                      disabled={!landmarks}
                      className="mt-4 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                    >
                      Calibrate
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="absolute inset-0 p-8">
              <div className="mx-auto flex h-full max-w-2xl flex-col rounded-xl border border-[#c5cdd9] bg-[#f4f6fa] shadow-inner">
                <div className="flex items-center gap-2 border-b border-[#c5cdd9] px-4 py-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-[#64748b]">Virtual Desktop</span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
                  <p className="text-center text-sm text-[#64748b]">
                    Slide your palm to move the pointer. Tap index down for left-click, or
                    tap middle down for right-click.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <DesktopButton
                      label="Open"
                      vmLabel="Open"
                      variant="primary"
                      hovered={hoverLabel === 'Open'}
                      onClick={() => setLastEvent('Open — left clicked!')}
                    />
                    <DesktopButton
                      label="Settings"
                      vmLabel="Settings"
                      variant="secondary"
                      hovered={hoverLabel === 'Settings'}
                      onClick={() => setLastEvent('Settings — left clicked!')}
                    />
                    <DesktopButton
                      label="Menu"
                      vmLabel="Menu"
                      variant="secondary"
                      hovered={hoverLabel === 'Menu'}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setLastEvent('Menu — right clicked!')
                      }}
                    />
                  </div>

                  <div
                    data-vm-click
                    data-vm-label="Text field"
                    className={[
                      'w-full max-w-sm rounded-lg border bg-white px-4 py-3 text-sm text-[#334155] shadow-sm transition-colors',
                      hoverLabel === 'Text field'
                        ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                        : 'border-[#c5cdd9]',
                    ].join(' ')}
                    onClick={() => setLastEvent('Text field — left clicked!')}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setLastEvent('Text field — right clicked!')
                    }}
                  >
                    Click or right-click this area…
                  </div>

                  <div className="flex gap-6 text-xs text-[#64748b]">
                    <span>
                      Left: <strong className="text-[#334155]">{leftClicks}</strong>
                    </span>
                    <span>
                      Right: <strong className="text-[#334155]">{rightClicks}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:flex">
          <VirtualMouseGuide
            isIndexUp={isIndexUp}
            isMiddleUp={isMiddleUp}
            isMoving={cursor !== null}
            calibrationStatus={calibrationStatus}
            calibrationProgress={calibrationProgress}
            calibration={calibration}
            indexLift={indexLift}
            middleLift={middleLift}
          />
        </aside>
      </div>
    </div>
  )
}

function DesktopButton({
  label,
  vmLabel,
  variant,
  hovered,
  onClick,
  onContextMenu,
}: {
  label: string
  vmLabel: string
  variant: 'primary' | 'secondary'
  hovered?: boolean
  onClick?: () => void
  onContextMenu?: (e: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      data-vm-click
      data-vm-label={vmLabel}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={[
        'rounded-lg px-4 py-2 text-sm font-medium transition-all',
        variant === 'primary'
          ? 'bg-[var(--color-accent)] text-white'
          : 'border border-[#c5cdd9] bg-white text-[#334155]',
        hovered ? 'ring-2 ring-[var(--color-accent)] ring-offset-2' : '',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
