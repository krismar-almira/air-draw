export type AppTab = 'draw' | 'mouse' | 'captcha'

interface AppTabsProps {
  active: AppTab
  onChange: (tab: AppTab) => void
}

export function AppTabs({ active, onChange }: AppTabsProps) {
  const tabs: { id: AppTab; label: string }[] = [
    { id: 'draw', label: 'Air Draw' },
    { id: 'mouse', label: 'Virtual Mouse' },
    { id: 'captcha', label: 'Pinch Captcha' },
  ]

  return (
    <nav className="flex shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'px-5 py-2.5 text-sm font-medium transition-colors',
            active === tab.id
              ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-text)]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
