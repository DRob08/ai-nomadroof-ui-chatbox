import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Community from "./pages/Community";
import GAListener from "./components/GAListener"; // ✅ Pageview tracker

function App() {
  return (
    <Router>
      <GAListener />
      <div className="min-h-screen flex flex-col bg-gray-10">
        <Header />
        {/* Removed max-w-4xl here to allow full-width layout */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
