import {
  GESTURE_DEBOUNCE_MS,
  GESTURE_DRAW_DEBOUNCE_MS,
} from '@/config/constants'
import { Modal } from '@/components/UI/Modal'
import {
  ClearHandIllustration,
  DebounceExampleIllustration,
  DrawExampleIllustration,
  DrawHandIllustration,
  EraseHandIllustration,
  HandLandmarksIllustration,
  LayerStackIllustration,
  MediaPipeDownstreamIllustration,
  MediaPipeInitIllustration,
  MediaPipeLoopIllustration,
  PipelineIllustration,
} from '@/components/UI/DocIllustrations'

interface DocumentationModalProps {
  open: boolean
  onClose: () => void
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="mb-3 text-base font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--color-muted)]">
        {children}
      </div>
    </section>
  )
}

function ExampleCard({
  title,
  illustration,
  steps,
}: {
  title: string
  illustration: React.ReactNode
  steps: string[]
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <p className="mb-3 text-sm font-medium text-[var(--color-text)]">{title}</p>
      <div className="mb-3">{illustration}</div>
      <ol className="list-decimal space-y-1 pl-4 text-xs">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}

export function DocumentationModal({ open, onClose }: DocumentationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Air Draw — Documentation">
      <Section title="Overview">
        <p>
          Air Draw is a browser-based drawing app. Point your webcam at your hand,
          make gestures, and draw in the air. Everything runs locally — no server,
          no uploads.
        </p>
        <LayerStackIllustration />
      </Section>

      <Section title="How it works">
        <p>Each frame, your hand goes through this pipeline:</p>
        <PipelineIllustration />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--color-text)]">Camera</strong> — mirrored
            webcam feed fills the main area.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">MediaPipe</strong> — AI
            detects 21 hand landmarks (knuckles, fingertips).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Gestures</strong> — finger
            positions map to actions (draw, erase, clear).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Debounce</strong> — hold the
            pose briefly so accidental motions don&apos;t trigger actions.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Canvas</strong> — index
            fingertip position becomes stroke points on the overlay.
          </li>
        </ul>
      </Section>

      <Section title="MediaPipe pipeline (detailed)">
        <p>
          MediaPipe is Google&apos;s hand-tracking AI. It runs entirely in your browser
          using WebAssembly and GPU — no server, no video upload. Its job is simple:
          find your hand in each video frame and return <strong className="text-[var(--color-text)]">21 landmark points</strong>.
        </p>

        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text)]">
          Phase 1 — One-time initialization
        </p>
        <MediaPipeInitIllustration />
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>
            <strong className="text-[var(--color-text)]">Load WASM</strong> — WebAssembly
            runtime fetched from CDN (<code className="text-[var(--color-text)]">@mediapipe/tasks-vision</code>).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Load model</strong> — Pre-trained
            neural network (<code className="text-[var(--color-text)]">hand_landmarker.task</code>).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Create HandLandmarker</strong> — Configured
            for VIDEO mode, 1 hand, GPU acceleration.
          </li>
          <li>
            Header shows <strong className="text-[var(--color-text)]">Loading hand tracking…</strong>{' '}
            until this finishes.
          </li>
        </ol>

        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text)]">
          Phase 2 — Detection loop (~60 FPS)
        </p>
        <MediaPipeLoopIllustration />
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>
            <strong className="text-[var(--color-text)]">Read frame</strong> — Current webcam
            image from the <code className="text-[var(--color-text)]">&lt;video&gt;</code> element.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">detectForVideo()</strong> — Passes frame +
            timestamp to MediaPipe (VIDEO mode needs timestamps for tracking).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Neural network</strong> — GPU runs inference
            (~5–15ms per frame).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Output</strong> — 21 normalized points per
            detected hand, or empty if no hand visible.
          </li>
        </ol>

        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text)]">
          Phase 3 — The 21 landmarks
        </p>
        <HandLandmarksIllustration />
        <p>
          Each point has coordinates <code className="text-[var(--color-text)]">x, y</code> from{' '}
          <strong className="text-[var(--color-text)]">0 to 1</strong> relative to the video frame
          (not the browser window). Key points used by Air Draw:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text)]">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Landmark</th>
                <th className="py-2">Used for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr><td className="py-1.5 pr-3">0</td><td className="py-1.5 pr-3">Wrist</td><td className="py-1.5">Reference for finger extension</td></tr>
              <tr><td className="py-1.5 pr-3">4</td><td className="py-1.5 pr-3">Thumb tip</td><td className="py-1.5">Pinch detection (erase)</td></tr>
              <tr><td className="py-1.5 pr-3 font-semibold text-[var(--color-accent)]">8</td><td className="py-1.5 pr-3 font-semibold text-[var(--color-text)]">Index tip</td><td className="py-1.5 font-semibold text-[var(--color-text)]">Drawing position</td></tr>
              <tr><td className="py-1.5 pr-3">6, 10, 14, 18</td><td className="py-1.5 pr-3">Finger joints</td><td className="py-1.5">Extended vs bent detection</td></tr>
              <tr><td className="py-1.5 pr-3">All 21</td><td className="py-1.5 pr-3">Full skeleton</td><td className="py-1.5">Purple overlay dots (Landmarks toggle)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text)]">
          Phase 4 — After MediaPipe (app logic)
        </p>
        <MediaPipeDownstreamIllustration />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--color-text)]">Gestures</strong> — Finger states derived
            from landmarks (index up = draw, pinch = erase, fist = clear).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Debounce</strong> — Gesture must be held
            before activating ({GESTURE_DRAW_DEBOUNCE_MS}–{GESTURE_DEBOUNCE_MS}ms).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Screen mapping</strong> — Normalized coords
            converted to canvas pixels (accounts for mirrored video + crop).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Canvas</strong> — Index tip path becomes
            visible strokes.
          </li>
        </ul>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs">
          <p className="font-medium text-[var(--color-text)]">Where it runs</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>WASM runtime → browser</li>
            <li>Neural network → GPU (WebGL)</li>
            <li>Model file → downloaded once from Google CDN</li>
            <li>Your video → never leaves your device</li>
          </ul>
        </div>
      </Section>

      <Section title="Gesture confirmation">
        <p>
          When you change pose, the sidebar shows <strong className="text-[var(--color-text)]">Hold…</strong>{' '}
          until the gesture is confirmed, then <strong className="text-[var(--color-text)]">Active</strong>.
        </p>
        <DebounceExampleIllustration />
        <ul className="list-disc space-y-1 pl-5">
          <li>Draw &amp; erase: hold for {GESTURE_DRAW_DEBOUNCE_MS}ms</li>
          <li>Clear &amp; other actions: hold for {GESTURE_DEBOUNCE_MS}ms</li>
        </ul>
      </Section>

      <Section title="Gestures with examples">
        <div className="grid gap-4 sm:grid-cols-2">
          <ExampleCard
            title="☝️ Draw — index finger up"
            illustration={<DrawHandIllustration />}
            steps={[
              'Raise only your index finger.',
              `Hold the pose for ~${GESTURE_DRAW_DEBOUNCE_MS}ms until "Active" appears.`,
              'Move your finger slowly to draw a line.',
              'Lower other fingers or change pose to stop drawing.',
            ]}
          />
          <ExampleCard
            title="🤏 Erase — pinch thumb + index"
            illustration={<EraseHandIllustration />}
            steps={[
              'Touch thumb tip to index tip (pinch).',
              'Hold until erase mode is active.',
              'Move pinch over strokes you want to remove.',
              'Release pinch to stop erasing.',
            ]}
          />
          <ExampleCard
            title="✊ Clear — closed fist"
            illustration={<ClearHandIllustration />}
            steps={[
              'Close all fingers into a fist.',
              `Hold for ~${GESTURE_DEBOUNCE_MS}ms.`,
              'The entire canvas clears instantly.',
              'Use sidebar Undo if you clear by mistake.',
            ]}
          />
          <ExampleCard
            title="Example: draw a curve"
            illustration={<DrawExampleIllustration />}
            steps={[
              'Activate draw mode with index finger up.',
              'Start at one point in the air.',
              'Move smoothly along an arc.',
              'Change pose to lift your pen.',
            ]}
          />
        </div>
      </Section>

      <Section title="Getting started">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open the app and click <strong className="text-[var(--color-text)]">Allow</strong> when the browser asks for camera access.</li>
          <li>Wait for <strong className="text-[var(--color-text)]">Loading hand tracking…</strong> to finish in the header.</li>
          <li>Position your hand in the center of the video — palm facing the camera works best.</li>
          <li>Enable <strong className="text-[var(--color-text)]">Landmarks</strong> in the header to see purple tracking dots on your hand.</li>
          <li>Try the draw gesture: index up → hold → move → draw your first line.</li>
        </ol>
      </Section>

      <Section title="Manual controls (sidebar)">
        <p>You don&apos;t need gestures for these — use the sidebar anytime:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text)]">
                <th className="py-2 pr-4">Control</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr><td className="py-2 pr-4">✏️ Brush</td><td className="py-2">Switch to draw mode</td></tr>
              <tr><td className="py-2 pr-4">🧹 Eraser</td><td className="py-2">Switch to erase mode</td></tr>
              <tr><td className="py-2 pr-4">Color / size</td><td className="py-2">Change stroke appearance</td></tr>
              <tr><td className="py-2 pr-4">↩ ↪</td><td className="py-2">Undo / redo strokes</td></tr>
              <tr><td className="py-2 pr-4">🗑 Clear</td><td className="py-2">Remove all strokes</td></tr>
              <tr><td className="py-2 pr-4">💾 Save PNG</td><td className="py-2">Download image + save to browser storage</td></tr>
              <tr><td className="py-2 pr-4">Saved list</td><td className="py-2">Click a name to reload a drawing</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Tips & troubleshooting">
        <ul className="list-disc space-y-2 pl-5">
          <li>Use even, front-facing light — shadows make detection harder.</li>
          <li>Keep your full hand inside the video frame.</li>
          <li>Move smoothly; jerky motion creates shaky lines (smoothing helps but has limits).</li>
          <li>If landmark dots drift after resizing the window, refresh the page.</li>
          <li>If drawing doesn&apos;t start, hold index up a bit longer until the gesture guide shows Active.</li>
          <li>Pinch erase works best when thumb and index tips clearly touch in view.</li>
        </ul>
      </Section>
    </Modal>
  )
}
