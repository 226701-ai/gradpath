require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express(); // Define app FIRST!

// Import your routes
const studentRoutes = require("./routes/students");
const activityRoutes = require("./routes/activities");
const studentActivityRoutes = require("./routes/studentActivities");
const dashboardRoutes = require("./routes/dashboard");
const outcomeRoutes = require("./routes/outcomes");
const courseRoutes = require("./routes/course"); // Renamed for consistency
const enrolmentRoute = require("./routes/enrolment");
const studentDashboardRoutes = require("./routes/studentDashboard");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// routes
app.use("/api/students", studentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/student-activities", studentActivityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outcomes", outcomeRoutes);
app.use("/api/course", courseRoutes); // Now this works perfectly
app.use("/api/enrolment", enrolmentRoute);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/auth", authRoutes);

// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});