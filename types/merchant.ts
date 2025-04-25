import type { Product } from "./product"

export interface Merchant {
  merchant_id: string
  merchantName: string
  merchantLogoUrl: string
  merchantUrl: string
  merchantDescription: string
  bestMerchantOfferAmount: string
  bestMerchantOfferAmountType: string
  merchantStatus: string
  products: Product[]
}
