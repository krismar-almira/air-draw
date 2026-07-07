import type { CaptchaMode } from '@/models/CaptchaItem'
import { LEAF_COUNT } from '@/utils/captchaLeafLayout'

interface CaptchaInstructionsProps {
  mode: CaptchaMode
  solved: boolean
  leavesCollected?: number
}

export function CaptchaInstructions({
  mode,
  solved,
  leavesCollected = 0,
}: CaptchaInstructionsProps) {
  if (solved) return null

  if (mode === 'garbage') {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
        <p className="max-w-md rounded-full border border-white/15 bg-black/40 px-5 py-2 text-center text-sm text-white/90 shadow-lg backdrop-blur-md">
          Pick the leaves, put them in the trash — make the world a little cleaner 🍂
          <span className="ml-2 text-white/50">
            ({leavesCollected}/{LEAF_COUNT})
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
      <p className="rounded-full border border-white/15 bg-black/40 px-5 py-2 text-center text-sm text-white/90 shadow-lg backdrop-blur-md">
        Pinch the buddy and bring it to the nest
      </p>
    </div>
  )
}
