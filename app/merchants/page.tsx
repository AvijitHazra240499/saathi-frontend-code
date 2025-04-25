"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"
import type { Merchant } from "@/types/merchant"
import AddMerchantModal from "@/components/add-merchant-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { getMerchants, addMerchant, deleteMerchant, updateMerchant } from "../actions/merchants"
import Link from "next/link"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    const fetchMerchants = async () => {
      const Merchants = await getMerchants()
      setMerchants(Merchants)
    }
    
    fetchMerchants()
  }, [])

  const filteredMerchants = merchants.filter((merchant) =>
    merchant.merchantName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedMerchants = filteredMerchants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage)

  const handleAddMerchant = async (merchant: Merchant) => {
    try {
      const result = await addMerchant({
        merchantName: merchant.merchantName,
        merchantLogoUrl: merchant.merchantLogoUrl,
        merchantUrl: merchant.merchantUrl,
        merchantDescription: merchant.merchantDescription,
        bestMerchantOfferAmount: merchant.bestMerchantOfferAmount,
        bestMerchantOfferAmountType: merchant.bestMerchantOfferAmountType as "amount" | "percent",
        merchantStatus: merchant.merchantStatus as "active" | "inactive"
      })

      if (result.success) {
        setMerchants([...merchants, result.data])
        setIsAddModalOpen(false)
        toast({
          title: "Merchant added",
          description: `${merchant.merchantName} has been added successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add merchant",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error adding merchant:', error)
      toast({
        title: "Error",
        description: "Failed to add merchant",
        variant: "destructive"
      })
    }
  }

  const handleEditClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateMerchant = async (updatedMerchant: Merchant) => {
    try {
      const result = await updateMerchant(updatedMerchant.merchant_id, {
        merchantName: updatedMerchant.merchantName,
        merchantLogoUrl: updatedMerchant.merchantLogoUrl,
        merchantUrl: updatedMerchant.merchantUrl,
        merchantDescription: updatedMerchant.merchantDescription,
        bestMerchantOfferAmount: updatedMerchant.bestMerchantOfferAmount,
        bestMerchantOfferAmountType: updatedMerchant.bestMerchantOfferAmountType as "amount" | "percent",
        merchantStatus: updatedMerchant.merchantStatus as "active" | "inactive"
      });

      if (result.success) {
        setMerchants(merchants.map((m) => (m.merchant_id === updatedMerchant.merchant_id ? result.data : m)));
        setIsEditModalOpen(false);
        toast({
          title: "Merchant updated",
          description: `${updatedMerchant.merchantName} has been updated successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update merchant",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the merchant",
        variant: "destructive",
      });
    }
  }

  const handleDeleteMerchant = async () => {
    if (selectedMerchant) {
      try {
        const result = await deleteMerchant(selectedMerchant.merchant_id);
        if (result.success) {
          setMerchants(merchants.filter((m) => m.merchant_id !== selectedMerchant.merchant_id));
          setIsDeleteModalOpen(false);
          toast({
            title: "Merchant deleted",
            description: `${selectedMerchant.merchantName} has been deleted successfully.`,
            variant: "destructive",
          });
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
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Merchants</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search Merchants"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Logo URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Merchant URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Best Offer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMerchants.map((merchant) => (
                <tr key={merchant.merchant_id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.merchant_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.merchantName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm truncate max-w-[150px]">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.merchantLogoUrl}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm truncate max-w-[150px]">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.merchantUrl}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm truncate max-w-[200px]">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.merchantDescription}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      {merchant.bestMerchantOfferAmountType === "amount"
                        ? `Rs. ${merchant.bestMerchantOfferAmount}`: `${merchant.bestMerchantOfferAmount}%`}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/merchants/${merchant.merchant_id}`} className="block w-full h-full">
                      <Badge
                        className={
                          merchant.merchantStatus === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {merchant.merchantStatus}
                      </Badge>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(merchant)
                        }}
                      >
                        <Edit className="h-4 w-4 text-pink-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(merchant)
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

        {filteredMerchants.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredMerchants.length)} of {filteredMerchants.length} entries
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

      {/* Add Merchant Modal */}
      <AddMerchantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMerchant}
        lastId={merchants.length > 0 ? merchants[merchants.length - 1].merchant_id : "M000000"}
      />

      {/* Edit Merchant Modal */}
      <AddMerchantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleAddMerchant}
        onUpdate={handleUpdateMerchant}
        lastId={merchants.length > 0 ? merchants[merchants.length - 1].merchant_id : "M000000"}
        merchantToEdit={selectedMerchant}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMerchant}
        title="Delete Merchant"
        description={`Are you sure you want to delete ${selectedMerchant?.merchantName}? This action cannot be undone.`}
      />
    </div>
  )
}

