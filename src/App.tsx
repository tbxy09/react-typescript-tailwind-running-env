import "./App.css";
import React from 'react';

const TaskListPro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to TaskList Pro</h1>
        <p className="text-gray-600 mb-8 text-center">Enter your email address to get started</p>

        <div className="mb-4">
          <input
            type="email"
            placeholder="name@yourcompany.com"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
        </div>

        <button className="w-full px-3 py-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none mb-2">
          Continue with Email
        </button>

        <p className="text-center text-gray-600 mb-4">OR</p>

        <button className="w-full px-3 py-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none mb-2">
          Continue with Google
        </button>

        <button className="w-full px-3 py-4 text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none">
          Continue with Apple
        </button>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default TaskListPro;

