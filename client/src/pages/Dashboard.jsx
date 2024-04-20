import MobileNav from "@/components/shared/MobileNav"
import Sidebar from "@/components/shared/Sidebar"
import AddTransformationTypePage from "./AddTransformationTypePage"
import { Route, Routes } from "react-router-dom"

const Dashboard = () => {
  return (
    <main className="root">
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">
          <Routes>
            <Route path="/transformations/add/:type" element={<AddTransformationTypePage />} />
            
          </Routes>
        </div>
      </div>
    </main>
  )
}

export default Dashboard