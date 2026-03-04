import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, Filter } from 'lucide-react'

import { cn } from '../../libs/utils.ts'
import { Button } from './button'

const DropdownFilter = ({
  filters,
  onFilterChange,
}: {
  filters: { id: string; label: string; checked: boolean }[]
  onFilterChange: (id: string, checked: boolean) => void
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="outline"
          size="default"
          className="font-normal rounded-lg"
        >
          <Filter size={16} />
          Filtres
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-primary-foreground rounded shadow-md border border-border p-2 z-50"
          align="end"
          sideOffset={5}
        >
          {filters.map((filter) => (
            <DropdownMenu.CheckboxItem
              key={filter.id}
              checked={filter.checked}
              onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
              onSelect={(e) => e.preventDefault()}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded cursor-pointer outline-none',
                'hover:bg-primary/20',
              )}
            >
              <div className="w-4 h-4 border border-primary rounded flex items-center justify-center">
                {filter.checked && (
                  <Check size={12} strokeWidth={3} className="text-primary" />
                )}
              </div>
              <span className="flex-1 text-sm select-none">{filter.label}</span>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropdownFilter
