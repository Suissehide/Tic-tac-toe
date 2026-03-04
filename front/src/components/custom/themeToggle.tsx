import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
  const [isDay, setIsDay] = useState(true)

  const handleToggle = () => {
    setIsDay(!isDay)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative cursor-pointer flex items-center justify-between p-2 w-16 bg-card rounded-full border-border focus:outline-none transition duration-300 ease-in-out"
    >
      <span
        className={`absolute left-1 w-7.5 h-7 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${
          isDay ? 'translate-x-0' : 'translate-x-6.5'
        }`}
      />
      <Sun
        className={`z-1 w-5 h-5 text-text transition-opacity delay-100 duration-100 ease-in-out ${
          isDay ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <Moon
        className={`z-1 w-5 h-5 text-text transition-opacity delay-100 duration-100 ease-in-out ${
          isDay ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </button>
  )
}

export default ThemeToggle
