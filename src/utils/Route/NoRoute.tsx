import React from "react";

const NoRoute = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-8 ">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-2xl text-gray-600">The requested page does not exist.</p>
      </div>
    </div>
  );
};

export default NoRoute;
