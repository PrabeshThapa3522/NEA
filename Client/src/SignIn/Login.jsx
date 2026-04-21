import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ThunderEffect.css";
import nea from "../assets/NEALOGO.png";
import logo from "../assets/ThunderEffect.png";
import { FaUserAlt, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });


  };
  /*  //user cannot use special character in username
   const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "username") {
    // Allow only letters, numbers, and underscores (no special characters)
    const validUsername = value.replace(/[^a-zA-Z0-9_]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: validUsername,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  } */

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Show loading animation
    setErrorMessage(null); // Clear previous error messages

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem("token", data.token);

            // Clear error message
            setErrorMessage(null);

            // Handle animation and redirect based on role
            setTimeout(() => {
                setLoading(false); // Hide loading animation after 2.5 seconds
                if (data.role === "MD") {
                    navigate("/mdhome");
                } else if (data.role === "PA") {
                    navigate("/home");
                } else if (data.role === "Admin") {
                    navigate("/admin_dashboard");
                } else {
                    navigate("/gm_dashboard");
                }
            }, 2500); // Show animation for 2.5 seconds
        } else {
            // Handle specific error messages
            if (data.message === "Too many login attempts. Please try again after 15 minutes.") {
                setErrorMessage(data.message); // Set rate limit error message
            } else {
                setErrorMessage(data.message || "Login failed. Please try again.");
            }
            setLoading(false); // Hide loading animation if login fails
        }
    } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("An error occurred. Please try again.");
        setLoading(false); // Hide loading animation in case of error
    }
};

  const handleCopyPaste = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative w-full max-w-md p-8 bg-opacity-30 backdrop-blur-4xl bg-gray-200 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 items-center justify-center">
            <img src={nea} alt="NEA LOGO" />
          </div>
        </div>


        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-center text-lg py-2 rounded-4xl bg-red-500 text-gray-200">
            {errorMessage}
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-2">
            <div className="text-2xl m-2">
              <FaUserAlt />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <div className="mb-4 flex space-x-2">
              <div className="text-2xl m-2 ">
                <FaLock />  
              </div>
              <input
                type="password"
                name="password"
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
                onCut={handleCopyPaste}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Animation after login successful */}
          {loading ? (
            <div className="flex justify-center mt-4">
              <div className="flex items-center justify-center h-20 p-0 m-0 bg-transparent">
                <div className="relative flex justify-center mt-1 w-24 h-24">
                  {/* NEA Logo */}
                  <img src={logo} alt="ThunderEffect" className="absolute w-20 h-20" />

                  {/* Flashing Thunder Animation */}
                  <svg
                    className="absolute top-10 left-11 w-11 h-13 transform -translate-x-1/2 -translate-y-1/2"
                    viewBox="0 0 100 100"
                  >
                    <polygon
                      className="fill-[#010c2a] stroke-[#05173df1] stroke-[1] drop-shadow-[0_0_5px_#04377e] opacity-0 animate-thunder-flash"
                      points="48.5,24.5 10,95.5 46.5,51 68,73.5 97.5,1 70,48.5 48.5,24.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 w-40 text-white bg-blue-600 rounded-4xl hover:bg-blue-800"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-700 text-center">
            Don't have an account?
            <Link to="/register" className="pl-2 text-sm text-gray-900 hover:text-blue-600">
              Sign Up
            </Link>

          </div>


        </form>
      </div>
    </div>
  );
};

export default Login;