import type { CaptchaItem } from '@/models/CaptchaItem'

export const GARBAGE_ITEMS: CaptchaItem[] = [
  { emoji: '🥤', label: 'Plastic cup', gradient: 'from-sky-300 via-blue-400 to-indigo-600' },
  { emoji: '🍌', label: 'Banana peel', gradient: 'from-yellow-300 via-amber-400 to-yellow-600' },
  { emoji: '📰', label: 'Crumbled paper', gradient: 'from-gray-200 via-gray-400 to-gray-600' },
  { emoji: '🥡', label: 'Takeout box', gradient: 'from-orange-200 via-red-300 to-red-500' },
  { emoji: '🧃', label: 'Juice box', gradient: 'from-lime-300 via-green-400 to-emerald-600' },
  { emoji: '🍕', label: 'Pizza box', gradient: 'from-amber-200 via-orange-400 to-red-500' },
  { emoji: '🧴', label: 'Empty bottle', gradient: 'from-teal-200 via-cyan-400 to-blue-500' },
  { emoji: '🍬', label: 'Candy wrapper', gradient: 'from-pink-300 via-fuchsia-400 to-purple-600' },
]

export function randomGarbageItem(): CaptchaItem {
  return GARBAGE_ITEMS[Math.floor(Math.random() * GARBAGE_ITEMS.length)]!
}
