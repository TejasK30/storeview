"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { MyReviews } from "@/components/ui/Reviews"
import { StoreCard } from "@/components/ui/storecard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/ui/Navbar"
import { useAuthContext } from "@/contexts/auth-context"
import { getStores, getUserReviews } from "@/lib/services/storeService"
import { Store } from "@/lib/types"
import RatingModal from "@/components/ui/RatingModal"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const DEFAULT_LIMIT = 10

export default function UserDashboard() {
  const { loading: authLoading, user, hasRole } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !hasRole("user"))) {
      router.replace("/login")
    }
  }, [user, hasRole, authLoading])
  const [activeTab, setActiveTab] = useState<"myReviews" | "browse">(
    "myReviews"
  )
  const [search, setSearch] = useState("")
  const [pageSt, setPageSt] = useState(1)
  const [pageRv, setPageRv] = useState(1)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["myReviews", user?.id, pageRv],
    queryFn: () => getUserReviews(user!.id, pageRv, DEFAULT_LIMIT),
    enabled: !!user?.id,
    placeholderData: keepPreviousData,
  })

  const {
    data: storesData,
    isLoading: isStoresLoading,
    error: storesError,
  } = useQuery({
    queryKey: ["stores", debouncedSearch, pageSt],
    queryFn: () =>
      getStores({
        search: debouncedSearch,
        page: pageSt,
        limit: DEFAULT_LIMIT,
      }),
    placeholderData: keepPreviousData,
    enabled: true,
  })

  useEffect(() => {
    setPageSt(1)
    setPageRv(1)
  }, [debouncedSearch])

  useEffect(() => {
    if (reviewsError)
      toast.error(`Error loading your reviews: ${reviewsError.message}`)
    if (storesError) toast.error(`Error loading stores: ${storesError.message}`)
  }, [reviewsError, storesError])

  const handleGiveReview = (store: Store) => {
    setSelectedStore(store)
    setIsRatingModalOpen(true)
  }

  const closeRatingModal = () => {
    setIsRatingModalOpen(false)
    setSelectedStore(null)
  }

  const currentStores = storesData?.stores || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar />
      <h1 className="text-3xl font-bold">User Dashboard</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="myReviews">My Reviews</TabsTrigger>
          <TabsTrigger value="browse">Browse & Review Stores</TabsTrigger>
        </TabsList>

        {/* My Reviews */}
        <TabsContent value="myReviews" className="pt-4">
          <MyReviews
            reviews={reviewsData?.reviews ?? []}
            isLoading={isReviewsLoading}
          />
        </TabsContent>

        {/* Browse Stores */}
        <TabsContent value="browse" className="pt-4 space-y-4">
          <Input
            placeholder="Search by store name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isStoresLoading && pageSt === 1 ? (
            <div className="text-center py-6">Loading stores...</div>
          ) : currentStores.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No stores found
            </p>
          ) : (
            <>
              {currentStores.map((store: Store) => (
                <div key={store.id} className="border rounded-lg p-4 space-y-3">
                  <StoreCard store={store} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleGiveReview(store)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Give Review
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination Component */}
              {storesData?.pagination &&
                typeof storesData.pagination.pages === "number" &&
                storesData.pagination.pages > 1 && (
                  <Pagination
                    pagination={storesData.pagination}
                    onPageChange={(page) => setPageSt(page)}
                  />
                )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {selectedStore && (
        <RatingModal
          store={selectedStore}
          isOpen={isRatingModalOpen}
          onClose={closeRatingModal}
        />
      )}
    </div>
  )
}
