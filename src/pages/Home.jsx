import { Button } from "../components/ui/button"
import { MainLayout } from "../components/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <div className="container">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User"
                width={40}
                height={40}
                className="rounded-full border-2 border-background"
              />
              <img
                src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User"
                width={40}
                height={40}
                className="rounded-full border-2 border-background"
              />
              <img
                src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User"
                width={40}
                height={40}
                className="rounded-full border-2 border-background"
              />
            </div>
            <span className="ml-2 text-muted-foreground">Loved by 2.4M users with a 4.8 rating</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            From <span className="text-primary">fresh produce</span> to daily essentials, shop smarter!
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Get the app</Button>
            <Button size="lg" variant="outline">
              Discover app
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-5xl">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src="https://img.freepik.com/premium-photo/woman-shopping-groceries-supermarket-with-shopping-basket-her-hand_604472-14946.jpg"                  
              alt="Shopping"
              width={1200}
              height={600}
              className="w-full object-cover"
            />

            {/* Subscription Card */}
            <div className="absolute left-4 top-1/2 hidden max-w-[250px] -translate-y-1/2 rounded-xl bg-card p-4 shadow-lg md:block">
              <h3 className="mb-2 font-bold">Subscription Services</h3>
              <p className="text-sm text-muted-foreground">
                Sign up for automatic deliveries of your most-used items, saving you time and hassle.
              </p>
            </div>

            {/* Recipe Card */}
            <div className="absolute right-4 top-1/2 hidden max-w-[250px] -translate-y-1/2 rounded-xl bg-card p-4 shadow-lg md:block">
              <h3 className="mb-2 font-bold">Italian Carbonara</h3>
              <p className="text-sm text-muted-foreground">6 products - 30 min</p>
              <div className="mt-2 flex items-center">
                <div className="flex -space-x-2">
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Ingredient"
                    width={30}
                    height={30}
                    className="rounded-full border-2 border-background"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=30"
                    alt="Ingredient"
                    width={30}
                    height={30}
                    className="rounded-full border-2 border-background"
                  />
                </div>
                <span className="ml-2 text-sm">+4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
