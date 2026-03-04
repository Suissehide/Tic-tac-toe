import {
  type Column,
  flexRender,
  type Row,
  type Table,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type React from 'react'
import { type RefObject, useEffect } from 'react'

import type { CustomMeta } from './reactTable.tsx'

type VirtualizedBodyTableProps<TData> = {
  table: Table<TData>
  getCommonPinningStyles: (column: Column<TData>) => React.CSSProperties
  rowHeight: number
  parentRef: RefObject<HTMLElement | null>
}

export function VirtualizedBodyTable<TData>({
  table,
  getCommonPinningStyles,
  rowHeight,
  parentRef,
}: VirtualizedBodyTableProps<TData>) {
  const rows = table.getRowModel().rows
  const rowCount = rows.length

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0

  useEffect(() => {
    rowVirtualizer.scrollToIndex(0)
    rowVirtualizer.measure()
  }, [rowVirtualizer])

  if (rowCount === 0) {
    return (
      <tbody>
        <tr className="h-[20em] bg-primary-foreground text-sm border-b border-border text-center">
          <td colSpan={table.getAllLeafColumns().length}>Pas de données</td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr style={{ height: paddingTop }}>
          <td colSpan={table.getAllLeafColumns().length} />
        </tr>
      )}

      {virtualRows.map((virtualRow) => {
        const row: Row<TData> = rows[virtualRow.index]

        return (
          <tr
            data-index={virtualRow.index} // needed for dynamic row height measurement
            ref={(node) => {
              if (node) {
                rowVirtualizer.measureElement(node)
              }
            }} // measure dynamic row height
            key={row.id}
            style={{ height: rowHeight }}
          >
            {row.getVisibleCells().map((cell) => {
              const { column } = cell
              const meta = column.columnDef.meta as CustomMeta<TData, unknown>
              const grow = meta?.grow

              return (
                <td
                  key={cell.id}
                  className="px-4 py-2 border-b border-border text-sm"
                  style={{
                    ...getCommonPinningStyles(column),
                    width: grow ? 'auto' : column.getSize(),
                    minWidth: column.getSize(),
                    height: rowHeight,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}

      {paddingBottom > 0 && (
        <tr style={{ height: paddingBottom }}>
          <td colSpan={table.getAllLeafColumns().length} />
        </tr>
      )}
    </tbody>
  )
}
