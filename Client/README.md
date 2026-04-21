
# 📘 Meeting Scheduling System (MERN Stack)

## 📌 Introduction
This project is a web-based Meeting Scheduling System developed using the MERN stack. It allows organizations to efficiently manage and schedule meetings with role-based access control.

The system ensures that authorized users can create and manage meetings, while higher-level management can view schedules for decision-making.

---

## 🎯 Objectives
- To simplify the process of scheduling meetings
- To manage meetings with proper role-based access
- To avoid conflicts in meeting time and location
- To provide a centralized platform for meeting management

---

## 🚀 Features
- User Authentication (Login/Register)
- Role-based access control (Admin, PA, GM, MD)
- Create and manage meetings
- View meeting schedules
- Set meeting priority (High / Low)
- Categorize meetings (Internal / External)
- Add meeting details like date, time, location, description

---

## 👥 User Roles

### 🔹 Admin / PA / GM
- Add new meetings
- Set meeting date and time
- Assign location
- Add description
- Set priority (High / Low)
- Define meeting type (Internal / External)

### 🔹 MD (Managing Director)
- View all scheduled meetings
- Access meeting table/dashboard
- No permission to add or edit meetings

---

## 🛠️ Technologies Used

**Frontend:**
- React.js

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB

**Other Tools:**
- JWT Authentication
- Git & GitHub

---

## 🏗️ System Architecture
Frontend (React) → Backend (Node.js/Express) → Database (MongoDB)

---

## ⚙️ Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/PrabeshThapa3522/NEA.git
cd NEA

## Install Frontend dependencies
- cd Client
- npm install
- npm run dev # for running frontend

## Install Backend dependencies
- cd ../Server
- npm install
- nodemon

## for environment variable
- PORT=5001
- MONGO_URI=your_mongodb_connection
- JWT_SECRET=your_secret_key