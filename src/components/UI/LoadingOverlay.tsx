interface LoadingOverlayProps {
  isLoadingHandTracking: boolean
  isStartingCamera: boolean
}

export function LoadingOverlay({
  isLoadingHandTracking,
  isStartingCamera,
}: LoadingOverlayProps) {
  if (!isLoadingHandTracking && !isStartingCamera) return null

  const message =
    isLoadingHandTracking && isStartingCamera
      ? 'Loading hand tracking and starting camera…'
      : isLoadingHandTracking
        ? 'Loading hand tracking…'
        : 'Starting camera…'

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--color-bg)]/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]"
        aria-hidden
      />
      <span className="text-sm text-[var(--color-muted)]">{message}</span>
    </div>
  )
}
