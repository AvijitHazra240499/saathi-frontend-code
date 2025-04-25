"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Merchant } from "@/types/merchant"

interface AddMerchantModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (merchant: Merchant) => void
  onUpdate?: (merchant: Merchant) => void
  lastId: string
  merchantToEdit?: Merchant | null
  isEditing?: boolean
}

export default function AddMerchantModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  lastId,
  merchantToEdit = null,
  isEditing = false,
}: AddMerchantModalProps) {
  const generateNextId = () => {
    const numericPart = Number.parseInt(lastId.substring(1))
    return `M${String(numericPart + 1).padStart(6, "0")}`
  }

  const [formData, setFormData] = useState<Merchant>({
    merchant_id: generateNextId(),
    merchantName: "",
    merchantLogoUrl: "",
    merchantUrl: "",
    merchantDescription: "",
    bestMerchantOfferAmount: "",
    bestMerchantOfferAmountType: "amount",
    merchantStatus: "active",
    products:[]
  })

  const [errorMessage, setErrorMessage] = useState("")

  // Reset form when modal opens/closes or when editing a different merchant
  useEffect(() => {
    if (isEditing && merchantToEdit) {
      setFormData(merchantToEdit)
    } else if (!isEditing) {
      setFormData({
        merchant_id: generateNextId(),
        merchantName: "",
        merchantLogoUrl: "",
        merchantUrl: "",
        merchantDescription: "",
        bestMerchantOfferAmount: "",
        bestMerchantOfferAmountType: "amount",
        merchantStatus: "active",
        products:[]
      })
    }
    setErrorMessage("")
  }, [isOpen, merchantToEdit, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.merchantName || !formData.merchantLogoUrl || !formData.merchantUrl) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    if (isEditing && onUpdate) {
      onUpdate(formData)
    } else {
      onAdd(formData)
    }

    // Reset form
    if (!isEditing) {
      setFormData({
        merchant_id: generateNextId(),
        merchantName: "",
        merchantLogoUrl: "",
        merchantUrl: "",
        merchantDescription: "",
        bestMerchantOfferAmount: "",
        bestMerchantOfferAmountType: "amount",
        merchantStatus: "active",
        products:[]
      })
    }
    setErrorMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit merchant" : "Add a new merchant"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" name="merchant_id" value={formData.merchant_id} onChange={handleChange} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.merchantStatus} onValueChange={(value) => handleSelectChange("merchantStatus", value)}>
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

          <div className="space-y-2">
            <Label htmlFor="name">Merchant Name</Label>
            <Input id="name" name="merchantName" value={formData.merchantName} onChange={handleChange} placeholder="New Merchant Inc" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="merchantLogoUrl"
              value={formData.merchantLogoUrl}
              onChange={handleChange}
              placeholder="https://www.merchant.com/logo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantUrl">Merchant URL</Label>
            <Input
              id="merchantUrl"
              name="merchantUrl"
              value={formData.merchantUrl}
              onChange={handleChange}
              placeholder="https://www.merchant.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="merchantDescription"
              value={formData.merchantDescription}
              onChange={handleChange}
              placeholder="A short description of the merchant"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bestOfferAmount">Best Offer Amount</Label>
              <Input
                id="bestOfferAmount"
                name="bestMerchantOfferAmount"
                value={formData.bestMerchantOfferAmount}
                onChange={handleChange}
                placeholder="1000 or 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bestOfferAmountType">Offer Type</Label>
              <Select
                value={formData.bestMerchantOfferAmountType}
                onValueChange={(value) => handleSelectChange("bestMerchantOfferAmountType", value)}
              >
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

          {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

          <div className="flex justify-end">
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
              {isEditing ? "Update Merchant" : "Add Merchant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
