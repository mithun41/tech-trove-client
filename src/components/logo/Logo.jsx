import React from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.jpg";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-center gap-4">
        <img className="mb-2 w-12 rounded-full" src={logo} alt="" />
        <p className="text-3xl font-bold -ml-2 text-[#E7AD01]">
          <span className="text-[#03B7E8]">Tech</span>Trove
        </p>
      </div>
    </Link>
  );
};

export default Logo;
