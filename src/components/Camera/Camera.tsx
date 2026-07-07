import { useEffect, useRef } from 'react'
import './Camera.css'

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  error: string | null
  onStart: () => void
}

export function Camera({ videoRef, error, onStart }: CameraProps) {
  const hasRequested = useRef(false)

  useEffect(() => {
    if (!hasRequested.current) {
      hasRequested.current = true
      onStart()
    }
  }, [onStart])

  if (error) {
    return (
      <div className="camera-error">
        <p className="camera-error__title">Camera unavailable</p>
        <p className="camera-error__message">{error}</p>
        <button type="button" className="camera-error__retry" onClick={onStart}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="camera">
      <video
        ref={videoRef}
        className="camera__video"
        playsInline
        muted
        autoPlay
      />
    </div>
  )
}
