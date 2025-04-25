import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Welcome to Saathi Dashboard</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/merchants">View Merchants</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">View Products</Link>
        </Button>
      </div>
    </div>
  )
}
