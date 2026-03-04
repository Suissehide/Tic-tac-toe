import { type Column, flexRender, type Table } from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import type React from 'react'

import type { CustomMeta } from './reactTable.tsx'

type HeaderTableProps<TData> = {
  table: Table<TData>
  getCommonPinningStyles: (column: Column<TData>) => React.CSSProperties
}

export function HeaderTable<TData>({
  table,
  getCommonPinningStyles,
}: HeaderTableProps<TData>) {
  return (
    <thead className="sticky top-0 z-10 bg-card">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="p-4">
          {headerGroup.headers.map((header) => {
            const { column } = header
            const meta = header.column.columnDef.meta as CustomMeta<
              TData,
              unknown
            >
            const headerClass = meta?.headerClass ?? ''
            const grow = meta?.grow
            const filter = meta?.filter
            const sortState = column.getIsSorted()
            let SortIcon = (
              <ChevronsUpDown className="w-4 h-4 text-text-light" />
            )
            if (sortState === 'asc') {
              SortIcon = <ChevronUp className="w-4 h-4 text-text-light" />
            } else if (sortState === 'desc') {
              SortIcon = <ChevronDown className="w-4 h-4 text-text-light" />
            }

            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  ...getCommonPinningStyles(column),
                  width: grow ? 'auto' : header.getSize(),
                  minWidth: header.getSize(),
                }}
                className="border-b border-border"
              >
                {header.isPlaceholder ? null : (
                  <>
                    <button
                      type="button"
                      onClick={column.getToggleSortingHandler()}
                      className={`w-full flex items-center gap-4 px-4 py-2 text-sm text-text-light font-normal ${column.getCanSort() ? 'cursor-pointer' : ''}`}
                    >
                      <div className={`title-column ${headerClass}`}>
                        {flexRender(
                          column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>

                      {column.getCanSort() && <div>{SortIcon}</div>}
                    </button>

                    {column.getCanFilter() && filter ? (
                      <div className="default-filter">
                        {flexRender(filter, { column })}
                      </div>
                    ) : null}
                  </>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
