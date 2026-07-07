import { useCallback, useEffect, useRef, useState } from 'react'

export interface CameraState {
  stream: MediaStream | null
  error: string | null
  isActive: boolean
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isActive: false,
  })

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setState({ stream, error: null, isActive: true })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Camera access denied'
      setState({ stream: null, error: message, isActive: false })
    }
  }, [])

  const stop = useCallback(() => {
    state.stream?.getTracks().forEach((track) => track.stop())
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState({ stream: null, error: null, isActive: false })
  }, [state.stream])

  useEffect(() => {
    return () => {
      state.stream?.getTracks().forEach((track) => track.stop())
    }
  }, [state.stream])

  return { videoRef, ...state, start, stop }
}
