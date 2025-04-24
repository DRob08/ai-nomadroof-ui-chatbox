import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png" // or "logo.svg" etc.
            alt="Nomadroof Logo"
            className="h-16 w-auto object-contain"
          />
          <span className="text-xl font-semibold text-gray-800">Nomadroof</span>
        </div>

        {/* Right: Navigation */}
        <nav className="space-x-6 hidden md:flex">
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
