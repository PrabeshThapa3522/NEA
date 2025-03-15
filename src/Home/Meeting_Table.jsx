import React, { useState } from "react";


const Meeting_Table = () => {
  const [meetings, setMeeting] = useState([
    { id: 1, date: "2025-03-11", type: "Project Discussion", location: "Hayat Hotel", description: "Discuss project timeline and deliverables.", time: "10:00 AM" },
    { id: 2, date: "2025-03-10", type: "Client Meeting", location: "Soltie Hotel", description: "Meeting with the client to present progress.", time: "11:50 AM" },
    { id: 3, date: "2025-03-16", type: "Client Meeting", location: "Kalanki", description: "Meeting with the client to present progress.", time: "1:37 AM" },
    { id: 4, date: "2025-03-11", type: "Team Sync", location: "Office", description: "Weekly team sync-up meeting.", time: "3:00 PM" },
    { id: 5, date: "2025-03-12", type: "Budget Review", location: "Conference Room", description: "Reviewing the financial reports.", time: "9:00 AM" },
    { id: 6, date: "2025-03-13", type: "Planning Session", location: "Online", description: "Planning the next quarter goals.", time: "4:30 PM" },
    { id: 7, date: "2025-03-14", type: "Strategy Meeting", location: "Office", description: "Discussing company growth strategy.", time: "2:00 PM" },
    { id: 8, date: "2025-03-15", type: "Stakeholder Meeting", location: "Hotel Everest", description: "Quarterly meeting with stakeholders.", time: "11:00 AM" },
    { id: 9, date: "2025-03-11", type: "Project Discussion", location: "Hayat Hotel", description: "Discuss project timeline and deliverables.", time: "10:00 AM" },
    { id: 10, date: "2025-03-10", type: "Client Meeting", location: "Soltie Hotel", description: "Meeting with the client to present progress.", time: "11:50 AM" },
    { id: 11, date: "2025-03-16", type: "Client Meeting", location: "Kalanki", description: "Meeting with the client to present progress.", time: "1:37 AM" },
    { id: 12, date: "2025-03-11", type: "Team Sync", location: "Office", description: "Weekly team sync-up meeting.", time: "3:00 PM" },
    { id: 13, date: "2025-03-12", type: "Budget Review", location: "Conference Room", description: "Reviewing the financial reports.", time: "9:00 AM" },
    { id: 14, date: "2025-03-13", type: "Planning Session", location: "Online", description: "Planning the next quarter goals.", time: "4:30 PM" },
    { id: 15, date: "2025-03-14", type: "Strategy Meeting", location: "Office", description: "Discussing company growth strategy.", time: "2:00 PM" },
    { id: 16, date: "2025-03-15", type: "Stakeholder Meeting", location: "Hotel Everest", description: "Quarterly meeting with stakeholders.", time: "11:00 AM" },
  
  ]);

  

  // Function to convert time to a comparable format
  const convertToDateTime = (date, time) => {
    return new Date(`${date} ${time}`);
  };

  // Find the closest upcoming meeting
  const closestMeetingIndex = (() => {
    const now = new Date();
    let closestIndex = -1;
    let minDiff = Infinity;

    meetings.forEach((meeting, index) => {
      const meetingTime = convertToDateTime(meeting.date, meeting.time);
      const diff = meetingTime - now; // Difference in milliseconds

      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  })();

  // pagination 
  // Pagination state // new
  const [currentPage, setCurrentPage] = useState(1); // new
  const meetingsPerPage = 10; // new

  // Calculate the range of meetings to show // new
  const indexOfLastMeeting = currentPage * meetingsPerPage; // new
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage; // new
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting); // new


    // Pagination handlers // new
    const totalPages = Math.ceil(meetings.length / meetingsPerPage); // new
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)); // new
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1)); // new

  return (
    <>
   
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls // new */}
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
    </>
  );
};

export default Meeting_Table;
