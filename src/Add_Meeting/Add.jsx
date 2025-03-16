/*
// This is perfectly fine code
import React, { useState, useEffect } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { ADToBS } from "bikram-sambat-js";
import axios from "axios";

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
    const todayBS = ADToBS(new Date());


    const [meetingData, setMeetingData] = useState({
        date: todayBS,
        type: "",
        location: "",
        description: "",
        time: "",
        priority: "normal",
    });

    const [newMeeting, setNewMeeting] = useState({
        date: todayBS,
        type: "",
        location: "",
        description: "",
        time: "",
        priority: "normal",
    });

    const [editingId, setEditingId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (e) => {
        setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        if (date < todayBS) {
            alert("Past Date cannot be selected!!");
            setNewMeeting((prev) => ({ ...prev, date: "" }));
        } else {
            setNewMeeting({ ...newMeeting, date });
        }
    };

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5001/api/meetings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeetings(data);
        } catch (error) {
            console.error("Error fetching meetings:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleEdit = (meeting) => {
        setNewMeeting({
            ...meeting,
            date: meeting.date || todayBS, // Ensure a valid date is set
        });
        setEditingId(meeting._id);
        setIsFormVisible(true);
    };
    

    const handleAddOrEditMeeting = async () => {
        console.log(meetingData);
        if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
            alert("Please fill in all required fields.");
            return;
        }
    
        // Ensure all values are strings before sending
        const payload = {
            date: newMeeting.date.toString(), // Convert to string explicitly
            type: newMeeting.type.trim(),
            location: newMeeting.location.trim(),
            description: newMeeting.description.trim(),
            time: newMeeting.time.toString(), // Ensure time is in string format
            priority: newMeeting.priority || "normal",
        };
    
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
            if (editingId) {
                // Update existing meeting
                response = await axios.put(`http://localhost:5001/api/meetings/${editingId}`, payload, config);
                setMeetings((prevMeetings) =>
                    prevMeetings.map((meeting) =>
                        meeting._id === editingId ? response.data : meeting
                    )
                );
                setEditingId(null);
            } else {
                // Create new meeting
                response = await axios.post("http://localhost:5001/api/meetings", payload, config);
                setMeetings([...meetings, response.data]);
            }
    
            // Reset form
            setNewMeeting({
                date: todayBS,
                type: "",
                location: "",
                description: "",
                time: "",
                priority: "normal",
            });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error saving meeting:", error.response?.data || error.message);
        }
    };
    
    

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }

            await axios.delete(`http://localhost:5001/api/meetings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting._id !== id));
            console.log("Meeting deleted successfully");
        } catch (error) {
            console.error("Error deleting meeting:", error.response?.data || error.message);
        }
    };

    return (
        <>
            {isFormVisible && (
                <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                p-[1vw] mt-[2vh] w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                bg-white shadow-2xl rounded-2xl relative">
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                        X
                    </button>
                    <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">
                        {editingId ? "Edit Meeting" : "Create Meeting"}
                    </h2>

                    <NepaliDatePicker
                        value={newMeeting.date}
                        onChange={handleDateChange}
                        inputClassName="border p-2 w-full mb-2"
                        placeholder="Select Nepali Date"
                        options={{ calenderLocale: "ne", valueLocale: "en" }}
                    />

                    <input type="text" name="type" placeholder="Meeting Type" value={newMeeting.type} onChange={handleChange} className="border p-2 w-full mb-2" />
                    <input type="text" name="location" placeholder="Location" value={newMeeting.location} onChange={handleChange} className="border p-2 w-full mb-2" />
                    <input type="text" name="description" placeholder="Description" value={newMeeting.description} onChange={handleChange} className="border p-2 w-full mb-2" />
                    
                    <input type="time" name="time" value={newMeeting.time} onChange={handleChange} className="border p-2 w-full mb-2" />

                    <button
                        onClick={handleAddOrEditMeeting}
                        className={`px-4 py-2 rounded-md w-full ${
                            editingId ? "bg-yellow-500" : "bg-green-500"
                        } text-white`}
                    >
                        {editingId ? "Update Meeting" : "Create Meeting"}
                    </button>
                </div>
            )}

            {!isFormVisible && (
                <div className="flex justify-center p-4 mt-4">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                        Add New
                    </button>
                </div>
            )}

            <div className="overflow-x-auto p-4 mt-4">
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-center">Date</th>
                            <th className="border border-gray-300 p-2 text-center">Time</th>
                            <th className="border border-gray-300 p-2 text-center">Location</th>
                            <th className="border border-gray-300 p-2 text-center">Description</th>
                            <th className="border border-gray-300 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting) => (
                            <tr key={meeting._id}>
                                <td className="border border-gray-300 p-2 text-center">{meeting.date}</td>
                                <td className="border border-gray-300 p-2 text-center">{formatTime(meeting.time)}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.location}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.description}</td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button onClick={() => handleEdit(meeting)} className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2">Edit</button>
                                    <button onClick={() => handleDelete(meeting._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
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
import axios from "axios";

const Add = () => {
    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    };

    // State for meetings
    const [meetings, setMeetings] = useState([]);
    const todayBS = ADToBS(new Date());

    const [newMeeting, setNewMeeting] = useState({
        date: todayBS,
        type: "",
        location: "",
        description: "",
        time: "",
        priority: "normal", // Default priority
    });

    const [editingId, setEditingId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (e) => {
        setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        if (date < todayBS) {
            alert("Past Date cannot be selected!!");
            setNewMeeting((prev) => ({ ...prev, date: "" }));
        } else {
            setNewMeeting({ ...newMeeting, date });
        }
    };

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5001/api/meetings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeetings(data);
        } catch (error) {
            console.error("Error fetching meetings:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleEdit = (meeting) => {
        setNewMeeting({
            ...meeting,
            date: meeting.date || todayBS, // Ensure a valid date is set
        });
        setEditingId(meeting._id);
        setIsFormVisible(true);
    };

    const handleAddOrEditMeeting = async () => {
        console.log(newMeeting);
        if (!newMeeting.date || !newMeeting.type || !newMeeting.location || !newMeeting.description || !newMeeting.time) {
            alert("Please fill in all required fields.");
            return;
        }

        // Ensure all values are strings before sending
        const payload = {
            date: newMeeting.date, // Convert to string explicitly
            type: newMeeting.type.trim(),
            location: newMeeting.location.trim(),
            description: newMeeting.description.trim(),
            time: newMeeting.time.trim(), // Ensure time is in string format
            priority: newMeeting.priority || "normal", // Include priority field
        };

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
            if (editingId) {
                // Update existing meeting
                response = await axios.put(`http://localhost:5001/api/meetings/${editingId}`, payload, config);
                setMeetings((prevMeetings) =>
                    prevMeetings.map((meeting) =>
                        meeting._id === editingId ? response.data : meeting
                    )
                );
                setEditingId(null);
            } else {
                // Create new meeting
                response = await axios.post("http://localhost:5001/api/meetings", payload, config);
                setMeetings([...meetings, response.data]);
            }

            // Reset form
            setNewMeeting({
                date: todayBS,
                type: "",
                location: "",
                description: "",
                time: "",
                priority: "normal",
            });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error saving meeting:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }

            await axios.delete(`http://localhost:5001/api/meetings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting._id !== id));
            console.log("Meeting deleted successfully");
        } catch (error) {
            console.error("Error deleting meeting:", error.response?.data || error.message);
        }
    };

    return (
        <>
            {isFormVisible && (
                <div className="left-[9vw] md:left-[24vw] lg:left-[29vw] xl:left-[34vw]
                                right-[9vw] md:right-[24vw] lg:right-[29vw] xl:right-[34vw]
                                p-[1vw] mt-[2vh] w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw]
                                bg-white shadow-2xl rounded-2xl relative">
                    <button
                        onClick={() => setIsFormVisible(false)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                        X
                    </button>
                    <h2 className="text-xl p-4 flex justify-center font-semibold mb-4">
                        {editingId ? "Edit Meeting" : "Create Meeting"}
                    </h2>

                    <NepaliDatePicker
                        value={newMeeting.date}
                        onChange={handleDateChange}
                        inputClassName="border p-2 w-full mb-2"
                        placeholder="Select Nepali Date"
                        options={{ calenderLocale: "ne", valueLocale: "en" }}
                    />

                    <input type="text" name="type" placeholder="Meeting Type" value={newMeeting.type} onChange={handleChange} className="border p-2 w-full mb-2" />
                    <input type="text" name="location" placeholder="Location" value={newMeeting.location} onChange={handleChange} className="border p-2 w-full mb-2" />
                    <input type="text" name="description" placeholder="Description" value={newMeeting.description} onChange={handleChange} className="border p-2 w-full mb-2" />
                    <input type="time" name="time" value={newMeeting.time} onChange={handleChange} className="border p-2 w-full mb-2" />

                    {/* Add Priority Dropdown */}
                    <select
                        name="priority"
                        value={newMeeting.priority}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                    </select>

                    <button
                        onClick={handleAddOrEditMeeting}
                        className={`px-4 py-2 rounded-md w-full ${
                            editingId ? "bg-yellow-500" : "bg-green-500"
                        } text-white`}
                    >
                        {editingId ? "Update Meeting" : "Create Meeting"}
                    </button>
                </div>
            )}

            {!isFormVisible && (
                <div className="flex justify-center p-4 mt-4">
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                        Add New
                    </button>
                </div>
            )}

            <div className="overflow-x-auto p-4 mt-4">
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-center">Date</th>
                            <th className="border border-gray-300 p-2 text-center">Time</th>
                            <th className="border border-gray-300 p-2 text-center">Location</th>
                            <th className="border border-gray-300 p-2 text-center">Meeting Type</th>
                            <th className="border border-gray-300 p-2 text-center">Description</th>
                            <th className="border border-gray-300 p-2 text-center">Priority</th>
                            <th className="border border-gray-300 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting) => (
                            <tr key={meeting._id}>
                                <td className="border border-gray-300 p-2 text-center">{formatDate(meeting.date)}</td>
                                <td className="border border-gray-300 p-2 text-center">{formatTime(meeting.time)}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.location}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.type}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.description}</td>
                                <td className="border border-gray-300 p-2 text-center">{meeting.priority}</td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button
                                        onClick={() => handleEdit(meeting)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(meeting._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600"
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



