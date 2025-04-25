import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

// In a real application, this would connect to a database
const products: Product[] = []

export async function POST(request: Request) {
  try {
    const product = await request.json()

    // Validate required fields
    if (!product.name || !product.description || !product.merchantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate ID if not provided
    if (!product.id) {
      const lastId = products.length > 0 ? Number.parseInt(products[products.length - 1].id.substring(1)) : 0
      product.id = `P${String(lastId + 1).padStart(6, "0")}`
    }

    products.push(product)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
