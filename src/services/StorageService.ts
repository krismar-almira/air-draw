import type { Drawing } from '@/models/Drawing'
import type { Stroke } from '@/models/Stroke'
import { STORAGE_KEY } from '@/config/constants'

export class StorageService {
  static listDrawings(): Drawing[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Drawing[]
    } catch {
      return []
    }
  }

  static saveDrawing(drawing: Drawing): void {
    const drawings = this.listDrawings()
    const index = drawings.findIndex((d) => d.id === drawing.id)
    const updated = { ...drawing, updatedAt: Date.now() }

    if (index >= 0) {
      drawings[index] = updated
    } else {
      drawings.push(updated)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings))
  }

  static loadDrawing(id: string): Drawing | null {
    return this.listDrawings().find((d) => d.id === id) ?? null
  }

  static deleteDrawing(id: string): void {
    const drawings = this.listDrawings().filter((d) => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings))
  }

  static exportAsPng(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}

export type { Stroke, Drawing }
