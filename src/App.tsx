import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import { VehicleCreate } from "./pages/admin/cars/VehicleCreate";
import { CarsList } from "./pages/admin/cars/CarsList";
import { AdminLayout } from "./layouts/admin/AdminLayout";
import { VehicleView } from "./pages/vehicle/VehicleView";

export default function App() {
  const location = useLocation();

  // 🔥 esconde navbar no admin
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {/* NAVBAR GLOBAL (exceto admin) */}
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vehicle/view/:id" element={<VehicleView />} />
          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>

            <Route
              path="cars"
              element={<CarsList />}
            />

            <Route
              path="cars/create"
              element={<VehicleCreate />}
            />

            <Route
              path="cars/edit/:id"
              element={<VehicleCreate />}
            />
          </Route>
        </Routes>
      </main>
    </>
  );
}