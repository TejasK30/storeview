import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Discover & Rate Local Stores
        </h1>
        <p className="text-lg text-muted-foreground">
          Search for stores in your area, read reviews, and share your own
          experience to help others make better choices.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button className="text-white bg-blue-600 hover:bg-blue-700 text-lg px-6 py-4 rounded-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          title="Browse Stores"
          description="Explore local stores with ease using our intuitive interface."
        />
        <FeatureCard
          title="Rate & Review"
          description="Leave honest ratings and help others make informed decisions."
        />
        <FeatureCard
          title="Dashboard Insights"
          description="Track your activity and see your past reviews in one place."
        />
      </section>
    </main>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
