"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"
import type { Product } from "@/types/product"
import AddProductModal from "@/components/add-product-modal"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { addMerchantProduct, deleteMerchantProduct, getMerchantProducts, updateMerchantProduct } from "../actions/merchantsProducts"
import EditProductModal from "@/components/edit-product-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const itemsPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    const fetchMerchantProducts = async () => {
      const MerchantProducts  = await getMerchantProducts()
      setProducts(MerchantProducts)
    }
    
    fetchMerchantProducts()
  }, [])

  const filteredProducts = products.filter((product) => product.merchantProductName.toLowerCase().includes(searchQuery.toLowerCase()))

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handleAddProduct = async (productData: Omit<Product, 'product_id'>) => {
    try {
      const result = await addMerchantProduct(productData)
      if (result.success) {
        setProducts([...products, result.data])
        setIsAddModalOpen(false)
        toast({
          title: "Product added",
          description: `${productData.merchantProductName} has been added successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add product. Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the product.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

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
        setProducts(products.map((p) => (p.product_id === updatedProduct.product_id ? updatedProduct : p)))
        setIsEditModalOpen(false)
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
    if (selectedProduct) {
      try {
        const result = await deleteMerchantProduct( selectedProduct.product_id)
        if (result.success) {
          setProducts(products.filter((p) => p.product_id !== selectedProduct.product_id))
          setIsDeleteModalOpen(false)
          toast({
            title: "Product deleted",
            description: `${selectedProduct.merchantProductName} has been deleted successfully.`,
            variant: "destructive",
          })
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search Products"
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-pink-500 hover:bg-pink-600">
            Add
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Merchant ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Offer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tags</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Edit</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.product_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      {product.product_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      {product.merchantProductName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm truncate max-w-[150px]">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      {product.merchantProductDescription}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      {product.merchant_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      Rs. {parseFloat(product.merchantProductPrice.toString()).toFixed(2)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      {product.merchantProductOfferType === "amount" ? `Rs. ${product.merchantProductOfferAmount}` : `${product.merchantProductOfferAmount}%`}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      <Badge
                        className={
                          product.merchantProductStatus === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {product.merchantProductStatus}
                      </Badge>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/products/${product.product_id}`} className="block w-full h-full">
                      <div className="flex flex-wrap gap-1">
                        {product.merchantProductTag.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(product)
                        }}
                      >
                        <Edit className="h-4 w-4 text-pink-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(product)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  // Handle items per page change
                }}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <span>←</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <span>→</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        lastId={products.length > 0 ? products[products.length - 1].product_id : "P000000"}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <AddProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProduct}
          onAdd={handleAddProduct}
          productToEdit={selectedProduct}
          isEditing={true}
          lastId={products.length > 0 ? products[products.length - 1].product_id : "P000000"}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        description={`Are you sure you want to delete ${selectedProduct?.merchantProductName}? This action cannot be undone.`}
      />
    </div>
  )
}
