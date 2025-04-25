import { NextResponse } from "next/server"

// In a real application, this would connect to a database
// Using the same mock data as in the merchants page
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

export async function GET() {
  try {
    return NextResponse.json(merchants)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchants" }, { status: 500 })
  }
}
