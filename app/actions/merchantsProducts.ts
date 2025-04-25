"use server"

import { Product } from "@/types/product"

export async function getMerchantProducts() {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/product/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching merchant products:', error)
    return []
  }
}

export async function addMerchantProduct( productData: Omit<Product, 'product_id'>) {
  try {
    productData.merchantProductPrice = Number(productData.merchantProductPrice)
    productData.merchantProductOfferAmount = Number(productData.merchantProductOfferAmount)
    const response = await fetch(`${process.env.SERVER_HOST}/product/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error adding merchant product:', error)
    return { success: false, error: 'Failed to add merchant product' }
  }
}

export async function updateMerchantProduct(productId:string,productData: Omit<Product, 'product_id' | 'merchant_id'>) {
  try {
    if(productData.merchantProductPrice) productData.merchantProductPrice = Number(productData.merchantProductPrice) ;
    if(productData.merchantProductOfferAmount) productData.merchantProductOfferAmount = Number(productData.merchantProductOfferAmount)
    const response = await fetch(`${process.env.SERVER_HOST}/product/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error updating merchant product:', error)
    return { success: false, error: 'Failed to update merchant product' }
  }
}

export async function deleteMerchantProduct( productId: string) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/product/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting merchant product:', error)
    return { success: false, error: 'Failed to delete merchant product' }
  }
}

export async function readMerchantProduct(productId: string) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/product/read/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching merchant product:', error)
    return { success: false, error: 'Failed to fetch merchant product' }
  }
}



