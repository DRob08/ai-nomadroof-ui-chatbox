// src/components/Community.tsx
import React from "react";

const communityImages = [
  "/images/community/nomadroof-events-1.png",
  "/images/community/nomadroof-events-2.png",
  "/images/community/nomadroof-events-3.png",
  "/images/community/nomadroof-events-4.png",
];

const Community = () => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Nomadroof Community Moments
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Glimpses from our community events held every semester
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {communityImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Community event ${index + 1}`}
            className="rounded-xl shadow-md object-cover h-64 w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Community;
