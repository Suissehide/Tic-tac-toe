import { Popover } from 'radix-ui'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type Option = { value: string; label: string }

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxSelected?: number
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  maxSelected,
}: MultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const toggle = (val: string) => {
    const isSelected = value.includes(val)
    if (isSelected) {
      onChange(value.filter((v) => v !== val))
    } else if (!maxSelected || value.length < maxSelected) {
      onChange([...value, val])
    } else if (maxSelected === 1) {
      onChange([val])
    }
  }

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const selectedOptions = filteredOptions.filter((o) => value.includes(o.value))
  const unselectedOptions = filteredOptions.filter(
    (o) => !value.includes(o.value),
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex w-full h-[36px] items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm text-text"
        >
          <span className="truncate">
            {value.length > 0
              ? options
                  .filter((o) => value.includes(o.value))
                  .map((o) => o.label)
                  .join(', ')
              : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-150 w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-white shadow-md"
        >
          {/* Barre de recherche */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Options */}
          <ul className="p-1">
            {selectedOptions.map((option) => {
              const checked = true
              return (
                <li
                  key={option.value}
                  className="relative flex select-none items-center rounded text-sm hover:bg-gray-100"
                >
                  <button
                    type="button"
                    onClick={() => toggle(option.value)}
                    className="cursor-pointer flex w-full items-center justify-between rounded px-2 py-1.5"
                  >
                    <span>{option.label}</span>
                    {checked && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              )
            })}

            {selectedOptions.length > 0 && unselectedOptions.length > 0 && (
              <hr className="my-1 border-t border-gray-200" />
            )}

            {unselectedOptions.map((option) => {
              const checked = value.includes(option.value)
              return (
                <li
                  key={option.value}
                  className="relative flex select-none items-center rounded text-sm hover:bg-gray-100"
                >
                  <button
                    type="button"
                    onClick={() => toggle(option.value)}
                    className="cursor-pointer flex w-full items-center justify-between rounded px-2 py-1.5"
                  >
                    <span>{option.label}</span>
                    {checked && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
