import React,{useState} from 'react'
import { Link, useLocation } from "react-router-dom";
import Meeting_Table from './Meeting_Table';

const Meeting_Filter = ()=>
{
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); //  Get the current route
    const handleIsOpen = () => setIsOpen(!isOpen);
    return ( 
        <>
            {/* Filtering meeting */ }
            <div className=" bg-gray-200 p-1 md:pt-[1vh]  md:mt-[1vh]">
                <h2 className="text-2xl text-center font-bold p-[1vh] md:pt-[5.5vh] md:pb-[3vh]">Meeting Schedule</h2>
            </div>

                    {/* using aboslute position, so div will be positioned according to it's nearest relative ancestor or window -> used for Floating Effect */}
            <div className=' absolute top-[25vh] md:top-[34vh]  
                            left-[4vw] md:left-[22vw]  lg:left-[24vw] xl:left-[29vw]
                            right-[4vw] md:right-[22vw] lg:right-[24vw] xl:right-[29vw]
                             w-[90vw] md:w-[54vw] lg:w-[50vw] xl:w-[40vw]
                            rounded-4xl
                            bg-gray-300 '>
                        
                        {/*  Desktop View */}
                        {/* md: it applies css for display with pixel > apprx. 750 , ones with no specifiers are known as default that apply css only if all specified display sizes req. don't meet*/}
                        <div className=" w-[90vw] md:w-[54vw] lg:w-[50vw] xl:w-[40vw] 
                                        min-h-[4vh] 
                                        pl-[2vw] md:pl-[4vw] lg:pl-[5vw] xl:pl-[4.5vw]
                                        pr-[2vw] md:pr-[4vw] lg:pr-[5vw] xl:pr-[4.5vw] 
                                        flex justify-between items-center">
                        
                            <Link 
                                to="/yesterday" 
                                className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900 
                                ${location.pathname === "/yesterday" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}      
                                    >{/* ternary operator*/ }
                                Yesterday
                            </Link>
                            <Link 
                                to="/" 
                                className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900 
                                ${location.pathname === "/" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}      
                                >{/* ternary operator */}
                                Today
                            </Link>
                            <Link 
                                to="/tomorrow" 
                                className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900 
                                ${location.pathname === "/tomorrow" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}      
                                >{/* ternary operator */}
                                Tommorrow
                            </Link>
                            <Link 
                                to="/overmorrow" 
                                className={`text-black p-[0.5vw]  hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900  
                                ${location.pathname === "/overmorrow" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}      
                                >{/* ternary operator*/ }
                                Overmorrow
                            </Link>
                        </div>
                        
   
            </div>
        </>
    );
        
}

export default Meeting_Filter;
/*


import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Meeting_Table from './Meeting_Table';

const Meeting_Filter = () => {
  const [data, setData] = useState([]);
  const location = useLocation(); // Get the current route
  const [filter, setFilter] = useState(""); // Filter state

  // Fetch data when filter changes
  const handleFetchData = async (filter) => {
    try {
      const response = await fetch(`http://localhost:5001/data?filter=${filter}`);
      const result = await response.json();
      setData(result); // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Effect hook that runs when the filter state changes
  useEffect(() => {
    if (filter) {
      handleFetchData(filter);
    }
  }, [filter]);

  return (
    <>
      {/* Filtering meeting }
      <div className="bg-gray-200 p-1 md:pt-[1vh] md:mt-[1vh]">
        <h2 className="text-2xl text-center font-bold p-[1vh] md:pt-[5.5vh] md:pb-[3vh]">
          Meeting Schedule
        </h2>
      </div>

      {/* Floating div for buttons }
      <div className="absolute top-[25vh] md:top-[34vh] left-[4vw] md:left-[22vw] lg:left-[24vw] xl:left-[29vw]
                      right-[4vw] md:right-[22vw] lg:right-[24vw] xl:right-[29vw]
                      w-[90vw] md:w-[54vw] lg:w-[50vw] xl:w-[40vw] rounded-4xl bg-gray-300">
        <div className="w-[90vw] md:w-[54vw] lg:w-[50vw] xl:w-[40vw]
                        min-h-[4vh] pl-[2vw] md:pl-[4vw] lg:pl-[5vw] xl:pl-[4.5vw]
                        pr-[2vw] md:pr-[4vw] lg:pr-[5vw] xl:pr-[4.5vw] 
                        flex justify-between items-center">
          <Link
            to="/yesterday"
            onClick={() => setFilter('yesterday')}
            className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900
                        ${location.pathname === "/yesterday" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}
          >
            Yesterday
          </Link>
          <Link
            to="/"
            onClick={() => setFilter('today')}
            className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900
                        ${location.pathname === "/" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}
          >
            Today
          </Link>
          <Link
            to="/tomorrow"
            onClick={() => setFilter('tomorrow')}
            className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900
                        ${location.pathname === "/tomorrow" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}
          >
            Tomorrow
          </Link>
          <Link
            to="/overmorrow"
            onClick={() => setFilter('overmorrow')}
            className={`text-black p-[0.5vw] hover:text-gray-300 hover:rounded-4xl hover:bg-gray-900
                        ${location.pathname === "/overmorrow" ? "bg-green-500 p-[0.5vw] text-white rounded-4xl" : ""}`}
          >
            Overmorrow
          </Link>
        </div>
      </div>

      {/* Display the filtered data }
      <Meeting_Table data={data} />
    </>
  );
};

export default Meeting_Filter;
*/
