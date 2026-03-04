import { createFileRoute } from '@tanstack/react-router'

import Navbar from '../../components/navbar.tsx'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Home</h1>
      </main>
    </div>
  )
}
