"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit } from "lucide-react"
import type { Merchant } from "@/types/merchant"
import AddMerchantModal from "@/components/add-merchant-modal"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { getMerchants, addMerchant } from "../actions/merchants"

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Edit</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMerchants.map((merchant) => (
                <tr key={merchant.merchant_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{merchant.merchant_id}</td>
                  <td className="px-4 py-3 text-sm">{merchant.merchantName}</td>
                  <td className="px-4 py-3 text-sm truncate max-w-[150px]">{merchant.merchantLogoUrl}</td>
                  <td className="px-4 py-3 text-sm truncate max-w-[150px]">{merchant.merchantUrl}</td>
                  <td className="px-4 py-3 text-sm truncate max-w-[200px]">{merchant.merchantDescription}</td>
                  <td className="px-4 py-3 text-sm">
                    {merchant.bestMerchantOfferAmountType === "amount"
                      ? `Rs. ${merchant.bestMerchantOfferAmount}`
                      : `${merchant.bestMerchantOfferAmount}%`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      className={
                        merchant.merchantStatus === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }
                    >
                      {merchant.merchantStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-pink-500" />
                    </Button>
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

      <AddMerchantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMerchant}
        lastId={merchants.length > 0 ? merchants[merchants.length - 1].merchant_id : "M000000"}
      />
    </div>
  )
}
