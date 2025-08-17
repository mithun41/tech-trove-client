import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../Pages/home/home/Home";
import Register from "../Pages/register/Register";
import LogIn from "../Pages/login/LogIn";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../Routes/PrivateRoute";
import AddProduct from "../Pages/Dashboard/AddProduct/AddProduct";
import MyProducts from "../Pages/Dashboard/myProducts/MyProducts";
import UpdateProduct from "../Pages/Dashboard/updateProduct/UpdateProduct";
import ProductsQueue from "../Pages/Dashboard/productsQueue/ProductsQueue";
import ReportedProducts from "../Pages/Dashboard/reportedProducts/ReportedProducts";
import ModeratorRoute from "../context/Moderator/ModeratorRoute";
import Error from "../components/Error/Error";
import ProductDetails from "../Pages/productDetails/ProductDetails";
import ManageUsers from "../Pages/Dashboard/manageUsers/ManageUsers";
import Products from "../Pages/Products/Products";
import AdminRoute from "../context/AdminProvider/AdminRoute";
import MyProfile from "../Pages/Dashboard/myProfile/MyProfile";
import DashboardRedirect from "../Pages/Dashboard/DashboardRiderect/DashboardRiderect";
import AdminAddCoupon from "../Pages/Dashboard/AdminAddC0upon/AdminAddCoupon";
import User from "../context/User/User";
import AdminStatistics from "../Pages/Dashboard/AdminStatistics/AdminStatistics";
import About from "../Pages/About/About";
import Contact from "../Pages/contact-us/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Error></Error>,
    children: [
      { index: true, Component: Home },
      { path: "register", Component: Register },
      { path: "login", Component: LogIn },
      {
        path: "product-details/:id",
        element: <ProductDetails></ProductDetails>,
      },
      { path: "products", Component: Products },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardRedirect></DashboardRedirect> },
      {
        path: "my-profile",
        element: (
          <User>
            <MyProfile></MyProfile>
          </User>
        ),
      },
      { path: "add-product", Component: AddProduct },
      { path: "my-products", Component: MyProducts },
      {
        path: "update-product/:id",
        loader: ({ params }) =>
          fetch(
            `https://tech-trove-server-eta.vercel.app/products/${params.id}`
          ),
        Component: UpdateProduct,
      },
      {
        path: "products-queue",
        element: (
          <ModeratorRoute>
            <ProductsQueue></ProductsQueue>
          </ModeratorRoute>
        ),
      },
      {
        path: "reported-products",
        element: (
          <ModeratorRoute>
            <ReportedProducts></ReportedProducts>
          </ModeratorRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "add-coupon",
        element: (
          <AdminRoute>
            <AdminAddCoupon></AdminAddCoupon>
          </AdminRoute>
        ),
      },
      {
        path: "statistics",
        element: (
          <AdminRoute>
            <AdminStatistics></AdminStatistics>
          </AdminRoute>
        ),
      },
    ],
  },
]);
