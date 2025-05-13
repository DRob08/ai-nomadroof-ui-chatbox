import React, { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import ExclusiveSidebar from "../components/ExclusiveSidebar";
import { PropertyModel } from "../types/property";
import { getAvailableExclusiveProperties } from '../services/propertyService';
import Community from "../components/Community"; // Add this line





const Home = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAvailableExclusiveProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error loading exclusive properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-x-8">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full mb-8 md:mb-0">
        <ExclusiveSidebar properties={properties} />
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
        <Community /> {/* Add this line */}
      </div>
    </div>
  );
};

export default Home;
