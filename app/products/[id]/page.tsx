"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ArrowLeft, ExternalLink } from "lucide-react"
import type { Product } from "@/types/product"
import AddProductModal from "@/components/add-product-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { deleteMerchantProduct, readMerchantProduct, updateMerchantProduct } from "@/app/actions/merchantsProducts"
import React from "react"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const foundProduct = await readMerchantProduct(id)
        if (foundProduct) {
          setProduct(foundProduct.data)
        } else {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/products")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }


    fetchProduct()
  }, [id, router, toast])

  const handleUpdateProduct = async (updatedProduct: Product) => {
      try {
        const result = await updateMerchantProduct(updatedProduct.product_id, {
          merchantProductName: updatedProduct.merchantProductName,
          merchantProductDescription: updatedProduct.merchantProductDescription,
          merchantProductImageUrl: updatedProduct.merchantProductImageUrl,
          merchantProductUrl: updatedProduct.merchantProductUrl,
          merchantProductPrice: updatedProduct.merchantProductPrice,
          merchantProductOfferAmount: updatedProduct.merchantProductOfferAmount,
          merchantProductStatus: updatedProduct.merchantProductStatus,
          merchantProductOfferType: updatedProduct.merchantProductOfferType,
          merchantProductTag: updatedProduct.merchantProductTag,
          merchantProductParameters: updatedProduct.merchantProductParameters
        })
        if (result.success) {
          setIsEditModalOpen(false)
          setProduct(updatedProduct)
          toast({
            title: "Product updated",
            description: `${updatedProduct.merchantProductName} has been updated successfully.`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update product. Please try again later.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating the product.",
          variant: "destructive",
        })
      }
    }

  const handleDeleteProduct = async () => {
      if (product) {
        try {
          const result = await deleteMerchantProduct( product.product_id)
          if (result.success) {
            setIsDeleteModalOpen(false)
            toast({
              title: "Product deleted",
              description: `${product.merchantProductName} has been deleted successfully.`,
              variant: "destructive",
            })
            router.push("/products")
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to delete product",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An error occurred while deleting the product",
            variant: "destructive",
          })
        }
      }
    }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
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
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Product Details</h1>
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
              <span>{product.merchantProductName}</span>
              <Badge
                className={
                  product.merchantProductStatus === "active" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                }
              >
                {product.merchantProductStatus}
              </Badge>
            </CardTitle>
            <CardDescription>{product.merchantProductDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product ID</h3>
                <p className="mt-1">{product.product_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Merchant ID</h3>
                <p className="mt-1">
                  <Link href={`/merchants/${product.merchant_id}`} className="text-pink-500 hover:underline">
                    {product.merchant_id}
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1">Rs. {product.merchantProductPrice.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Offer</h3>
                <p className="mt-1">
                  {product.merchantProductOfferType === "amount" ? `Rs. ${product.merchantProductOfferAmount}` : `${product.merchantProductOfferAmount}%`}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Product URL</h3>
              <div className="mt-1 flex items-center gap-2">
                <p className="break-all">{product.merchantProductUrl}</p>
                <a
                  href={product.merchantProductImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.merchantProductTag.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-pink-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Parameters</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(product.merchantProductParameters).map(([key, value], index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <img src={product.merchantProductImageUrl || "/placeholder.svg"} alt={product.merchantProductName} className="max-w-full max-h-full object-contain" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(product.merchantProductImageUrl, "_blank")}
            >
              View Full Image
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
          <CardDescription>Other products from the same merchant</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No related products found</p>
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateProduct}
        onAdd={()=>{}}
        productToEdit={product}
        isEditing={true}
        lastId={product.product_id}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete ${product.merchantProductName}? This action cannot be undone.`}
      />
    </div>
  )
}
