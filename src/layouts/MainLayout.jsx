import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./nablink.css";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="bg-base-200">
      <Navbar />
      <main className={`${!isHome ? "pt-[72px]" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
