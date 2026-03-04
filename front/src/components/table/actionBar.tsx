const ActionBar = () => {
  // const handleExportData = (columns, data, filename = 'export') => {
  //   const selectedIndices = Object.keys(rowSelection)
  //     .filter((key) => rowSelection[key])
  //     .map((key) => Number.parseInt(key, 10))
  //
  //   const selectedData = Object.keys(rowSelection).length
  //     ? selectedIndices.map((i) => data[i])
  //     : data
  //
  //   const filteredColumns = columns.filter((col) => col.accessorKey)
  //   const headers = filteredColumns.map((col) => col.header || col.accessorKey)
  //
  //   const csvRows = [
  //     headers.join(';'),
  //     ...selectedData.map((row) =>
  //       filteredColumns
  //         .map((col) => {
  //           const rawValue = col.meta?.onExport
  //             ? col.meta.onExport(row)
  //             : row[col.accessorKey]
  //           const safe = (rawValue ?? '').toString().replace(/"/g, '""')
  //           return `"${safe}"`
  //         })
  //         .join(';'),
  //     ),
  //   ]
  //
  //   const bom = '\uFEFF'
  //   const csvContent = bom + csvRows.join('\n')
  //
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //   const url = URL.createObjectURL(blob)
  //
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `${filename}.csv`)
  //   link.style.display = 'none'
  //
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  //   URL.revokeObjectURL(url)
  // }

  return <div className="above-table" />
}

export { ActionBar }
