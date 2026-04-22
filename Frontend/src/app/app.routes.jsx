import { createBrowserRouter, Navigate } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AuthLayout from "../features/auth/pages/AuthLayout";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import SellerDashboard from "../features/products/pages/SellerDashboard.jsx";
import DashboardPage from "../features/products/pages/DashboardPage.jsx";
import EditProductPage from "../features/products/pages/EditProductPage.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Welcome to the App</h1>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller",
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: "create-product",
        element: <CreateProduct />
      },
      {
        path: 'edit/:id',
        element: <EditProductPage />
      },
    ]
  }
]);
