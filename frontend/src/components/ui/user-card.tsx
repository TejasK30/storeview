import { Calendar, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { User } from "@/lib/types"

export const UserCard = ({ user }: { user: User }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{user.name}</CardTitle>
        <Badge
          variant={
            user.role === "system_admin"
              ? "destructive"
              : user.role === "store_owner"
              ? "default"
              : "outline"
          }
        >
          {user.role.replace("_", " ").toUpperCase()}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {user.email}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {user.address}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </CardContent>
  </Card>
)
