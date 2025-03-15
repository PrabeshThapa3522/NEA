  /*
  import React from "react";
  import { Link, useNavigate } from "react-router-dom";

  const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', { // Correct API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          localStorage.setItem("token", data.token); // Store token in localStorage

          // Redirect to Home page
          navigate("/");
        } else {
          setErrorMessage(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("An error occurred, please try again.");
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="relative w-full max-w-md p-8 bg-opacity-30 backdrop-blur-md bg-gray-300 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className=" mx-auto mb-4 items-center justify-center">
              <img src="./nea_logo.png" alt="NEA LOGO"></img>
            </div>
          </div>
                    
          <div>
            <h2 className="text-xl font-semibold text-center mt-3 ">Login</h2>
          {/* action={} }
          <form className="mt-6" method="post" >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 bg-gray-200 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-200 bg-opacity-50  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Sign In
            </button>
          </form>

          {/* SIgnup or login }
          <div>
            <div className="mt-4 text-sm text-gray-700 text-center">
                  Doesn't have an account?
                <Link to="/register" className="mt-4 pl-2 text-sm text-gray-900 text-center hover:text-blue-600">Sign Up</Link>
            </div>  
            
          </div>     
          
          </div>
        </div>
      </div>
    );
  };

  export default Login;
  */



  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

  const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', { // Correct API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          localStorage.setItem("token", data.token); // Store token in localStorage

          // Redirect to Home page
          navigate("/");
        } else {
          setErrorMessage(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("An error occurred, please try again.");
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="relative w-full max-w-md p-8 bg-opacity-30 backdrop-blur-md bg-gray-300 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 items-center justify-center">
              <img src="./nea_logo.png" alt="NEA LOGO" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-3">MD Login</h2>

          {errorMessage && <div className="mb-4 text-center text-red-600">{errorMessage}</div>}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-200 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-200 bg-opacity-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Log In
            </button>
            <Link to="/register">
              <button type="button" className="m-1 w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Register
              </button>
            </Link>
          </form>
        </div>
      </div>
    );
  };

  export default Login;


