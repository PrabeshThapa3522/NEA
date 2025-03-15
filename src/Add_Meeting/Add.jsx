/*import React, { useState, useEffect } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { ADToBS } from "bikram-sambat-js";
import axios from 'axios';
const Add = () => {
    // Function to convert 24-hour time to 12-hour AM/PM format
    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // State for meetings
    const [meetings, setMeetings] = useState([]);
    const [newMeeting, setNewMeeting] = useState({ date: "", type: "", location: "", description: "", time: "", priority: "normal" });
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleChange = (e) => {
        setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
    };

    // nepali date picker functionality
    useEffect(() => {
        // Ensure default date is set on component mount
        setNewMeeting((prev) => ({ ...prev, date: todayBS }));
    }, []); // Runs only once on mount

    const todayBS = ADToBS(new Date()); // Convert AD to BS
    const handleDateChange = (date) => {
        if (date < todayBS) {
            alert("Past Date cannot be selected!!");
            setNewMeeting((prev) => ({ ...prev, date: "" })); // Reset date to empty
        } else {
            setNewMeeting({ ...newMeeting, date });
        }
    };

   
    const handleAddOrEditMeeting = async () => {  // ✅ Add async here
        if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const token = localStorage.getItem("token");
    
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
    
        try {
            let response;
    
            if (editingIndex !== null) {
                response = await axios.put( 
                    `http://localhost:5001/api/meetings/${meetings[editingIndex]._id}`,
                    newMeeting,
                    config
                );
    
                const updatedMeetings = [...meetings];
                updatedMeetings[editingIndex] = response.data;
                setMeetings(updatedMeetings);
                setEditingIndex(null);
            } else {
                response = await axios.post( 
                    "http://localhost:5001/api/meetings",
                    newMeeting,
                    config
                );
    
                setMeetings([...meetings, response.data]);
            }
    
            setNewMeeting({ date: "", type: "", location: "", description: "", time: "", priority: "normal" });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error saving meeting:", error.response ? error.response.data : error.message);
            alert(`Failed to save meeting. Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        }
    };
    
    

    const handleDelete = (index) => {
        setMeetings(meetings.filter((_, i) => i !== index));
    };
    

   
  

    return (
        <>
            {isFormVisible && (
                <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                p-[1vw] md:p-[1vw]
                                mt-[2vh] md:mt-[6vh]
                                w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                bg-white shadow-2xl rounded-2xl relative">
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                        X
                    </button>
                    <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">Manage Meetings</h2>
                    
                    <NepaliDatePicker
                        value={newMeeting.date}
                        onChange={handleDateChange}
                        inputClassName="border p-2 w-full mb-2"
                        placeholder="Select Nepali Date"
                        options={{ calenderLocale: "ne", valueLocale: "en",}} // Ensures localization
                    />

                    <input
                        type="text"
                        name="type"
                        placeholder="Meeting Type"
                        value={newMeeting.type}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newMeeting.location}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newMeeting.description}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="time"
                        name="time"
                        value={newMeeting.time}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />

                    <div className="mb-2">
                        <label className="mr-4">Priority:</label>
                        <label className="mr-2">
                            <input
                                type="radio"
                                name="priority"
                                value="normal"
                                checked={newMeeting.priority === "normal"}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            Normal
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="priority"
                                value="high"
                                checked={newMeeting.priority === "high"}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            High
                        </label>
                    </div>

                    <button
                        onClick={handleAddOrEditMeeting}
                        disabled={!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time}
                        className={`px-4 py-2 rounded-md w-full ${
                            !newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time
                            ? "bg-gray-400 cursor-not-allowed"
                            : editingIndex !== null 
                                ? "bg-yellow-500" // Update Meeting (Yellow)
                                : "bg-green-500" // Add Meeting (Green)
                        }`}
                    >
                        {editingIndex !== null ? "Update Meeting" : "Create Meeting"}
                    </button>
                </div>
            )}

            {/* Add button }
            {!isFormVisible && (
                <div className="flex justify-center p-4 mt-[20px]">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                        Add New
                    </button>
                </div>
            )}

            {/* Added meeting table }
            <div className={`overflow-x-auto p-1 md:p-4 ${isFormVisible ? 'mt-[1vh] md:mt-[1vh]' : 'mt-[2vh] md:mt-[2vh]'}`}>
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border w-[3vw] p-2">SN</th>
                            <th className="border w-[11vw] p-2">Date (BS)</th>
                            <th className="border w-[9vw] p-2">Time</th>
                            <th className="border w-[21vw] p-2">Meeting Type</th>
                            <th className="border w-[22vw] p-2">Location</th>
                            <th className="border w-[24vw] p-2">Description</th>
                            <th className="border w-[10vw] p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting, index) => (
                            <tr key={index} className="text-center hover:bg-gray-100 odd:bg-white">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{meeting.date}</td>
                                <td className="border p-2">{formatTime(meeting.time)}</td>
                                <td className="border p-2">{meeting.type}</td>
                                <td className="border p-2">{meeting.location}</td>
                                <td className="border p-2">{meeting.description}</td>
                                <td className="border p-2">
                                    <button 
                                        onClick={() => handleEdit(index)} 
                                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(index)} 
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Add;



 /* const handleAddOrEditMeeting = () => {
        if (editingIndex !== null) {
            const updatedMeetings = [...meetings];
            updatedMeetings[editingIndex] = newMeeting;
            setMeetings(updatedMeetings);
            setEditingIndex(null);
        } else {
            setMeetings([...meetings, newMeeting]);
        }
        setNewMeeting({ date: "", type: "", location: "", description: "", time: "", priority: "normal" });
        setIsFormVisible(false); // Hide the form after adding a meeting
    };

    const handleEdit = (index) => {
        setNewMeeting(meetings[index]);
        setEditingIndex(index);
        setIsFormVisible(true); // Show the form when editing
    };

    

    import React, { useState, useEffect } from "react";
    import { NepaliDatePicker } from "nepali-datepicker-reactjs";
    import "nepali-datepicker-reactjs/dist/index.css";
    import { ADToBS } from "bikram-sambat-js";
    import axios from 'axios';
    const Add = () => {
        const formatTime = (timeStr) => {
            if (!timeStr) return "";
            const [hours, minutes] = timeStr.split(":");
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? "PM" : "AM";
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        };
    
        // State for meetings
        const [meetings, setMeetings] = useState([]);
        const [newMeeting, setNewMeeting] = useState({
            date: "",
            type: "",
            location: "",
            description: "",
            time: "",
            priority: "normal"
        });
        const [editingIndex, setEditingIndex] = useState(null);
        const [isFormVisible, setIsFormVisible] = useState(true); // Form remains visible after adding a meeting
    
        const handleChange = (e) => {
            setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
        };
    
        // nepali date picker functionality
        useEffect(() => {
            setNewMeeting((prev) => ({ ...prev, date: todayBS }));
        }, []); // Runs only once on mount
    
        const todayBS = ADToBS(new Date());
        const handleDateChange = (date) => {
            if (date < todayBS) {
                alert("Past Date cannot be selected!!");
                setNewMeeting((prev) => ({ ...prev, date: "" }));
            } else {
                setNewMeeting({ ...newMeeting, date });
            }
        };
    
        const handleAddOrEditMeeting = async () => {
            if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
                alert("Please fill in all required fields.");
                return;
            }
    
            const token = localStorage.getItem("token");
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
    
            try {
                let response;
    
                if (editingIndex !== null) {
                    response = await axios.put(
                        `http://localhost:5001/api/meetings/${meetings[editingIndex]._id}`,
                        newMeeting,
                        config
                    );
    
                    const updatedMeetings = [...meetings];
                    updatedMeetings[editingIndex] = response.data;
                    setMeetings(updatedMeetings);
                    setEditingIndex(null);
                } else {
                    response = await axios.post(
                        "http://localhost:5001/api/meetings",
                        newMeeting,
                        config
                    );
    
                    setMeetings([...meetings, response.data]); // Add the new meeting to the list
                }
    
                // Reset the form state after adding or updating
                setNewMeeting({
                    date: "",
                    type: "",
                    location: "",
                    description: "",
                    time: "",
                    priority: "normal"
                });
                
                // Keep the form open for adding more meetings
            } catch (error) {
                console.error("Error saving meeting:", error.response ? error.response.data : error.message);
                alert(`Failed to save meeting. Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        };
    
        /*const handleDelete = (index) => {
            setMeetings(meetings.filter((_, i) => i !== index));
        };


        const handleDelete = async (index) => {
            const meetingId = meetings[index]._id;
            const token = localStorage.getItem("token");
        
            console.log("Token:", token); // Log the token to check if it's there
        
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }
        
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
        
            try {
                // Send DELETE request to backend
                await axios.delete(`http://localhost:5001/api/meetings/${meetingId}`, config);
        
                // Remove meeting from the frontend state
                setMeetings(meetings.filter((_, i) => i !== index));
            } catch (error) {
                console.error("Error deleting meeting:", error.response ? error.response.data : error.message);
                alert(`Failed to delete meeting. Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        };
        
        const handleEdit = (index) => {
            const meeting = meetings[index];
            setNewMeeting(meeting); // Populate the form with the meeting data
            setEditingIndex(index); // Set editing mode
            setIsFormVisible(true); // Keep the form visible for editing
        };
    
        return (
            <>
                {isFormVisible && (
                    <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                    right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                    p-[1vw] md:p-[1vw]
                                    mt-[2vh] md:mt-[6vh]
                                    w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                    bg-white shadow-2xl rounded-2xl relative">
                        <button
                            onClick={() => setIsFormVisible(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                            X
                        </button>
                        <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">Manage Meetings</h2>
                        
                        <NepaliDatePicker
                            value={newMeeting.date}
                            onChange={handleDateChange}
                            inputClassName="border p-2 w-full mb-2"
                            placeholder="Select Nepali Date"
                            options={{ calenderLocale: "ne", valueLocale: "en",}} // Ensures localization
                        />
    
                        <input
                            type="text"
                            name="type"
                            placeholder="Meeting Type"
                            value={newMeeting.type}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newMeeting.location}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newMeeting.description}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="time"
                            name="time"
                            value={newMeeting.time}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
    
                        <div className="mb-2">
                            <label className="mr-4">Priority:</label>
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="normal"
                                    checked={newMeeting.priority === "normal"}
                                    onChange={handleChange}
                                    className="mr-1"
                                />
                                Normal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="high"
                                    checked={newMeeting.priority === "high"}
                                    onChange={handleChange}
                                    className="mr-1"
                                />
                                High
                            </label>
                        </div>
    
                        <button
                            onClick={handleAddOrEditMeeting}
                            disabled={!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time}
                            className={`px-4 py-2 rounded-md w-full ${
                                !newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time
                                ? "bg-gray-400 cursor-not-allowed"
                                : editingIndex !== null 
                                    ? "bg-yellow-500" // Update Meeting (Yellow)
                                    : "bg-green-500" // Add Meeting (Green)
                            }`}
                        >
                            {editingIndex !== null ? "Update Meeting" : "Create Meeting"}
                        </button>
                    </div>
                )}
    
                {/* Add button }
                {!isFormVisible && (
                    <div className="flex justify-center p-4 mt-[20px]">
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                        >
                            Add New
                        </button>
                    </div>
                )}
    
                {/* Added meeting table }
                <div className={`overflow-x-auto p-1 md:p-4 ${isFormVisible ? 'mt-[1vh] md:mt-[1vh]' : 'mt-[2vh] md:mt-[2vh]'}`}>
                    <table className="w-full border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border w-[3vw] p-2">SN</th>
                                <th className="border w-[11vw] p-2">Date (BS)</th>
                                <th className="border w-[9vw] p-2">Time</th>
                                <th className="border w-[21vw] p-2">Meeting Type</th>
                                <th className="border w-[22vw] p-2">Location</th>
                                <th className="border w-[24vw] p-2">Description</th>
                                <th className="border w-[7vw] p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.map((meeting, index) => (
                                <tr key={index}>
                                    <td className="border text-center p-2">{index + 1}</td>
                                    <td className="border text-center p-2">{meeting.date}</td>
                                    <td className="border text-center p-2">{formatTime(meeting.time)}</td>
                                    <td className="border text-center p-2">{meeting.type}</td>
                                    <td className="border text-center p-2">{meeting.location}</td>
                                    <td className="border text-center p-2">{meeting.description}</td>
                                    <td className="border text-center p-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="bg-red-500 text-white px-4 py-1 ml-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };
    
    export default Add;
    
    
    
    
    // This code is perfectly fine but issue in Edit
    import React, { useState, useEffect } from "react";
    import { NepaliDatePicker } from "nepali-datepicker-reactjs";
    import "nepali-datepicker-reactjs/dist/index.css";
    import { ADToBS } from "bikram-sambat-js";
    import axios from 'axios';
    
    const Add = () => {
        const formatTime = (timeStr) => {
            if (!timeStr) return "";
            const [hours, minutes] = timeStr.split(":");
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? "PM" : "AM";
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        };
    
        // State for meetings
        const [meetings, setMeetings] = useState([]);
        const [newMeeting, setNewMeeting] = useState({
            date: "",
            type: "",
            location: "",
            description: "",
            time: "",
            priority: "normal"
        });
        const [editingIndex, setEditingIndex] = useState(null);
        const [isFormVisible, setIsFormVisible] = useState(true); // Form remains visible after adding a meeting
    
        const handleChange = (e) => {
            setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
        };
    
        // Nepali date picker functionality
        useEffect(() => {
            setNewMeeting((prev) => ({ ...prev, date: todayBS }));
        }, []); // Runs only once on mount
    
        const todayBS = ADToBS(new Date());
        const handleDateChange = (date) => {
            if (date < todayBS) {
                alert("Past Date cannot be selected!!");
                setNewMeeting((prev) => ({ ...prev, date: "" }));
            } else {
                setNewMeeting({ ...newMeeting, date });
            }
        };
    

        const handleAddOrEditMeeting = async () => {
            if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
                alert("Please fill in all required fields.");
                return;
            }
        
            const token = localStorage.getItem("token");
        
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }
        
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
        
            try {
                let response;
        
                if (editingIndex !== null) {
                    response = await axios.put(
                        `http://localhost:5001/api/meetings/${meetings[editingIndex]._id}`,
                        newMeeting,
                        config
                    );
        
                    // Update the meetings array directly in state
                    const updatedMeetings = [...meetings];
                    updatedMeetings[editingIndex] = response.data;
                    setMeetings(updatedMeetings);
                    setEditingIndex(null); // Reset editing state
                } else {
                    response = await axios.post(
                        "http://localhost:5001/api/meetings",
                        newMeeting,
                        config
                    );
        
                    // Directly update meetings state with the new meeting
                    setMeetings(prevMeetings => [...prevMeetings, response.data]); // Add new meeting to the state
                }
        
                // Reset form after adding or editing
                setNewMeeting({
                    date: todayBS,
                    type: "",
                    location: "",
                    description: "",
                    time: "",
                    priority: "normal"
                });
            } catch (error) {
                console.error("Error saving meeting:", error);
            }
        };
        
        const handleDelete = async (index) => {
            const meetingId = meetings[index]._id;
            const token = localStorage.getItem("token");

               const response = await fetch('/deleteMeeting', {
                method: 'DELETE',
                   headers: {
                 'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}` // Correctly adding the token here
  },
  body: JSON.stringify({ meetingId: id }),
});
        
            console.log("Token:", token); // Check the token in the console
        
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }
        
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
        
            try {
                // Send DELETE request to backend
                await axios.delete(`http://localhost:5001/api/meetings/${meetingId}`, config);
        
                // Remove meeting from the frontend state
                setMeetings(meetings.filter((_, i) => i !== index));
            } catch (error) {
                console.error("Error deleting meeting:", error.response ? error.response.data : error.message);
                alert(`Failed to delete meeting. Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        };
        
    
        const handleEdit = (index) => {
            const meeting = meetings[index];
            setNewMeeting(meeting); // Populate the form with the meeting data
            setEditingIndex(index); // Set editing mode
            setIsFormVisible(true); // Keep the form visible for editing
        };
    
        return (
            <>
                {isFormVisible && (
                    <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                    right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                    p-[1vw] md:p-[1vw]
                                    mt-[2vh] md:mt-[6vh]
                                    w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                    bg-white shadow-2xl rounded-2xl relative">
                        <button
                            onClick={() => setIsFormVisible(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                            X
                        </button>
                        <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">Manage Meetings</h2>
    
                        <NepaliDatePicker
                            value={newMeeting.date}
                            onChange={handleDateChange}
                            inputClassName="border p-2 w-full mb-2"
                            placeholder="Select Nepali Date"
                            options={{ calenderLocale: "ne", valueLocale: "en", }} // Ensures localization
                        />
    
                        <input
                            type="text"
                            name="type"
                            placeholder="Meeting Type"
                            value={newMeeting.type}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newMeeting.location}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newMeeting.description}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
                        <input
                            type="time"
                            name="time"
                            value={newMeeting.time}
                            onChange={handleChange}
                            className="border p-2 w-full mb-2"
                        />
    
                        <div className="mb-2">
                            <label className="mr-4">Priority:</label>
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="normal"
                                    checked={newMeeting.priority === "normal"}
                                    onChange={handleChange}
                                    className="mr-1"
                                />
                                Normal
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="high"
                                    checked={newMeeting.priority === "high"}
                                    onChange={handleChange}
                                    className="mr-1"
                                />
                                High
                            </label>
                        </div>
    
                        <button
                            onClick={handleAddOrEditMeeting}
                            disabled={!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time}
                            className={`px-4 py-2 rounded-md w-full ${
                                !newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : editingIndex !== null 
                                        ? "bg-yellow-500" // Update Meeting (Yellow)
                                        : "bg-green-500" // Add Meeting (Green)
                            }`}
                        >
                            {editingIndex !== null ? "Update Meeting" : "Create Meeting"}
                        </button>
                    </div>
                )}
    
                {/*Add button}
                {!isFormVisible && (
                    <div className="flex justify-center p-4 mt-[20px]">
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                        >
                            Add New
                        </button>
                    </div>
                )}
    
                {/* Added meeting table }
                <div className={`overflow-x-auto p-1 md:p-4 ${isFormVisible ? 'mt-[1vh] md:mt-[1vh]' : 'mt-[2vh] md:mt-[2vh]'}`}>
                    <table className="w-full border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border w-[3vw] p-2">SN</th>
                                <th className="border w-[11vw] p-2">Date (BS)</th>
                                <th className="border w-[9vw] p-2">Time</th>
                                <th className="border w-[21vw] p-2">Meeting Type</th>
                                <th className="border w-[22vw] p-2">Location</th>
                                <th className="border w-[24vw] p-2">Description</th>
                                <th className="border w-[7vw] p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.map((meeting, index) => (
                                <tr key={index}>
                                    <td className="border text-center p-2">{index + 1}</td>
                                    <td className="border text-center p-2">{meeting.date}</td>
                                    <td className="border text-center p-2">{formatTime(meeting.time)}</td>
                                    <td className="border text-center p-2">{meeting.type}</td>
                                    <td className="border text-center p-2">{meeting.location}</td>
                                    <td className="border text-center p-2">{meeting.description}</td>
                                    <td className="border text-center p-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="bg-red-500 text-white px-4 py-1 ml-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };
    
    export default Add;
    
*/

