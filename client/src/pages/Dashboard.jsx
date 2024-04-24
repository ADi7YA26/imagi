import MobileNav from "@/components/shared/MobileNav"
import Sidebar from "@/components/shared/Sidebar"
import AddTransformationTypePage from "./AddTransformationTypePage"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import Home from "@/components/shared/Home"

const Dashboard = () => {
  return (
    <main className="root">
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transformations/add/:type" element={<AddTransformationTypePage />} />
          </Routes>
        </div>
      </div>

      <Toaster />
    </main>
  )
}

export default Dashboard