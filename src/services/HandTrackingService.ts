import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision'
import {
  HAND_LANDMARKER_MODEL,
  MEDIAPIPE_WASM_PATH,
} from '@/config/constants'

export class HandTrackingService {
  private landmarker: HandLandmarker | null = null

  async initialize(): Promise<void> {
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_PATH)

    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: HAND_LANDMARKER_MODEL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
    })
  }

  detectForVideo(
    video: HTMLVideoElement,
    timestampMs: number,
  ): HandLandmarkerResult | null {
    if (!this.landmarker || video.readyState < 2) return null
    return this.landmarker.detectForVideo(video, timestampMs)
  }

  close(): void {
    this.landmarker?.close()
    this.landmarker = null
  }

  isReady(): boolean {
    return this.landmarker !== null
  }
}
