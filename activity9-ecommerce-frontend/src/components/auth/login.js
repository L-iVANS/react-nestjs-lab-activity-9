import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen ">
      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
        <img
          src="/logo.png"
          alt="Logo"
          className="mx-auto mb-4 w-20 h-20 border rounded-full border-[#D1D9E0] bg-white"
        />
        <h2 className="text-base font-semibold mb-6 text-center">
          Sign in to Access Chat Room
        </h2>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          {/* For input validation remove or add hidden in className */}
          <div
            className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2 hidden"
            id="error-message"
          >
            error message
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label className="text-sm">Remember me</label>
            </div>
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>

      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create an Account.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
