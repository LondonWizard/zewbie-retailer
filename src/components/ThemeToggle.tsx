import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore } from '../lib/theme'

const options = [
  { value: 'light' as const, icon: Sun, label: 'Light' },
  { value: 'dark' as const, icon: Moon, label: 'Dark' },
  { value: 'system' as const, icon: Monitor, label: 'System' },
]

/** Cycles through light / dark / system themes on click */
export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  const cycle = () => {
    const idx = options.findIndex((o) => o.value === theme)
    setTheme(options[(idx + 1) % options.length].value)
  }

  const current = options.find((o) => o.value === theme) ?? options[0]
  const Icon = current.icon

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Theme: ${current.label}`}
    >
      <Icon size={18} />
    </button>
  )
}
