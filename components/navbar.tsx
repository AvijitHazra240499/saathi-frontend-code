import Link from "next/link"

export default function Navbar() {
  return (
    <header className="border-b bg-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-pink-500">Saathi</div>
        </Link>
        <h1 className="text-lg font-medium">Merchants</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800">
          <span className="text-sm font-medium">DJ</span>
        </div>
      </div>
    </header>
  )
}
