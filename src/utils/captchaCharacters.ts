export const CAPTCHA_CHARACTERS = [
  { emoji: '🚀', label: 'Rocket', gradient: 'from-orange-400 via-red-500 to-purple-600' },
  { emoji: '🐸', label: 'Frog', gradient: 'from-lime-400 via-green-500 to-emerald-700' },
  { emoji: '🦄', label: 'Unicorn', gradient: 'from-pink-400 via-purple-500 to-indigo-600' },
  { emoji: '🎈', label: 'Balloon', gradient: 'from-sky-300 via-blue-400 to-indigo-500' },
  { emoji: '⭐', label: 'Star', gradient: 'from-yellow-300 via-amber-400 to-orange-500' },
  { emoji: '🍕', label: 'Pizza', gradient: 'from-yellow-400 via-orange-500 to-red-500' },
  { emoji: '👾', label: 'Alien', gradient: 'from-violet-400 via-purple-600 to-fuchsia-700' },
  { emoji: '🌮', label: 'Taco', gradient: 'from-lime-300 via-yellow-400 to-orange-500' },
] as const

export type CaptchaCharacter = (typeof CAPTCHA_CHARACTERS)[number]

export function randomCaptchaCharacter(): CaptchaCharacter {
  return CAPTCHA_CHARACTERS[Math.floor(Math.random() * CAPTCHA_CHARACTERS.length)]!
}
