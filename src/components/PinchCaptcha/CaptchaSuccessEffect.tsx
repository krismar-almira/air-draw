import type { CaptchaItem } from '@/models/CaptchaItem'
import type { CaptchaMode } from '@/models/CaptchaItem'
import { CaptchaFireworks } from '@/components/PinchCaptcha/CaptchaFireworks'
import './CaptchaOverlay.css'

const CONFETTI = ['🎉', '✨', '🎊', '⭐', '💫', '🌟', '🎈', '🏆']

interface CaptchaSuccessEffectProps {
  item: CaptchaItem
  mode: CaptchaMode
  message?: string
}

export function CaptchaSuccessEffect({ item, mode, message }: CaptchaSuccessEffectProps) {
  const subtitle =
    message ??
    (mode === 'garbage'
      ? `${item.label} collected — thanks for cleaning up! ♻️`
      : `${item.label} delivered safely 🎉`)

  return (
    <div className="captcha-success-backdrop absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="captcha-success-flash pointer-events-none absolute inset-0 bg-green-400/25" />

      <CaptchaFireworks />

      {CONFETTI.map((emoji, i) => (
        <span
          key={i}
          className="captcha-confetti pointer-events-none absolute text-3xl"
          style={{
            left: `${8 + (i * 11) % 84}%`,
            top: `${12 + (i * 7) % 30}%`,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${1.1 + (i % 3) * 0.2}s`,
          }}
        >
          {emoji}
        </span>
      ))}

      <div className="captcha-success-ring pointer-events-none absolute h-40 w-40 rounded-full border-4 border-green-400/60" />

      <div className="captcha-success-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 px-10 py-8 text-center shadow-2xl ring-4 ring-white/40">
        <div className="captcha-success-shine pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative">
          <p className="text-5xl">{mode === 'garbage' ? '🍂' : item.emoji}</p>
          <div className="captcha-success-stamp mx-auto mt-3 inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/20 px-4 py-1.5">
            <span className="text-xl">✓</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Verified
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white drop-shadow-sm">
            Congratulations!
          </h2>
          <p className="mt-2 text-lg font-semibold text-white/95">You are human.</p>
          <p className="mt-3 text-sm text-white/75">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
