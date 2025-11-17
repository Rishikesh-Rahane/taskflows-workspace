# 🧭 TaskFlow – Lightweight Project Management Tool

A **Jira-inspired project management web application** built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**.  
TaskFlow simplifies team collaboration by helping users **create projects**, **manage tasks**, **track progress**, and **visualize workflows** — all in one place.

---

## 🚀 Features

### 🗂️ Project Management
- Create and manage multiple projects
- Assign team members and set project timelines
- Track project progress with summary stats

### 📋 Work Items (Tasks)
- Create, update, and assign tasks (work items)
- Include description, priority, status, due date, and assignee
- Maintain a full activity history per task

### 🧾 Boards (Kanban)
- Visualize project progress across *To Do*, *In Progress*, and *Done* stages
- Drag-and-drop tasks between columns

### 📅 Calendar View
- Display upcoming tasks and deadlines in a unified team calendar

### 👥 Teams & People
- Manage team members, roles (Admin, Developer, QA)
- Assign users to specific projects and tasks

### 🕓 History & Activity Log
- Capture every task update: status changes, comments, reassignments

### 📊 Dashboard / Summary
- View total tasks, completion rate, and project insights

### 🔐 Authentication
- Secure login/signup system using JWT (JSON Web Token)
- Role-based access control for admins and users

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite or CRA), Redux Toolkit / Context API, TailwindCSS or Material-UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Token) |
| **Hosting** | Frontend – Netlify / Vercel <br> Backend – Render / Railway |
| **Others** | Cloudinary (for user avatars/files), Day.js (for date handling), Nodemailer (for notifications) |

---

## 🧠 System Flow

1. **User Authentication** – Sign up / login securely using JWT.  
2. **Project Creation** – Admin creates a new project and adds team members.  
3. **Task Creation** – Members create and assign work items to themselves or others.  
4. **Board Visualization** – Tasks displayed across Kanban board columns (To Do → In Progress → Done).  
5. **Calendar View** – Tasks with due dates are shown in a team calendar.  
6. **Activity Log** – Every update recorded in task history.  
7. **Dashboard Overview** – Visual summary of overall project status and performance.  

---

## 🧰 Installation & Setup

> **Note:** This assumes you have Node.js and MongoDB installed locally.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Rishikesh-Rahane/taskflow.git
cd taskflow
```
2️⃣ Install dependencies
```bash
Backend:
cd server
npm install

Frontend:
cd ../client
npm install
```
3️⃣ Configure environment variables
```bash
Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_config
```
4️⃣ Run the app in development
```bash
Open two terminals:

Backend:

cd server
npm run dev


Frontend:

cd client
npm run dev


Visit your app at:
👉 http://localhost:5173 (or the port your React app runs on)
```

---

## 🧑‍💻 Author

**Rishikesh Rahane**  
🔗 [LinkedIn](https://linkedin.com/in/rishikesh-rahane)  
💻 [Portfolio](https://portfolio-rishi-kappa.vercel.app/)  
📧 rahanerishikesh63@gmail.com  

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify it for learning or personal projects.

---

## 💬 Feedback

If you find this project useful or have suggestions for improvements,  
feel free to **open an issue** or **submit a pull request**.  
Contributions are always welcome and appreciated!

---

> ⚠️ **Note:** This project is still under active development.  
> Upcoming features include advanced permission controls, real-time notifications, and analytics dashboards.

---
