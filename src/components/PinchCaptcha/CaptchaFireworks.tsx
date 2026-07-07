const BURSTS = [
  { x: '22%', y: '28%', delay: 0, color: '#f97316' },
  { x: '78%', y: '22%', delay: 0.35, color: '#eab308' },
  { x: '50%', y: '18%', delay: 0.7, color: '#ec4899' },
  { x: '35%', y: '65%', delay: 1.05, color: '#22c55e' },
  { x: '68%', y: '58%', delay: 1.4, color: '#38bdf8' },
  { x: '50%', y: '72%', delay: 0.55, color: '#a855f7' },
]

const PARTICLES_PER_BURST = 14

export function CaptchaFireworks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BURSTS.map((burst, burstIndex) =>
        Array.from({ length: PARTICLES_PER_BURST }, (_, particleIndex) => {
          const angle = (360 / PARTICLES_PER_BURST) * particleIndex
          return (
            <span
              key={`${burstIndex}-${particleIndex}`}
              className="captcha-firework-particle"
              style={{
                left: burst.x,
                top: burst.y,
                ['--angle' as string]: `${angle}deg`,
                ['--color' as string]: burst.color,
                animationDelay: `${burst.delay + particleIndex * 0.015}s`,
              }}
            />
          )
        }),
      )}
      {BURSTS.map((burst, i) => (
        <span
          key={`flash-${i}`}
          className="captcha-firework-flash"
          style={{
            left: burst.x,
            top: burst.y,
            ['--color' as string]: burst.color,
            animationDelay: `${burst.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
