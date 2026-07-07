interface LoadingOverlayProps {
  isLoadingHandTracking: boolean
  isStartingCamera: boolean
}

export function LoadingOverlay({
  isLoadingHandTracking,
  isStartingCamera,
}: LoadingOverlayProps) {
  if (!isLoadingHandTracking && !isStartingCamera) return null

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)]/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]"
        aria-hidden
      />

      <div className="flex flex-col items-center gap-2 text-sm text-[var(--color-muted)]">
        {isLoadingHandTracking && (
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Loading hand tracking…
          </p>
        )}
        {isStartingCamera && (
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Starting camera…
          </p>
        )}
      </div>
    </div>
  )
}
