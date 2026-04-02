import { create } from 'zustand'

type ThemeChoice = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  theme: ThemeChoice
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeChoice) => void
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolve(choice: ThemeChoice): ResolvedTheme {
  return choice === 'system' ? getSystemTheme() : choice
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
}

const stored = (typeof localStorage !== 'undefined'
  ? (localStorage.getItem('zewbie-theme') as ThemeChoice | null)
  : null) ?? 'system'

const initialResolved = resolve(stored)
if (typeof document !== 'undefined') applyTheme(initialResolved)

export const useThemeStore = create<ThemeState>((set) => ({
  theme: stored,
  resolvedTheme: initialResolved,
  setTheme: (theme) => {
    const resolvedTheme = resolve(theme)
    localStorage.setItem('zewbie-theme', theme)
    applyTheme(resolvedTheme)
    set({ theme, resolvedTheme })
  },
}))

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.theme === 'system') {
      const resolvedTheme = getSystemTheme()
      applyTheme(resolvedTheme)
      useThemeStore.setState({ resolvedTheme })
    }
  })
}
