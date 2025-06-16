"use client"

import Navbar from "@/components/ui/Navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getStoreDashboardSummary,
  getStoreRatings,
} from "@/lib/services/storeService"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { StoreOverview } from "@/components/ui/StoreOverviewTab"
import { StoreRatingsList } from "@/components/ui/StoreRatingsList"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function StoreOwnerDashboard() {
  const { loading: authLoading, user, hasRole } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !hasRole("store_owner"))) {
      router.replace("/login")
    }
  }, [user, hasRole, authLoading])

  const [activeTab, setActiveTab] = useState("overview")
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["store-dashboard-summary", user?.id],
    queryFn: () => getStoreDashboardSummary(user?.id ?? ""),
    enabled: !!user?.id,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["store-ratings", user?.id, page],
    queryFn: () => getStoreRatings(user?.id ?? "", page, limit),
    enabled: !!user?.id,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPage(1)
  }, [user?.id, activeTab])

  const handlePageChange = (newPage: number) => setPage(newPage)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar />
      <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        {/* overview tab */}
        <TabsContent value="overview">
          <StoreOverview
            summary={summary}
            isLoading={summaryLoading}
            error={summaryError}
            userName={user?.name}
          />
        </TabsContent>

        {/* ratings list */}
        <TabsContent value="ratings">
          <StoreRatingsList
            data={data ?? null}
            isLoading={isLoading}
            error={error}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
