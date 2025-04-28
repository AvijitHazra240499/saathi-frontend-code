"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ArrowLeft, ExternalLink } from "lucide-react"
import type { Merchant } from "@/types/merchant"
import type { Product } from "@/types/product"
import AddMerchantModal from "@/components/add-merchant-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { deleteMerchant, readMerchant } from "@/app/actions/merchants"
import AddProductModal from "@/components/add-product-modal"
import { addMerchantProduct } from "@/app/actions/merchantsProducts"

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchMerchant = async () => {
      setIsLoading(true)
      try {
        const result = await readMerchant(id)
        if (result.success) {
          setMerchant(result.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch merchant details",
            variant: "destructive",
          })
          router.push("/merchants")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch merchant details",
          variant: "destructive",
        })
        router.push("/merchants")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMerchant()
  }, [id, router, toast])

  const handleUpdateMerchant = (updatedMerchant: Merchant) => {
    setMerchant(updatedMerchant)
    setIsEditModalOpen(false)
    toast({
      title: "Merchant updated",
      description: `${updatedMerchant.merchantName} has been updated successfully.`,
    })
  }

  const handleDeleteMerchant = async () => {
    if (!merchant) return;

    try {
      const result = await deleteMerchant(merchant.merchant_id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        toast({
          title: "Merchant deleted",
          description: `${merchant.merchantName} has been deleted successfully.`,
          variant: "destructive",
        });
        router.push("/merchants");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete merchant",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the merchant",
        variant: "destructive",
      });
    }
  }

  const handleAddProduct = async (productData: Omit<Product, "product_id">) => {
    try {
      const mappedProduct = {
        merchant_id: productData.merchant_id,
        merchantProductName: productData.merchantProductName,
        merchantProductDescription: productData.merchantProductDescription,
        merchantProductPrice: Number(productData.merchantProductPrice),
        merchantProductOfferAmount: Number(productData.merchantProductOfferAmount),
        merchantProductOfferType: productData.merchantProductOfferType,
        merchantProductImageUrl: productData.merchantProductImageUrl,
        merchantProductUrl: productData.merchantProductUrl,
        merchantProductStatus: productData.merchantProductStatus,
        merchantProductTag: productData.merchantProductTag,
        merchantProductParameters: productData.merchantProductParameters
      }
      await addMerchantProduct(mappedProduct)
      toast({
        title: "Success",
        description: "Product added successfully",
      })
      setIsAddProductModalOpen(false)
      
      const updatedMerchant = await readMerchant(id)
      setMerchant(updatedMerchant.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4">Loading merchant details...</p>
        </div>
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Merchant not found</h2>
        <Button asChild>
          <Link href="/merchants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Merchants
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/merchants">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Merchant Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-pink-500 text-pink-500 hover:bg-pink-50"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{merchant.merchantName}</span>
              <Badge
                className={
                  merchant.merchantStatus === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                }
              >
                {merchant.merchantStatus}
              </Badge>
            </CardTitle>
            <CardDescription>{merchant.merchantDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Merchant ID</h3>
                <p className="mt-1">{merchant.merchant_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Best Offer</h3>
                <p className="mt-1">
                  {merchant.bestMerchantOfferAmountType === "amount"
                    ? `Rs. ${merchant.bestMerchantOfferAmount}`
                    : `${merchant.bestMerchantOfferAmount}%`}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Logo URL</h3>
              <p className="mt-1 break-all">{merchant.merchantLogoUrl}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Merchant URL</h3>
              <div className="mt-1 flex items-center gap-2">
                <p className="break-all">{merchant.merchantUrl}</p>
                <a
                  href={merchant.merchantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Logo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              {/* <p className="text-gray-500">Logo Preview</p> */}
              {/* In a real app, you would display the actual logo here */}
              <img src={merchant.merchantLogoUrl || "/placeholder.svg"} alt={`${merchant.merchantName} logo`} className="max-w-full max-h-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(merchant.merchantLogoUrl, "_blank")}
            >
              View Full Logo
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Associated Products</CardTitle>
          <CardDescription>Products linked to this merchant</CardDescription>
        </CardHeader>
        <CardContent>
          {merchant.products && merchant.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchant.products.map((product) => (
                <Card key={product.product_id}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden">
                      <img
                        src={product.merchantProductImageUrl || "/placeholder.svg"}
                        alt={product.merchantProductName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{product.merchantProductName}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{product.merchantProductDescription}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rs. {product.merchantProductPrice}</span>
                        <Badge
                          className={
                            product.merchantProductStatus === "active"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                          }
                        >
                          {product.merchantProductStatus}
                        </Badge>
                      </div>
                      {product.merchantProductOfferAmount && (
                        <div className="text-sm text-pink-500">
                          {product.merchantProductOfferType === "amount" ? `Rs. ${product.merchantProductOfferAmount}` : `${product.merchantProductOfferAmount}%`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Button variant="outline" size="sm" asChild>
                      <a href={product.merchantProductUrl} target="_blank" rel="noopener noreferrer">
                        View Product
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found for this merchant</p>
              {/* <Button className="mt-4 bg-pink-500 hover:bg-pink-600">Add New Product</Button> */}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => setIsAddProductModalOpen(true)}>Add New Product</Button>
        </CardFooter>

      </Card>

      {/* Edit Merchant Modal */}
      <AddMerchantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={() => {}}
        onUpdate={handleUpdateMerchant}
        lastId={merchant.merchant_id}
        merchantToEdit={merchant}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMerchant}
        title="Delete Merchant"
        description={`Are you sure you want to delete ${merchant.merchantName}? This action cannot be undone.`}
      />
      
      {/* Add Merchant Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAdd={handleAddProduct}
        onUpdate={()=>{}}
        lastId={id}
      />
    </div>
  )
}
