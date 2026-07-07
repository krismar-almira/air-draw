# Air Draw

Draw in the air with hand gestures — a client-side AI air drawing board powered by MediaPipe hand tracking.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — fast dev server and static deploys
- **MediaPipe Tasks Vision** — hand landmark detection
- **HTML5 Canvas** — drawing layer
- **Tailwind CSS** — styling

No backend. Deploy anywhere static files are served (GitHub Pages, Netlify, Vercel).

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Allow camera access when prompted.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run oxlint               |

## Project Structure

```
src/
├── components/
│   ├── Camera/          # Webcam feed (Phase 2)
│   ├── Canvas/          # Drawing canvas & toolbar (Phase 5–6)
│   ├── HandTracking/    # MediaPipe & gestures (Phase 3–4)
│   └── UI/              # Shared UI controls
├── hooks/               # useCamera, useMediaPipe, useDrawing, useGesture
├── models/              # Point, Stroke, Gesture, Drawing
├── services/            # Hand tracking, canvas, localStorage
├── utils/               # Geometry, smoothing, gesture math
├── pages/               # DrawingBoard main page
└── config/              # Constants & CDN paths
```

## Development Phases

| Phase | Feature | Status |
| ----- | ------- | ------ |
| 1 | MVP scaffold (no backend) | ✅ |
| 2 | Camera — live mirrored webcam | ✅ |
| 3 | MediaPipe — 21 hand landmarks | ✅ |
| 4 | Gesture recognition (draw, erase, clear, undo, redo, save) | ✅ |
| 5 | Canvas drawing with brush & eraser | ✅ |
| 6 | Toolbar UI | ✅ |
| 7 | Local storage — save & reopen drawings | ✅ |
| 8 | Polish — FPS, dark mode, loading states | 🔲 |
| 9 | Advanced — shapes, infinite canvas, laser pointer, etc. | 🔲 |

## Gestures

| Gesture | Hand pose | Action |
| ------- | --------- | ------ |
| Draw | Index finger up | Draw on canvas |
| Erase | Pinch (thumb + index) | Eraser |
| Move | Index + middle up | Move (future) |
| Clear | Fist | Clear canvas |
| Save | Open palm | Export PNG + save to localStorage |

## Deploy

```bash
npm run build
```

Upload the `dist/` folder to your static host, or connect the repo to Vercel/Netlify for automatic deploys.

## License

MIT
