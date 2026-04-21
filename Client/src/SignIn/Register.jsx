import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // needs to be removed
import { signupUser } from "../api/apiHelper";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { jwtDecode } from 'jwt-decode';  // Changed from default import to named import

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",    // phoneNumber: "+977",
    password: "",
    confirmpassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSessionAlert, setShowSessionAlert] = useState(false);

  // Session expiration check
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handleSessionExpiration();
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    };

    // Initial check
    checkTokenExpiration();

    // Check every 60 seconds
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSessionExpiration = () => {
    localStorage.removeItem("token");
    setShowSessionAlert(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^\d+]/g, '');
      if (numericValue.length > 10) return;
      setFormData({ ...formData, [name]: numericValue });
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.phoneNumber || !formData.password ||
      !formData.confirmpassword || !formData.role) {
      setAlertMessage("All fields are required.");
      setIsError(true);
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setAlertMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setAlertMessage("Incorrect phone number.");
      setIsError(true);
      return;
    }

    // Password validation (uppercase, special character, min 6 chars)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setAlertMessage("Password must have at least one uppercase letter, one special character, and be at least 6 characters long.");
      setIsError(true);
      return;
    }

    try {
      const response = await signupUser(formData);
      if (response.data.success) {
        setAlertMessage("User registered successfully!");
        setIsError(false);
        setFormData({
          username: "",
          phoneNumber: "",
          password: "",
          confirmpassword: "",
          role: ""
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpiration();
      } else {
        setAlertMessage(error.response?.data?.message || "Signup failed, try again!");
        setIsError(true);
      }
    }
  };

  const handleCopyPaste = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center mt-[8vh]">
      {/* Session Expiration Modal */}
      {showSessionAlert && (
        <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">⏳ Session Expired</h3>
              <p className="mb-4">Your session has expired. Please log in again.</p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-auto h-auto max-w-md px-10 py-6 bg-gray-300 rounded-2xl">
        {alertMessage && (
          <div className={`mt-4 text-center text-lg py-2 rounded-4xl ${isError ? "bg-red-500 text-gray-200" : "bg-green-500 text-gray-200"
            }`}>
            {alertMessage}
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Existing form fields remain the same */}
          {/* Username Field */}
          <div className="mb-4 flex space-x-2">
            <div className="text-2xl m-2">
              <FaUserAlt />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone number field */}
          <div className="mb-4 flex space-x-2">
            <div className="text-2xl m-2">
              <FaPhoneVolume />
            </div>
            <input
              type="text"
              
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 flex space-x-2 items-center">
            <div className="text-2xl m-2">
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onCopy={handleCopyPaste}
              onPaste={handleCopyPaste}
              onCut={handleCopyPaste}
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 flex space-x-2 items-center">
            <div className="text-2xl m-2">
              <FaLock />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleInputChange}
              onCopy={handleCopyPaste}
              onPaste={handleCopyPaste}
              onCut={handleCopyPaste}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 bg-gray-100 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Role Selection*/}

          <div className=" flex text-xl space-x-[2vw] items-center">
            {/* <label className="text-xl font-sans pl-2 "> Role</label> */}
            <div className="text-2xl m-2 mr-5">
              <FaUsersCog />
            </div>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="MD"
                checked={formData.role === "MD"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <span>MD</span>
            </label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="PA"
                checked={formData.role === "PA"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <span>PA</span>
            </label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="GM"
                checked={formData.role === "GM"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <span>GM</span>
            </label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={formData.role === "Admin"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <span>Admin</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="py-2 w-40 text-white bg-blue-600 rounded-4xl hover:bg-blue-800"
            >
              Add
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-700 text-center">
            Already have an account?
            <Link to="/" className="pl-2 text-sm text-gray-900 hover:text-blue-600">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;