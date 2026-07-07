import { useEffect, useRef } from 'react'
import { Camera } from '@/components/Camera/Camera'
import { LandmarkRenderer } from '@/components/HandTracking/LandmarkRenderer'
import { useCamera } from '@/hooks/useCamera'
import { useMediaPipe } from '@/hooks/useMediaPipe'
import { useVideoLayout } from '@/hooks/useVideoLayout'

export function HandTrackingDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { videoRef, error, isActive, start } = useCamera()
  const layout = useVideoLayout(containerRef, videoRef, isActive)
  const { isLoading, error: mpError, result, startDetection, stopDetection } =
    useMediaPipe(videoRef)

  useEffect(() => {
    if (isActive && !isLoading) {
      startDetection()
      return () => stopDetection()
    }
  }, [isActive, isLoading, startDetection, stopDetection])

  const landmarks = result?.landmarks?.[0] ?? null
  const handDetected = landmarks !== null

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">Air Draw</h1>
        {isLoading && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Loading hand tracking…
          </p>
        )}
        {!isLoading && !mpError && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {handDetected ? 'Hand detected' : 'Show your hand to the camera'}
          </p>
        )}
      </header>

      {(mpError || error) && (
        <div className="bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {mpError ?? error}
        </div>
      )}

      <main ref={containerRef} className="relative flex-1">
        <Camera videoRef={videoRef} error={error} onStart={start} />
        {!isLoading && (
          <LandmarkRenderer landmarks={landmarks} layout={layout} />
        )}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--color-bg)]/80">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
            <span className="text-sm text-[var(--color-muted)]">
              Loading hand tracking…
            </span>
          </div>
        )}
      </main>
    </div>
  )
}
