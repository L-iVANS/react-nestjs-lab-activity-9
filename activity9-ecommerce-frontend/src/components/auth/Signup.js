import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { validatePassword } from "../../utils/passwordValidator";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import DarkModeToggle from "../common/DarkModeToggle";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, token } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [],
    passed: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordValidation(validatePassword(password));
    setApiError("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setApiError("Please meet all password requirements before signing up.");
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        "guest"
      );
      
      // Redirect to home after successful signup
      navigate("/");
    } catch (error) {
      setApiError(error.message || "An error occurred during signup. Please try again.");
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
        <h2 className={`text-base font-semibold text-center ${
          isDarkMode ? 'text-indigo-400' : 'text-gray-900'
        }`}>
          Create Your Account
        </h2>
        <p className={`text-xs mb-6 text-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-900'
        }`}>
          Join the Chat Room to start messaging.
        </p>
        <hr className={`mb-6 ${
          isDarkMode ? 'bg-gray-700 border-gray-700' : 'bg-[#D1D9E0]'
        }`} />

        <form className="text-left" onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2">
            <div className="w-1/2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>First Name <span className="text-red-500">*</span></label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D9E0' }}
                type="text"
                id="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>Last Name <span className="text-red-500">*</span></label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D9E0' }}
                type="text"
                id="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style={{ borderColor: isDarkMode ? '#4B5563' : '#D1D9E0' }}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Password <span className="text-red-500">*</span>  
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 ${
                formData.password === ""
                  ? "focus:ring-blue-500"
                  : passwordValidation.isValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
              style={{ borderColor: formData.password === "" ? (isDarkMode ? '#4B5563' : '#D1D9E0') : undefined }}
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handlePasswordChange}
            />
          </div>

          {/* Password Validation Messages */}
          {formData.password && passwordValidation.errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md">
              <p className="text-xs font-medium text-red-600 mb-2">Password requirements not met:</p>
              <ul className="text-xs text-red-600 space-y-1">
                {passwordValidation.errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-red-500">✗</span> {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {apiError}
            </div>
          )}

          <button
            className={`w-full py-2 rounded-md transition duration-200 font-medium ${
              passwordValidation.isValid && formData.email && formData.firstName && formData.lastName && !isLoading
                ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!passwordValidation.isValid || !formData.email || !formData.firstName || !formData.lastName || isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>

      <div className={`w-96 border p-4 shadow-sm transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-[#D1D9E0]'
      }`} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: '1rem' }}>
        <p className={`text-center text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-900'
        }`}>
          Already have an account?{" "}
          <Link to="/login" className={isDarkMode ? 'text-indigo-400 hover:underline' : 'text-blue-500 hover:underline'}>
            Sign In.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;