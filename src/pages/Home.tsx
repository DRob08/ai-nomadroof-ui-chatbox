import React from "react";
import ChatBox from "../components/ChatBox";
import ExclusiveSidebar from "../components/ExclusiveSidebar";

const mockProperties = [
  {
    id: "1",
    name: "Ocean View Penthouse",
    image: "/images/penthouse.jpg",
    price: "From $450/night",
    location: "Malibu, CA",
  },
  {
    id: "2",
    name: "Historic Castle Stay",
    image: "/images/castle.jpg",
    price: "From $600/night",
    location: "Edinburgh, Scotland",
  },
  {
    id: "3",
    name: "Modern Loft in Soho",
    image: "/images/loft.jpg",
    price: "From $300/night",
    location: "New York, NY",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-x-8">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full mb-8 md:mb-0">
        <ExclusiveSidebar properties={mockProperties} />
      </div>

      {/* Main */}
      <div className="flex-1 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to Nomadroof AI Chatbox
          </h1>
          <p className="text-gray-600 text-lg">
            Your smart assistant for searching and finding a flat that fits your needs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Home;
