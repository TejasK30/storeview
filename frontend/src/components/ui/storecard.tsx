import { Calendar, Mail, MapPin, Star, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Store } from "@/lib/types"

export const StoreCard = ({ store }: { store: Store }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{store.name}</CardTitle>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {store.averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({store.totalRatings})
          </span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {store.email}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {store.address}
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Owner: {store.ownerName}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(store.createdAt).toLocaleDateString()}
        </div>
      </div>
    </CardContent>
  </Card>
)
