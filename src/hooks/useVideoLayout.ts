import { useEffect, useState } from 'react'
import {
  getVideoCoverLayout,
  type VideoCoverLayout,
} from '@/utils/videoLayout'

const DEFAULT_LAYOUT: VideoCoverLayout = {
  containerWidth: 1280,
  containerHeight: 720,
  videoWidth: 0,
  videoHeight: 0,
  displayWidth: 1280,
  displayHeight: 720,
  offsetX: 0,
  offsetY: 0,
}

export function useVideoLayout(
  containerRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  /** Re-run when camera stream becomes active so video dimensions are available */
  videoReady = false,
) {
  const [layout, setLayout] = useState<VideoCoverLayout>(DEFAULT_LAYOUT)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      const video = videoRef.current
      setLayout(
        getVideoCoverLayout(
          Math.floor(rect.width),
          Math.floor(rect.height),
          video?.videoWidth ?? 0,
          video?.videoHeight ?? 0,
        ),
      )
    }

    const observer = new ResizeObserver(update)
    observer.observe(container)

    const video = videoRef.current
    video?.addEventListener('loadedmetadata', update)
    video?.addEventListener('loadeddata', update)
    video?.addEventListener('playing', update)
    video?.addEventListener('resize', update)

    update()

    return () => {
      observer.disconnect()
      video?.removeEventListener('loadedmetadata', update)
      video?.removeEventListener('loadeddata', update)
      video?.removeEventListener('playing', update)
      video?.removeEventListener('resize', update)
    }
  }, [containerRef, videoRef, videoReady])

  return layout
}
