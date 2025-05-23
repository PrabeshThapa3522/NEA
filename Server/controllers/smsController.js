import axios from 'axios'
export const sendBulkSMS = async (req, res) => {
    console.log("Received SMS request:", req.body); // Debug: Check incoming data
    const { recipients, meetingDetails } = req.body;
  
    if (!recipients?.length) {
      return res.status(400).json({ error: "No recipients selected." });
    }
    
  
    try {
      // Prepare SMS message
      const message = `📢 Meeting Alert: Meeting Type: ${meetingDetails?.type || "N/A"} at ${meetingDetails?.location  ||
         "N/A"} on ${meetingDetails?.date || "N/A"} at time: ${meetingDetails?.time || "N/A"}. Details: ${meetingDetails?.description || "None"}`;
      console.log("Constructed message:", message); // Verify message content   
      const smsResponses = await Promise.all(
        recipients.map(async (phoneNumber) => {
          // Ensure phone number starts with +977
          const formattedNumber = phoneNumber.startsWith("+977") ? phoneNumber : `+977${phoneNumber}`;
          console.log("Attempting SMS to:", formattedNumber); // Verify number format
          
          const response = await axios.post(process.env.SPARROW_API_URL, null, {
            params: { 
              token: process.env.SPARROW_API_KEY,
              from: process.env.SPARROW_SENDER_ID,
              to: formattedNumber,
              text: message,
            },
          });

          console.log("SMS API response:", response.data); // Log Sparrow's response
          return response.data;
        })
      );
  
      res.json({ message: "SMS sent successfully", details: smsResponses });
    } catch (error) {
        console.error("Sparrow API Error:", {
          message: error.message,
          response: error.response?.data, // Sparrow's error message
          status: error.response?.status,
          url: error.config?.url // Check the request URL
        });
        res.status(500).json({ error: "Failed to send SMS. Please try again." });
      }
  };
  


// import { config } from 'dotenv';
// import twilio from 'twilio';

// config(); // load .env variables

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// export const sendBulkSMS = async (req, res) => {
//   console.log("Received SMS request:", req.body);
//   const { recipients, meetingDetails } = req.body;

//   if (!recipients?.length) {
//     return res.status(400).json({ error: "No recipients selected." });
//   }

//   try {
//     const message = `📢 Meeting Alert: Meeting Type: ${meetingDetails?.type || "N/A"} at ${meetingDetails?.location || "N/A"} on ${meetingDetails?.date || "N/A"} at time: ${meetingDetails?.time || "N/A"}. Details: ${meetingDetails?.description || "None"}`;
//     console.log("Constructed message:", message);

//     const smsResponses = await Promise.all(
//       recipients.map(async (phoneNumber) => {
//         const formattedNumber = phoneNumber.startsWith("+977") ? phoneNumber : `+977${phoneNumber}`;
//         console.log("Attempting SMS to:", formattedNumber);

//         const response = await client.messages.create({
//           body: message,
//           from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
//           to: formattedNumber,
//         });

//         console.log("Twilio response:", response.sid); // SID of the sent message
//         return { to: formattedNumber, sid: response.sid, status: response.status };
//       })
//     );

//     res.json({ message: "SMS sent successfully", details: smsResponses });

//   } catch (error) {
//     console.error("Twilio API Error:", {
//       message: error.message,
//       status: error.status,
//       details: error?.stack
//     });

//     res.status(500).json({ error: "Failed to send SMS. Please try again." });
//   }
// };

// export default sendBulkSMS;