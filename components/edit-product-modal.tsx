"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Product } from "@/types/product"
import { Plus, Minus, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (product: Product) => void
  product: Product
}

export default function EditProductModal({ isOpen, onClose, onUpdate, product }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({ ...product })
  const [paramName, setParamName] = useState("")
  const [paramValue, setParamValue] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (isOpen && product) {
      setFormData({ ...product })
    }
    setErrorMessage("")
  }, [isOpen, product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addParameter = () => {
    if (!paramName || !paramValue) {
      setErrorMessage("Parameter name and value are required")
      return
    }

    setFormData((prev) => ({
      ...prev,
      merchantProductParameters: {
        ...(prev.merchantProductParameters as Record<string, string>),
        [paramName]: paramValue
      }
    }))
    setParamName("")
    setParamValue("")
    setErrorMessage("")
  }

  const removeParameter = (key: string) => {
    setFormData((prev) => {
      const params = prev.merchantProductParameters as Record<string, string>
      const { [key]: _, ...rest } = params
      return {
        ...prev,
        merchantProductParameters: rest
      }
    })
  }

  const addTag = () => {
    if (!tagInput) return
    if (!formData.merchantProductTag.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.merchantProductTag, tagInput],
      }))
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.merchantProductTag.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.merchantProductName || !formData.merchantProductDescription || formData.merchantProductPrice <= 0) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    const mappedProduct = {
      ...formData,
      merchantProductPrice: Number(formData.merchantProductPrice),
      merchantProductOfferAmount: Number(formData.merchantProductOfferAmount)
    }

    onUpdate(mappedProduct)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" name="product_id" value={formData.product_id} onChange={handleChange} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                name="merchant_id"
                value={formData.merchant_id}
                onChange={handleChange}
                placeholder="M000001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="merchantProductName" value={formData.merchantProductName} onChange={handleChange} placeholder="Lovely Red Shoes" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              name="merchantProductDescription"
              value={formData.merchantProductDescription}
              onChange={handleChange}
              placeholder="Really lovely red leather shoes"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="merchantProductPrice"
                type="number"
                value={formData.merchantProductPrice || ""}
                onChange={handleChange}
                placeholder="15000.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.merchantProductStatus} onValueChange={(value) => handleSelectChange("merchantProductStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerAmount">Offer Amount</Label>
              <Input
                id="offerAmount"
                name="offerAmount"
                value={formData.merchantProductOfferAmount}
                onChange={handleChange}
                placeholder="1000 or 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerType">Offer Type</Label>
              <Select value={formData.merchantProductOfferType} onValueChange={(value) => handleSelectChange("merchantProductOfferType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount (Rs.)</SelectItem>
                  <SelectItem value="percent">Percent (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Product Image URL</Label>
            <Input
              id="imageUrl"
              name="merchantProductImageUrl"
              value={formData.merchantProductImageUrl}
              onChange={handleChange}
              placeholder="https://www.merchant.com/product-image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUrl">Product URL</Label>
            <Input
              id="productUrl"
              name="merchantProductUrl"
              value={formData.merchantProductUrl}
              onChange={handleChange}
              placeholder="https://www.merchant.com/product"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.merchantProductTag.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 bg-pink-500">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a tag (e.g. Technology)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addTag} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Parameters</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Name (e.g. Weight)"
                value={paramName}
                onChange={(e) => setParamName(e.target.value)}
              />
              <Input
                placeholder="Value (e.g. 40g)"
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
              />
              <Button type="button" size="icon" onClick={addParameter} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {Object.entries(formData.merchantProductParameters).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Input value={key} disabled />
                  <Input value={value} disabled />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => removeParameter(key)}
                    className="border-pink-500 text-pink-500"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {Object.keys(formData.merchantProductParameters).length} parameters
            </div>
          </div>

          {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

          <div className="flex justify-end">
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
              Update Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
