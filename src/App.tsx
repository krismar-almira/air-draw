import { useState } from 'react'
import { AppTabs, type AppTab } from '@/components/UI/AppTabs'
import { DrawingBoard } from '@/pages/DrawingBoard'
import { PinchCaptchaDemo } from '@/pages/PinchCaptchaDemo'
import { VirtualMouseDemo } from '@/pages/VirtualMouseDemo'

function TabPanel({ tab }: { tab: AppTab }) {
  switch (tab) {
    case 'draw':
      return <DrawingBoard />
    case 'mouse':
      return <VirtualMouseDemo />
    case 'captcha':
      return <PinchCaptchaDemo />
  }
}

export default function App() {
  const [tab, setTab] = useState<AppTab>('draw')

  return (
    <div className="flex h-full flex-col">
      <AppTabs active={tab} onChange={setTab} />
      <div className="flex-1 overflow-hidden">
        <TabPanel tab={tab} />
      </div>
    </div>
  )
}
