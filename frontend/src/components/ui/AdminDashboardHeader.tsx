"use client"

import { Plus } from "lucide-react"

import { AddStoreForm } from "@/components/ui/add-store-form"
import { AddUserForm } from "@/components/ui/add-user-form"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type AdminDashboardHeaderProps = {
  onRefresh: () => void
}

const AdminDashboardHeader = ({ onRefresh }: AdminDashboardHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <h3 className="font-medium mb-4">Add New User</h3>
              <AddUserForm onClose={() => {}} onSuccess={onRefresh} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <h3 className="font-medium mb-4">Add New Store</h3>
              <AddStoreForm onClose={() => {}} onSuccess={onRefresh} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardHeader
