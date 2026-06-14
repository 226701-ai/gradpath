require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); 

// 1. MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// 2. IMPORT ROUTES
const studentRoutes = require("./routes/students");
const activityRoutes = require("./routes/activities");
const studentActivityRoutes = require("./routes/studentActivities");
const dashboardRoutes = require("./routes/dashboard");
const outcomeRoutes = require("./routes/outcomes");
const courseRoutes = require("./routes/course");
const enrolmentRoute = require("./routes/enrolment");
const studentDashboardRoutes = require("./routes/studentDashboard");
const authRoutes = require("./routes/auth");
const certRouter = require("./routes/certification");
const internshipRoutes = require("./routes/internship");

const PORT = process.env.PORT || 3000;

// 3. REGISTER ROUTES (Now the middleware is already applied to these)
app.use("/api/students", studentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/student-activities", studentActivityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outcomes", outcomeRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/enrolment", enrolmentRoute);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/certifications", certRouter);
app.use("/api/internships", internshipRoutes);

// 4. SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});