import Meeting from "../models/meetingModel.js";

export const getMeetings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const meetings = await Meeting.find({ user: req.user.id })
      .sort({ date: -1 }); // ✅ Ascending order (oldest first)

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createMeeting = async (req, res) => {
  try {
    let { date, type, location, description, time, priority, meeting_type } = req.body;

    if (!date || !type || !location || !description || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // ✅ Normalize and Validate Time (HH:mm)
    time = time.trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return res.status(400).json({ error: "Invalid time format (use HH:mm)" });
    }

    // ✅ Check if a meeting exists for the same user, date, and time
    const existingMeeting = await Meeting.findOne({
      user: req.user.id,
      date: parsedDate,
      time: time,
    });

    if (existingMeeting) {
      return res.status(400).json({
        message: "You already have a meeting scheduled at this time on this day.",
      });
    }
    

    const newMeeting = new Meeting({
      user: req.user.id,
      date: parsedDate, // ✅ Convert to Date object before saving
      type,
      location,
      description,
      time,
      priority: priority || "normal",
      meeting_type: meeting_type || "internal",
    });

    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete a meeting
export const deleteMeeting = async (req, res) => {
  const meetingId = req.params.id;

  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    await meeting.deleteOne(); // Use deleteOne() instead of remove() (deprecated)
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, unable to delete meeting" });
  }
};



//  Update a meeting fine
export const updateMeeting = async (req, res) => {
  const { type, location, description, date, time, priority, meeting_type } = req.body;

  // Check if required fields are present
  if (!type || !location || !description || !date || !time || !priority || !meeting_type) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  try {
    // Your logic to update the meeting
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};

// Function to get the start and end of a given date
export const getStartAndEndOfDate = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59)

  return { startOfDay, endOfDay };
};