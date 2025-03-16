
import React, { useState, useEffect } from "react";

const Meeting_Table = () => {
  const [meetings, setMeetings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const meetingsPerPage = 10;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust based on how you store auth token
        const response = await fetch("http://localhost:5001/api/meetings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include auth token
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch meetings");
  
        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings([]); // Prevent blank page
      }
    };
  
    fetchMeetings();
  }, []);
  
  // Function to convert time to a comparable format
  const convertToDateTime = (date, time) => new Date(`${date} ${time}`);

  // Find the closest upcoming meeting
  const closestMeetingIndex = (() => {
    const now = new Date();
    let closestIndex = -1;
    let minDiff = Infinity;

    meetings.forEach((meeting, index) => {
      const meetingTime = convertToDateTime(meeting.date, meeting.time);
      const diff = meetingTime - now;

      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  })();

  // Pagination logic
  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

  const totalPages = Math.ceil(meetings.length / meetingsPerPage);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-200 p-[1vw] md:pb-[0.5vh] md:p-[1vw] md:mt-[4vh] pt-[6vh]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border w-[3vw] border-gray-400 px-4 py-2">SN</th>
              <th className="border w-[13vw] border-gray-400 px-4 py-2">Date</th>
              <th className="border w-[10vw] border-gray-400 px-4 py-2">Time</th>
              <th className="border w-[22vw] border-gray-400 px-4 py-2">Meeting Type</th>
              <th className="border w-[22vw] border-gray-400 px-4 py-2">Location</th>
              <th className="border w-[30vw] border-gray-400 px-4 py-2">Description</th>
              <th className="border w-[30vw] border-gray-400 px-4 py-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {currentMeetings.map((meeting, index) => (
              <tr key={index} className={`text-center hover:bg-gray-100 odd:bg-white ${index === closestMeetingIndex ? "border-red-500 border-3" : "border-gray-400"}`}>
                <td className="border border-gray-400 px-4 py-2">{meeting.id}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.date}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.time}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.type}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.location}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.description}</td>
                <td className="border border-gray-400 px-4 py-2">{meeting.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-500 text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-500 text-white rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Meeting_Table;




