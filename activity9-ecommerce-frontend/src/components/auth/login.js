import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import DarkModeToggle from "../common/DarkModeToggle";

const Login = () => {
  const navigate = useNavigate();
  const { login, token, user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      // Redirect based on role (using replace to prevent back button)
      if (response.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 justify-center items-center h-screen transition-all duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-indigo-100 via-white to-indigo-200'
    }`}>
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className={`w-96 border p-8 shadow-sm transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-[#D1D9E0]'
      }`} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: '1rem' }}>
        <img
          src="/logo.png"
          alt="Logo"
          className={`mx-auto mb-4 w-20 h-20 border rounded-full ${
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-[#D1D9E0] bg-white'
          }`}
        />
        <h2 className={`text-base font-semibold mb-6 text-center ${
          isDarkMode ? 'text-indigo-400' : 'text-gray-900'
        }`}>
          Sign in to Access Chat Room
        </h2>
        <hr className={`mb-6 ${
          isDarkMode ? 'bg-gray-700 border-gray-700' : 'bg-[#D1D9E0]'
        }`} />

        <form className="text-left" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>Email</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D9E0' }}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>Password</label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-white text-gray-900"
                style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D9E0' }}
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

          {/* Error Message */}
          {error && (
            <div className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>Remember me</label>
            </div>
            <Link
              to="/forgot-password"
              className={isDarkMode ? 'text-indigo-400 hover:underline' : 'text-blue-500 hover:underline'}
            >
              Forgot password?
            </Link>
          </div>
          <button
            className={`w-full py-2 rounded-md transition duration-200 font-medium ${
              email && password && !isLoading
                ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!email || !password || isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <div className={`w-96 border p-4 shadow-sm flex flex-col gap-2 items-center transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-[#D1D9E0]'
      }`} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: '1rem' }}>
        <p className={`text-center text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-900'
        }`}>
          Don't have an account?{" "}
          <Link to="/signup" className={isDarkMode ? 'text-indigo-400 hover:underline' : 'text-blue-500 hover:underline'}>
            Create an Account.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
