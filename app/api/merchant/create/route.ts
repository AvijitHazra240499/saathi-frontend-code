import { NextResponse } from "next/server"
import type { Merchant } from "@/types/merchant"

// In a real application, this would connect to a database
const merchants: Merchant[] = []

export async function POST(request: Request) {
  try {
    const merchant = await request.json()

    // Validate required fields
    if (!merchant.name || !merchant.logoUrl || !merchant.merchantUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate ID if not provided
    if (!merchant.id) {
      const lastId = merchants.length > 0 ? Number.parseInt(merchants[merchants.length - 1].id.substring(1)) : 0
      merchant.id = `M${String(lastId + 1).padStart(6, "0")}`
    }

    merchants.push(merchant)

    return NextResponse.json(merchant, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create merchant" }, { status: 500 })
  }
}
