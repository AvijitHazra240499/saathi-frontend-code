"use client"

import { Home, ShoppingBag, FileText, BarChart2, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Merchants", href: "/merchants", icon: ShoppingBag },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Articles", href: "/articles", icon: FileText },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "User", href: "/user", icon: User },
  ]

  return (
    <aside className="w-48 bg-blue-50 border-r flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-pink-500">Saathi</span>
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-blue-100 hover:text-blue-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto w-1 h-5 bg-pink-500 rounded-full" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-900">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
