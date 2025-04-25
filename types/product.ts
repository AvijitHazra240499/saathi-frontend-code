export interface Parameter {
  name: string
  value: string
}

export interface Product {
  product_id: string
  merchant_id: string
  merchantProductName: string
  merchantProductDescription: string
  merchantProductPrice: number
  merchantProductOfferAmount: number
  merchantProductOfferType: string
  merchantProductImageUrl: string
  merchantProductUrl: string
  merchantProductStatus: string
  merchantProductTag: string[]
  merchantProductParameters: Parameter | {}
}
