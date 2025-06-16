import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

type overviewProps = {
  description: string
}

const AdminOverviewTab = ({ description }: overviewProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </>
  )
}

export default AdminOverviewTab
