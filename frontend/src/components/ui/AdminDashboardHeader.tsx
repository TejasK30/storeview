"use client"

import { Plus } from "lucide-react"

import { AddStoreForm } from "@/components/ui/add-store-form"
import { AddUserForm } from "@/components/ui/add-user-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type AdminDashboardHeaderProps = {
  onRefresh: () => void
}

const AdminDashboardHeader = ({ onRefresh }: AdminDashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-2">
        {/* Add User Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <AddUserForm onClose={() => {}} onSuccess={onRefresh} />
          </DialogContent>
        </Dialog>

        {/* Add Store Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
            </DialogHeader>
            <AddStoreForm onClose={() => {}} onSuccess={onRefresh} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminDashboardHeader
