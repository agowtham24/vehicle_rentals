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
const getRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Navigate to="/app/bussiness" replace />, // redirect to app after login
    },
    {
      path: "/app",
      element: <ProtectedRoute />, // check auth first
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="bussiness" replace />,
            },
            {
              path: "bussiness",
              element: <BussinessAccounts />,
            },
            {
              path: "pricings",
              element: <BussinessPricings />,
            },
            {
              path: "planForm",
              element: <PlanForm />,
            },
            {
              path: "vehicles",
              element: <Vehicles />,
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
  return router;
};

function App() {
  return (
    <>
      <RouterProvider router={getRoutes()}></RouterProvider>
    </>
  );
}

export default App;
