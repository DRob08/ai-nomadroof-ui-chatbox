import React from "react";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mt-10 space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Nomadroof AI Chatbox</h1>
        <p className="text-gray-600 text-lg">Your smart assistant for searching and finding a flat that fits your needs.</p>
      </div>

      <div className="mx-auto" style={{ maxWidth: "1000px" }}>
  <ChatBox />
</div>
    </div>
  );
};

export default Home;
