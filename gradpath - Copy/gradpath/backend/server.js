const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const studentRoutes = require("./routes/students");
const activityRoutes = require("./routes/activities");
const studentActivityRoutes = require("./routes/studentActivities");
const dashboardRoutes = require("./routes/dashboard");
const outcomeRoutes = require("./routes/outcomes");
const courseRoute = require("./routes/course");
const enrolmentRoute = require("./routes/enrolment");
const studentDashboardRoutes = require("./routes/studentDashboard");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// DEBUG (IMPORTANT FOR YOUR ERROR CHECK)
console.log("DB USER:", process.env.DB_USER);
console.log("DB HOST:", process.env.DB_HOST);
console.log("DB NAME:", process.env.DB_DATABASE);
console.log("DB PASSWORD TYPE:", typeof process.env.DB_PASSWORD);

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// routes
app.use("/api/students", studentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/student-activities", studentActivityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outcomes", outcomeRoutes);
app.use("/api/course", courseRoute);
app.use("/api/enrolment", enrolmentRoute);
app.use("/api/student-dashboard",studentDashboardRoutes);
app.use("/api/auth", authRoutes);

// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});