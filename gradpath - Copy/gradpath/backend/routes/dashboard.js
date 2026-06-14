const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   DASHBOARD STATS API
======================= */
router.get("/", async (req, res) => {
  try {

    // TOTAL COUNTS
    const students = await pool.query("SELECT COUNT(*) FROM students");
    const activities = await pool.query("SELECT COUNT(*) FROM activities");
    const outcomes = await pool.query("SELECT COUNT(*) FROM learning_outcomes");
    const courses = await pool.query("SELECT COUNT(*) FROM course");
    const enrolments = await pool.query("SELECT COUNT(*) FROM enrolment");

    // TOTAL SCORE
    const score = await pool.query(`
      SELECT COALESCE(SUM(a.score), 0) AS total_score
      FROM student_activities sa
      JOIN activities a ON sa.activity_id = a.activity_id
    `);

    // PROGRAMME DISTRIBUTION
    const programmeChart = await pool.query(`
      SELECT programme, COUNT(*) AS total
      FROM students
      GROUP BY programme
      ORDER BY programme
    `);

    // ACTIVITY TYPE DISTRIBUTION
    const activityChart = await pool.query(`
      SELECT activity_type, COUNT(*) AS total
      FROM activities
      GROUP BY activity_type
      ORDER BY activity_type
    `);

    // COURSE ENROLMENT CHART
    const courseEnrolmentChart = await pool.query(`
      SELECT 
        c.course_code,
        c.course_name,
        COUNT(e.student_id) AS total
      FROM course c
      LEFT JOIN enrolment e 
        ON c.course_code = e.course_code
      GROUP BY c.course_code, c.course_name
      ORDER BY c.course_code
    `);

    res.json({
      total_students: Number(students.rows[0].count),
      total_activities: Number(activities.rows[0].count),
      total_outcomes: Number(outcomes.rows[0].count),
      total_courses: Number(courses.rows[0].count),
      total_enrolments: Number(enrolments.rows[0].count),
      total_score: Number(score.rows[0].total_score),

      programme_chart: programmeChart.rows,
      activity_chart: activityChart.rows,
      course_enrolment_chart: courseEnrolmentChart.rows
    });

  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;