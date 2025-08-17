import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import Logo from "../logo/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    if (isHome) {
      window.addEventListener("scroll", onScroll);
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const navClasses = `${
    isHome && !scrolled
      ? "bg-transparent text-white"
      : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow"
  } fixed top-0 left-0 w-full z-50 transition-all duration-300`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logOut } = useAuth();
  const profileRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const menu = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "hover:text-blue-500 dark:hover:text-blue-400"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "hover:text-blue-500 dark:hover:text-blue-400"
          }
        >
          Products
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "hover:text-blue-500 dark:hover:text-blue-400"
          }
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "hover:text-blue-500 dark:hover:text-blue-400"
          }
        >
          Contact Us
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-8 relative">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className={`text-2xl ${
              isHome && !scrolled
                ? "text-white"
                : "text-gray-700 dark:text-white"
            }`}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Logo */}
        <div className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium">{menu}</ul>

        {/* Right Side: Login / Profile */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login">
                <button className="hidden md:inline-block px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="hidden md:inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-4 border-green-500 cursor-pointer"
                onClick={toggleProfile}
                title={user.displayName}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50">
                  <p className="px-4 py-2 font-medium text-gray-700 dark:text-white">
                    {user.displayName || "User"}
                  </p>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logOut();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
          <ul className="space-y-2 font-medium">{menu}</ul>
          {!user && (
            <div className="pt-2">
              <Link to="/login">
                <button className="w-full mb-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