import React, { useState, useEffect } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { ADToBS } from "bikram-sambat-js";
import axios from 'axios';

const Add = () => {
    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // State for meetings
    const [meetings, setMeetings] = useState([]);
    const [newMeeting, setNewMeeting] = useState({
        date: "",
        type: "",
        location: "",
        description: "",
        time: "",
        priority: "normal"
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true); // Form remains visible after adding a meeting

    const handleChange = (e) => {
        setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
    };

    // Nepali date picker functionality
    useEffect(() => {
        setNewMeeting((prev) => ({ ...prev, date: todayBS }));
    }, []); // Runs only once on mount

    const todayBS = ADToBS(new Date());
    const handleDateChange = (date) => {
        if (date < todayBS) {
            alert("Past Date cannot be selected!!");
            setNewMeeting((prev) => ({ ...prev, date: "" }));
        } else {
            setNewMeeting({ ...newMeeting, date });
        }
    };

    const handleAddOrEditMeeting = async () => {
        if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
            alert("Please fill in all required fields.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token is missing or invalid. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let response;

            if (editingIndex !== null) {
                response = await axios.put(
                    `http://localhost:5001/api/meetings/${meetings[editingIndex]._id}`,
                    newMeeting,
                    config
                );

                // Update the meetings array directly in state
                const updatedMeetings = [...meetings];
                updatedMeetings[editingIndex] = response.data;
                setMeetings(updatedMeetings);
                setEditingIndex(null); // Reset editing state
            } else {
                response = await axios.post(
                    "http://localhost:5001/api/meetings",
                    newMeeting,
                    config
                );

                // Directly update meetings state with the new meeting
                setMeetings(prevMeetings => [...prevMeetings, response.data]); // Add new meeting to the state
            }

            // Reset form after adding or editing
            setNewMeeting({
                date: todayBS,
                type: "",
                location: "",
                description: "",
                time: "",
                priority: "normal"
            });
        } catch (error) {
            console.error("Error saving meeting:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage or wherever you're storing it
      
          const response = await axios.delete(`http://localhost:5001/api/meetings/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`  // Send the token in the Authorization header
            }
          });
      
          console.log("Meeting deleted", response.data);
        } catch (error) {
          console.error("Error deleting meeting: ", error.response?.data || error.message);
        }
      };
      
    const handleEdit = (index) => {
        const meeting = meetings[index];
        setNewMeeting(meeting); // Populate the form with the meeting data
        setEditingIndex(index); // Set editing mode
        setIsFormVisible(true); // Keep the form visible for editing
    };

    return (
        <>
            {isFormVisible && (
                <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                p-[1vw] md:p-[1vw]
                                mt-[2vh] md:mt-[6vh]
                                w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                bg-white shadow-2xl rounded-2xl relative">
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                        X
                    </button>
                    <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">Manage Meetings</h2>

                    <NepaliDatePicker
                        value={newMeeting.date}
                        onChange={handleDateChange}
                        inputClassName="border p-2 w-full mb-2"
                        placeholder="Select Nepali Date"
                        options={{ calenderLocale: "ne", valueLocale: "en", }} // Ensures localization
                    />

                    <input
                        type="text"
                        name="type"
                        placeholder="Meeting Type"
                        value={newMeeting.type}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newMeeting.location}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newMeeting.description}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="time"
                        name="time"
                        value={newMeeting.time}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />

                    <div className="mb-2">
                        <label className="mr-4">Priority:</label>
                        <label className="mr-2">
                            <input
                                type="radio"
                                name="priority"
                                value="normal"
                                checked={newMeeting.priority === "normal"}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            Normal
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="priority"
                                value="high"
                                checked={newMeeting.priority === "high"}
                                onChange={handleChange}
                                className="mr-1"
                            />
                            High
                        </label>
                    </div>

                    <button
                        onClick={handleAddOrEditMeeting}
                        disabled={!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time}
                        className={`px-4 py-2 rounded-md w-full ${
                            !newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time
                                ? "bg-gray-400 cursor-not-allowed"
                                : editingIndex !== null 
                                    ? "bg-yellow-500" // Update Meeting (Yellow)
                                    : "bg-green-500" // Add Meeting (Green)
                        }`}
                    >
                        {editingIndex !== null ? "Update Meeting" : "Create Meeting"}
                    </button>
                </div>
            )}

            {/* Add button */}
            {!isFormVisible && (
                <div className="flex justify-center p-4 mt-[20px]">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                        Add New
                    </button>
                </div>
            )}

            {/* Added meeting table */}
            <div className={`overflow-x-auto p-1 md:p-4 ${isFormVisible ? 'mt-[1vh] md:mt-[1vh]' : 'mt-[2vh] md:mt-[2vh]'}`}>
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-center">Date</th>
                            <th className="border border-gray-300 p-2 text-center">Time</th>
                            <th className="border border-gray-300 p-2 text-center">Location</th>
                            <th className="border border-gray-300 p-2 text-center">Description</th>
                            <th className="border border-gray-300 p-2 text-center">Priority</th>
                            <th className="border border-gray-300 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting, index) => (
                            <tr key={meeting._id}>
                                <td className="border border-gray-300 p-2 text-center">{meeting.date}</td>
                                <td className="border border-gray-300 p-2 text-center">{formatTime(meeting.time)}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.location}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.description}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.priority}</td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Add;



