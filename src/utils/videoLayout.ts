export interface VideoCoverLayout {
  containerWidth: number
  containerHeight: number
  videoWidth: number
  videoHeight: number
  displayWidth: number
  displayHeight: number
  offsetX: number
  offsetY: number
}

export function getVideoCoverLayout(
  containerWidth: number,
  containerHeight: number,
  videoWidth: number,
  videoHeight: number,
): VideoCoverLayout {
  const base: VideoCoverLayout = {
    containerWidth,
    containerHeight,
    videoWidth,
    videoHeight,
    displayWidth: containerWidth,
    displayHeight: containerHeight,
    offsetX: 0,
    offsetY: 0,
  }

  if (
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    videoWidth <= 0 ||
    videoHeight <= 0
  ) {
    return base
  }

  const containerAspect = containerWidth / containerHeight
  const videoAspect = videoWidth / videoHeight

  if (containerAspect > videoAspect) {
    base.displayWidth = containerWidth
    base.displayHeight = containerWidth / videoAspect
    base.offsetY = (containerHeight - base.displayHeight) / 2
  } else {
    base.displayHeight = containerHeight
    base.displayWidth = containerHeight * videoAspect
    base.offsetX = (containerWidth - base.displayWidth) / 2
  }

  return base
}

/** Map normalized video coords (0–1) to container pixel coords matching object-fit: cover */
export function normalizedToContainer(
  x: number,
  y: number,
  layout: VideoCoverLayout,
  mirrored = true,
): { x: number; y: number } {
  return {
    x: layout.offsetX + (mirrored ? 1 - x : x) * layout.displayWidth,
    y: layout.offsetY + y * layout.displayHeight,
  }
}
