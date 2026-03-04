import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import { safeParse } from '../../libs/utils.ts'
import {
  dateFilterFn,
  dateRangeFilterFn,
  multiSelectFilterFn,
  numberFilterFn,
  numberRangeFilterFn,
  selectFilterFn,
  textFilterFn,
} from './filtersFns'
import { HeaderTable } from './headerTable.js'
import { VirtualizedBodyTable } from './virtualizedBodyTable'

export type CustomMeta<TData, TValue> = {
  pin?: 'left' | 'right'
  headerClass?: string
  grow?: boolean
  filter?: FC<{ column: Column<TData, TValue> }>
}

type CustomColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: CustomMeta<TData, TValue>
}

type ReactTableProps<TData extends { id: string }> = {
  columns: CustomColumnDef<TData, any>[]
  data: TData[]
  customButtons?: ReactNode[]
  title?: string
  customHeader?: (rows: Row<TData>[]) => ReactNode
  filterId?: string
  infiniteScroll?: boolean
}

export function ReactTable<TData extends { id: string }>({
  columns,
  data,
  title,
  customHeader,
  filterId = 'default',
  infiniteScroll = true,
}: ReactTableProps<TData>) {
  const initialColumnFilters = safeParse(
    localStorage.getItem(`filters/${filterId}`),
    [],
  )
  const initialColumnVisibility = safeParse(
    localStorage.getItem(`column-visibility/${filterId}`),
    {},
  )

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(infiniteScroll ? {} : { pagination }),
    },
    filterFns: {
      text: textFilterFn,
      number: numberFilterFn,
      range: numberRangeFilterFn,
      date: dateFilterFn,
      dateRange: dateRangeFilterFn,
      select: selectFilterFn,
      multiSelect: multiSelectFilterFn,
    },
    defaultColumn: {
      size: 150,
      minSize: 0,
    },
    globalFilterFn: textFilterFn,
    manualPagination: false,
    onPaginationChange: infiniteScroll ? undefined : setPagination,
    getPaginationRowModel: infiniteScroll ? undefined : getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableRowSelection: true,
    enableColumnPinning: true,
    autoResetPageIndex: false,
    //
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  })

  useEffect(() => {
    localStorage.setItem(`filters/${filterId}`, JSON.stringify(columnFilters))
  }, [columnFilters, filterId])

  useEffect(() => {
    localStorage.setItem(
      `column-visibility/${filterId}`,
      JSON.stringify(columnVisibility),
    )
  }, [columnVisibility, filterId])

  const getCommonPinningStyles = <TData,>(
    column: Column<TData, unknown>,
  ): CSSProperties => {
    const isPinned = column.getIsPinned()

    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? 1 : 0,
      backgroundColor: isPinned ? 'var(--color-bg)' : 'transparent',
    }
  }

  useEffect(() => {
    for (const column of table.getAllLeafColumns()) {
      const meta = column.columnDef.meta as CustomMeta<TData, unknown>
      const pin = meta?.pin
      if (pin) {
        column.pin(pin)
      }
    }
  }, [table])

  const totalRows = table.getFilteredRowModel().rows.length
  const tableContainerRef = useRef(null)

  return (
    <div className="flex flex-col h-full">
      {title && <div className="px-4 mb-4 text-2xl font-bold">{title}</div>}

      <div className="react-table__filter">
        <div className="above-table__container">
          {/*<ColumnVisibilityMenu*/}
          {/*  table={table}*/}
          {/*  initialColumnVisibility={initialColumnVisibility}*/}
          {/*/>*/}
        </div>

        {customHeader?.(table.getRowModel().rows)}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="h-full w-full overflow-auto" ref={tableContainerRef}>
          <table className="layout-table table table-fixed w-full border-collapse mb-2">
            <HeaderTable
              table={table}
              getCommonPinningStyles={getCommonPinningStyles}
            />

            <VirtualizedBodyTable
              table={table}
              getCommonPinningStyles={getCommonPinningStyles}
              parentRef={tableContainerRef}
              rowHeight={40}
            />
          </table>
        </div>
      </div>

      <div className="w-full flex justify-end py-3 px-3">
        <div className="text-sm text-text-light">
          {table.getRowCount().toLocaleString()}{' '}
          {totalRows > 1 ? 'résultats' : 'résultat'}
        </div>
      </div>
    </div>
  )
}

export default ReactTable
