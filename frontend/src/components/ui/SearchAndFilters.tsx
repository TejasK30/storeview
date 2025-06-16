import { Search } from "lucide-react"
import { FC } from "react"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

type UserFilters = {
  role: string
  sortBy: string
  sortOrder: string
}

type StoreFilters = {
  sortByRating: string
}

type SearchAndFiltersProps =
  | {
      type: "users"
      search: string
      setSearch: (value: string) => void
      filters: UserFilters
      setFilters: React.Dispatch<React.SetStateAction<UserFilters>>
    }
  | {
      type: "stores"
      search: string
      setSearch: (value: string) => void
      filters: StoreFilters
      setFilters: React.Dispatch<React.SetStateAction<StoreFilters>>
    }

export const SearchAndFilters: FC<SearchAndFiltersProps> = ({
  search,
  setSearch,
  filters,
  setFilters,
  type,
}) => (
  <div className="flex gap-4 mb-6">
    {/* Search input */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={`Search ${type}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>

    {/* User filters */}
    {type === "users" && (
      <>
        {/* Role Filter */}
        <Select
          value={filters.role}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, role: value }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="store_owner">Store Owner</SelectItem>
            <SelectItem value="system_admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By Field */}
        <Select
          value={`${filters.sortBy}_${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("_")
            setFilters((prev) => ({
              ...prev,
              sortBy,
              sortOrder,
            }))
          }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Sort users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none_none">Sort users</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="email_asc">Email (A-Z)</SelectItem>
            <SelectItem value="email_desc">Email (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </>
    )}

    {/* Store Rating Sort */}
    {type === "stores" && (
      <Select
        value={filters.sortByRating}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, sortByRating: value }))
        }
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Sort by rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Highest to Lowest</SelectItem>
          <SelectItem value="asc">Lowest to Highest</SelectItem>
        </SelectContent>
      </Select>
    )}
  </div>
)
