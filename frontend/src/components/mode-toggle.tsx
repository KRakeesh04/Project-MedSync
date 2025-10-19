import { Moon, Sun, Monitor } from "lucide-react"

import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const modes = ["system", "dark", "light"] as const
  type Mode = (typeof modes)[number]

  const idx = modes.indexOf((theme as Mode) ?? "system")

  const next = () => {
    const nextIdx = (idx + 1) % modes.length
    setTheme(modes[nextIdx])
  }

  const rotation = idx === 0 ? 0 : idx === 1 ? -90 : 90

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Toggle theme (current: ${theme})`}
      className="cursor-pointer h-9 w-9 rounded-md flex items-center justify-center"
    >
      <Icon
        size={20}
        className="transition-transform duration-300"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}