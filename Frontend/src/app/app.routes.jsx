import { createBrowserRouter, Navigate } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AuthLayout from "../features/auth/pages/AuthLayout";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import SellerDashboard from "../features/products/pages/SellerDashboard.jsx";
import DashboardPage from "../features/products/pages/DashboardPage.jsx";
import EditProductPage from "../features/products/pages/EditProductPage.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetails from "../features/products/pages/ProductDetails.jsx";
import Products from "../features/products/pages/Products.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
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
    path: '/products',
    element: <Products />
  },
  {
    path: "/seller",
    children: [
      {
        path: 'dashboard',
        element: <Protected role="seller"><DashboardPage /></Protected>
      },
      {
        path: "create-product",
        element: <Protected role="seller"><CreateProduct /></Protected>
      },
      {
        path: 'edit/:id',
        element: <Protected role="seller"><EditProductPage /></Protected>
      },
    ]
  }
]);
