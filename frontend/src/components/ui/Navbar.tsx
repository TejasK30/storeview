"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/contexts/auth-context"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { UpdateProfileForm } from "./UpdateProfileForm"

export default function Navbar() {
  const { user, logout, loading } = useAuthContext()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const initial = user?.name?.charAt(0).toUpperCase() ?? ""

  const handleLogOut = async () => {
    await logout()
  }

  const handleProfileClick = () => {
    setIsProfileOpen(true)
  }

  return (
    <>
      <nav className="w-full border-b bg-background shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link
            href="/"
            className="text-2xl font-bold text-primary tracking-tight"
          >
            StoreView
          </Link>

          <div className="flex items-center gap-4">
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-200 outline-none px-3 py-2 h-auto border rounded-full"
                  >
                    <div className="flex items-center gap-2 outline-none">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-sm">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground leading-none mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-semibold text-sm">
                    {user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:bg-gray-300"
                  >
                    Profile Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="cursor-pointer hover:bg-gray-300"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="text-sm px-4 py-1.5">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Update Profile */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Profile Settings
            </DialogTitle>
          </DialogHeader>
          <UpdateProfileForm onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
