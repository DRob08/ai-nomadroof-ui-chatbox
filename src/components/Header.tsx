import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optional: Install `lucide-react` for icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Nomadroof Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-semibold text-gray-800">Nomadroof</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/community" className="text-gray-700 hover:text-blue-600 font-medium">
            Community
          </Link>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-2 px-6 pb-4 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/community"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Community
          </Link>
          <a
            href="#"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
