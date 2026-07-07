import type { VirtualMouseCalibration } from '@/utils/virtualMouseCalibration'

interface VirtualMouseGuideProps {
  isIndexUp: boolean
  isMiddleUp: boolean
  isMoving: boolean
  calibrationStatus: 'idle' | 'sampling' | 'ready'
  calibrationProgress: number
  calibration: VirtualMouseCalibration | null
  indexLift: number
  middleLift: number
}

function TapMeter({
  label,
  lift,
  threshold,
  active,
}: {
  label: string
  lift: number
  threshold: number
  active: boolean
}) {
  const trigger = threshold
  const max = Math.max(trigger * 3, 0.03)
  const triggerPct = (trigger / max) * 100
  const liftPct = Math.min((lift / max) * 100, 100)

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-[var(--color-muted)]">{lift.toFixed(3)}</span>
        {active && (
          <span className="rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] text-white">
            Up
          </span>
        )}
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="absolute inset-y-0 w-0.5 bg-green-500/80"
          style={{ left: `${triggerPct}%` }}
        />
        <div
          className={[
            'absolute inset-y-0 left-0 rounded-full transition-all',
            active ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-muted)]',
          ].join(' ')}
          style={{ width: `${liftPct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-[var(--color-muted)]">
        Green line = tap threshold ({threshold.toFixed(3)})
      </p>
    </div>
  )
}

export function VirtualMouseGuide({
  isIndexUp,
  isMiddleUp,
  isMoving,
  calibrationStatus,
  calibrationProgress,
  calibration,
  indexLift,
  middleLift,
}: VirtualMouseGuideProps) {
  const items = [
    {
      icon: '🤚',
      label: 'Move cursor',
      pose: 'Slide your palm on the table',
      action: 'Pointer follows your palm on the desktop',
      active: isMoving && calibrationStatus === 'ready',
    },
    {
      icon: '👆',
      label: 'Left click',
      pose: 'Raise index, then put it down',
      action: 'Tap index on the table to click',
      active: isIndexUp,
    },
    {
      icon: '🖐️',
      label: 'Right click',
      pose: 'Raise middle, then put it down',
      action: 'Tap middle on the table to right-click',
      active: isMiddleUp,
    },
  ]

  return (
    <section>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
        Virtual Mouse
      </h2>

      {calibrationStatus === 'idle' && (
        <p className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Calibrate first: rest your hand flat on the table with all fingers down.
        </p>
      )}

      {calibrationStatus === 'sampling' && (
        <p className="mb-3 rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-2 text-xs text-[var(--color-text)]">
          Hold still… {Math.round(calibrationProgress * 100)}% calibrated
        </p>
      )}

      {calibrationStatus === 'ready' && (
        <p className="mb-3 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs text-green-300">
          Calibrated — lift one finger, then put it down to click.
        </p>
      )}

      {calibration && (
        <div className="mb-4 space-y-2">
          <TapMeter
            label="Index tap"
            lift={indexLift}
            threshold={calibration.tapThreshold}
            active={isIndexUp}
          />
          <TapMeter
            label="Middle tap"
            lift={middleLift}
            threshold={calibration.tapThreshold}
            active={isMiddleUp}
          />
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className={[
              'rounded-lg border px-3 py-2 transition-colors',
              item.active
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15'
                : 'border-[var(--color-border)] bg-[var(--color-bg)]',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
              {item.active && (
                <span className="ml-auto rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{item.pose}</p>
            <p className="text-xs text-[var(--color-text)]">{item.action}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
