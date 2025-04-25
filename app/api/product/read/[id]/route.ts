import { NextResponse } from "next/server"

// In a real application, this would connect to a database
const products = [
  {
    id: "P000001",
    name: "Lovely Red Shoes",
    description: "Really lovely red leather shoes",
    merchantId: "M000001",
    price: 15000.0,
    packingCharge: 50.0,
    deliveryCharge: 150.0,
    offerType: "Affiliate",
    parameters: [
      { name: "Material", value: "Leather" },
      { name: "Colour", value: "Red" },
    ],
  },
  {
    id: "P000002",
    name: "Blue Denim Jeans",
    description: "Comfortable blue denim jeans",
    merchantId: "M000001",
    price: 2500.0,
    packingCharge: 30.0,
    deliveryCharge: 100.0,
    offerType: "Affiliate",
    parameters: [
      { name: "Material", value: "Denim" },
      { name: "Colour", value: "Blue" },
    ],
  },
  // More products...
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
