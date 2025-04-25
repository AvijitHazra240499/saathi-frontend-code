"use server"

export async function getMerchants() {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/merchant/list`, {
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
    console.error('Error fetching merchants:', error)
    // Return the mock data as fallback
    return []
  }
}

export async function addMerchant(merchantData: {
  merchantName: string
  merchantLogoUrl: string
  merchantUrl: string
  merchantDescription: string
  bestMerchantOfferAmount: string
  bestMerchantOfferAmountType: "amount" | "percent"
  merchantStatus: "active" | "inactive"
}) {
  try {
    console.log(merchantData)
    const response = await fetch(`${process.env.SERVER_HOST}/merchant/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(merchantData),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error adding merchant:', error)
    return { success: false, error: 'Failed to add merchant' }
  }
}

export async function deleteMerchant(merchantId: string) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/merchant/delete/${merchantId}`, {
      method: 'DELETE',
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
    console.error('Error deleting merchant:', error)
    return { success: false, error: 'Failed to delete merchant' }
  }
}

export async function updateMerchant(merchantId: string, merchantData: {
  merchantName: string
  merchantLogoUrl: string
  merchantUrl: string
  merchantDescription: string
  bestMerchantOfferAmount: string
  bestMerchantOfferAmountType: "amount" | "percent"
  merchantStatus: "active" | "inactive"
}) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/merchant/update/${merchantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(merchantData),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error updating merchant:', error)
    return { success: false, error: 'Failed to update merchant' }
  }
}

export async function readMerchant(merchantId: string) {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/merchant/read/${merchantId}`, {
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
    console.error('Error fetching merchant:', error)
    return { success: false, error: 'Failed to fetch merchant' }
  }
}

