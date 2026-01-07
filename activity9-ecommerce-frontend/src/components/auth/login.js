import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";



const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //if admin@example.com, go to /admin, else /home
    if (email === "admin@example.com") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen bg-gradient-to-r from-indigo-100 via-white to-indigo-200">
      <div className="w-96 bg-white/90 border border-[#D1D9E0] p-8 shadow-sm" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: '1rem' }}>
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.02c1.64 4.09 5.82 7.23 10.066 7.23 2.042 0 3.97-.613 5.566-1.662M21.065 12.02a10.45 10.45 0 00-1.669-2.547M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.25-2.25l-4.5 4.5m0 0l-4.5 4.5m4.5-4.5l-4.5-4.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25-4.03 8.25-9 8.25-9-3.694-9-8.25zm9 3.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                  </svg>
                )}
              </button>
            </div>
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

      <div className="w-96 bg-white/90 border border-[#D1D9E0] p-4 shadow-sm flex flex-col gap-2 items-center" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: '1rem' }}>
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
