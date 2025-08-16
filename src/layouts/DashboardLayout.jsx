import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaUserCircle,
  FaPlus,
  FaBoxes,
  FaClipboardList,
  FaFlag,
  FaChartPie,
  FaUsersCog,
  FaTicketAlt,
} from "react-icons/fa";
import { HiMiniViewColumns } from "react-icons/hi2";
import Logo from "../components/logo/Logo";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Page content here */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 pt-10 pl-10">
          <Logo></Logo>
          {/* Sidebar content here */}
          {role === "user" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/my-profile"
                  className="flex items-center gap-2"
                >
                  <FaUserCircle /> My Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-product"
                  className="flex items-center gap-2"
                >
                  <FaPlus /> Add Product
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/my-products"
                  className="flex items-center gap-2"
                >
                  <FaBoxes /> My Products
                </NavLink>
              </li>
            </>
          )}

          {role === "moderator" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/products-queue"
                  className="flex items-center gap-2"
                >
                  <HiMiniViewColumns />
                  Products Queue
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/reported-products"
                  className="flex items-center gap-2"
                >
                  <FaFlag /> Reported Products
                </NavLink>
              </li>
            </>
          )}

          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/statistics"
                  className="flex items-center gap-2"
                >
                  <FaChartPie />
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manage-users"
                  className="flex items-center gap-2"
                >
                  <FaUsersCog /> Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-coupon"
                  className="flex items-center gap-2"
                >
                  <FaTicketAlt /> Add Coupon
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
