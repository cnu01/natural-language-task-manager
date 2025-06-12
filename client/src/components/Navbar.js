import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Natural Language Task Manager
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
