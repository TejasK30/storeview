"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { SearchAndFilters } from "@/components/ui/SearchAndFilters"
import { StatsCards } from "@/components/ui/stat-card"
import { StoreCard } from "@/components/ui/storecard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCard } from "@/components/ui/user-card"

import AdminDashboardHeader from "@/components/ui/AdminDashboardHeader"
import AdminOverviewTab from "@/components/ui/AdminOverviewTab"
import Navbar from "@/components/ui/Navbar"
import { useAuth } from "@/hooks/use-auth"
import { useDebounce } from "@/hooks/useDebounce"
import { getUsers } from "@/lib/services/adminService"
import { getStats, getStores } from "@/lib/services/storeService"

export default function AdminDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("overview")

  // Pagination
  const [userPage, setUserPage] = useState(1)
  const [storePage, setStorePage] = useState(1)

  // Search and Filter
  const [userSearch, setUserSearch] = useState("")
  const [storeSearch, setStoreSearch] = useState("")
  const [userFilters, setUserFilters] = useState({
    role: "all",
    sortBy: "none",
    sortOrder: "none",
  })

  const [storeFilters, setStoreFilters] = useState({ sortByRating: "" })

  const debouncedUserSearch = useDebounce(userSearch, 500)
  const debouncedStoreSearch = useDebounce(storeSearch, 500)

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !hasRole("system_admin"))) {
      router.replace("/login")
    }
  }, [user, hasRole, authLoading])

  // get dashboard stats query
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
    enabled: !!user,
  })

  // get users query
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", debouncedUserSearch, userFilters, userPage],
    queryFn: () => {
      const params = new URLSearchParams({
        page: userPage.toString(),
        limit: "10",
        search: debouncedUserSearch,
        ...(userFilters.role && { role: userFilters.role }),
        ...(userFilters.sortBy && { sortBy: userFilters.sortBy }),
        ...(userFilters.sortOrder && { sortOrder: userFilters.sortOrder }),
      })
      return getUsers("/users", params)
    },
    enabled: activeTab === "users" && !!user,
    placeholderData: keepPreviousData,
  })

  // get stores query
  const {
    data: storesData,
    isLoading: isStoresLoading,
    refetch: refetchStores,
  } = useQuery({
    queryKey: ["stores", debouncedStoreSearch, storePage],
    queryFn: () =>
      getStores({
        search: debouncedStoreSearch,
        page: storePage,
        limit: 10,
      }),
    placeholderData: keepPreviousData,
    enabled: true,
  })

  // refetch
  const handleRefresh = () => {
    refetchStats()
    if (activeTab === "users") refetchUsers()
    if (activeTab === "stores") refetchStores()
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Navbar />

      <AdminDashboardHeader onRefresh={handleRefresh} />

      {statsData && <StatsCards stats={statsData} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <AdminOverviewTab
            description="Use the tabs above to switch between managing users and stores.
                You can also search, filter, and paginate results from the
                respective sections."
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchAndFilters
                search={userSearch}
                setSearch={setUserSearch}
                filters={userFilters}
                setFilters={setUserFilters}
                type="users"
              />

              {isUsersLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : usersData?.users?.length > 0 ? (
                <>
                  <div className="space-y-4 relative">
                    {isFetchingUsers && (
                      <div className="absolute right-0 top-0 text-xs text-muted-foreground animate-pulse">
                        Updating...
                      </div>
                    )}
                    {usersData.users.map((user: any) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                  <Pagination
                    pagination={usersData.pagination}
                    onPageChange={(page: number) => setUserPage(page)}
                  />
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Store Management</CardTitle>
              <CardDescription>Manage system stores</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchAndFilters
                search={storeSearch}
                setSearch={setStoreSearch}
                filters={storeFilters}
                setFilters={setStoreFilters}
                type="stores"
              />

              {isStoresLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : storesData && storesData?.stores?.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {storesData.stores.map((store: any) => (
                      <StoreCard key={store.id} store={store} />
                    ))}
                  </div>
                  <Pagination
                    pagination={storesData.pagination}
                    onPageChange={(page: number) => setStorePage(page)}
                  />
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No stores found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
