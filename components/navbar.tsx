import Link from "next/link"

export default function Navbar() {
  return (
    <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800">
          <span className="text-sm font-medium">DJ</span>
        </div>
      </div>
    </header>
  )
}
