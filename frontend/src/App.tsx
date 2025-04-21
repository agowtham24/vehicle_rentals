import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import BussinessAccounts from "./pages/BussinessAccounts";
import MainLayout from "./components/Layout";
import ProtectedRoute from "./components/protectedRoute";
import BussinessPricings from "./pages/BussinessPricings";
import PlanForm from "./pages/PlanForm";
import Vehicles from "./pages/Vehicles";
import Rentals from "./pages/rentals";
import AssignRider from "./pages/assignRider";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/app/bussiness" replace />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="bussiness" replace />,
          },

          {
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
            children: [
              { path: "bussiness", element: <BussinessAccounts /> },
              { path: "pricings", element: <BussinessPricings /> },
              { path: "planForm", element: <PlanForm /> },
              { path: "vehicles", element: <Vehicles /> },
            ],
          },

          {
            element: <ProtectedRoute allowedRoles={["TENANT"]} />,
            children: [
              { path: "rentals", element: <Rentals /> },
              { path: "assignRider", element: <AssignRider /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
