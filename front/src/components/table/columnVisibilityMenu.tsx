// import { Menu, MenuItem } from '@mui/material'
// import { flexRender } from '@tanstack/react-table'
// import { ChevronDown, ChevronsUp } from 'lucide-react'
// import { useEffect, useState } from 'react'
//
// import { Button } from '../ui/button.tsx'

// export const ColumnVisibilityMenu = ({ table, initialColumnVisibility }) => {
//   const [anchorEl, setAnchorEl] = useState(null)
//   const [columnVisibility, setColumnVisibility] = useState({}) // L'état qui garde track de la visibilité des colonnes
//   const open = Boolean(anchorEl)
//
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }
//
//   const handleClose = () => {
//     setAnchorEl(null)
//   }
//
//   useEffect(() => {
//     const initialVisibility = initialColumnVisibility ?? {}
//     if (initialVisibility) {
//       return
//     }
//
//     for (const column of table.getAllLeafColumns()) {
//       initialVisibility[column.id] = !column.columnDef.meta?.canHideDynamically
//     }
//     setColumnVisibility(initialVisibility)
//   }, [table, initialColumnVisibility])
//
//   const handleVisibilityChange = (columnId, checked) => {
//     setColumnVisibility((prevVisibility) => {
//       if (prevVisibility[columnId] === checked) {
//         return prevVisibility
//       }
//       return {
//         ...prevVisibility,
//         [columnId]: checked,
//       }
//     })
//   }
//
//   useEffect(() => {
//     for (const column of table.getAllLeafColumns()) {
//       if (columnVisibility[column.id] !== undefined) {
//         column.toggleVisibility(columnVisibility[column.id])
//       }
//     }
//   }, [columnVisibility, table])
//
//   const columns = table
//     .getAllLeafColumns()
//     .filter((col) => col.columnDef.meta?.canHideDynamically)
//
//   return columns.length ? (
//     <>
//       <Button onClick={handleClick} variant="default" size="default">
//         Afficher plus de colonnes
//         {open ? <ChevronDown /> : <ChevronsUp />}
//       </Button>
//
//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {columns.map((column) => (
//           <MenuItem
//             key={column.id}
//             onClick={() =>
//               handleVisibilityChange(column.id, !columnVisibility[column.id])
//             }
//           >
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={column.getIsVisible()}
//                   onChange={(e) =>
//                     handleVisibilityChange(column.id, e.target.checked)
//                   }
//                 />
//               }
//               label={
//                 typeof column.columnDef.header === 'string'
//                   ? column.columnDef.header
//                   : flexRender(column.columnDef.header, column.getContext())
//               }
//             />
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   ) : null
// }
