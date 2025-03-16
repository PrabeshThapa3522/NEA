import React,{useState} from "react";
import {handleDelete,handleEdit, meetings} from "./Add";

const Table = ()=>
{
    const [time, setTime] = useState("");
    
      // Function to convert 24-hour time to 12-hour AM/PM format
      const formatTime = (timeStr) => {
        if (!timeStr) return ""; // Handle empty input
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
        return `${formattedHour}:${minutes} ${ampm}`;
      };

      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    };

    const payload = {
        date: newMeeting.date, // Convert to string explicitly
        type: newMeeting.type.trim(),
        location: newMeeting.location.trim(),
        description: newMeeting.description.trim(),
        time: newMeeting.time.trim(), // Ensure time is in string format
        priority: newMeeting.priority || "normal", // Include priority field
    };


    return(
        <>
            {/* Added meeting table */}
            <div className="overflow-x-auto p-1 md:p-4 md:mt-[1vh]">
                <table className="md:mt-[60vh] w-full border-collapse border border-gray-400">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className='border w-[3vw] p-2'>SN</th>
                            <th className="border w-[11vw] p-2">Date</th>
                            <th className="border w-[9vw] p-2">Time</th>
                            <th className="border w-[21vw] p-2">Meeting Type</th>
                            <th className="border w-[22vw] p-2">Location</th>
                            <th className="border w-[24vw] p-2">Description</th>
                            <th className="border w-[10vw] p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {meetings.map((meeting, index) => (
                            <tr key={index} className="text-center  hover:bg-gray-100 odd:bg-white">
                            <td className='border w-[] p-2'>{meeting.id}</td>
                            <td className="border w-[] p-2">{formatDate(meeting.date)}</td>
                            <td className="border w-[] p-2">{formatTime(meeting.time)}</td>
                            <td className="border w-[] p-2">{meeting.type}</td>
                            <td className="border w-[] p-2">{meeting.location}</td>
                            <td className="border w-[] p-2">{meeting.description}</td>
                            
                            <td className="border w-[] p-2">
                                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Edit</button>
                                <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                </table>
                
            </div>
        </>
    );
}

export default Table;