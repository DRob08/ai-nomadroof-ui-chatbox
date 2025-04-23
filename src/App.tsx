import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBox from "./components/ChatBox";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow p-4 max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
