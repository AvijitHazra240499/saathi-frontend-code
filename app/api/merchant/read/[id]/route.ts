import { NextResponse } from "next/server"

// In a real application, this would connect to a database
const merchants = [
  {
    id: "M000001",
    name: "Amazon",
    logoUrl: "https://www.amazon.com/logo",
    checkoutUrl: "https://www.amazon.com/checkout",
    type: "affiliate",
    shopifyId: "-",
    shopifyTerms: "-",
    shopifyEnabled: true,
    added: "2023-01-01",
  },
  {
    id: "M000002",
    name: "Flipkart",
    logoUrl: "https://www.flipkart.com/logo",
    checkoutUrl: "https://www.flipkart.com/checkout",
    type: "affiliate",
    shopifyId: "-",
    shopifyTerms: "-",
    shopifyEnabled: true,
    added: "2023-01-02",
  },
  // More merchants...
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const merchant = merchants.find((m) => m.id === id)

    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    return NextResponse.json(merchant)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchant" }, { status: 500 })
  }
}
