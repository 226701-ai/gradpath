const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   CGPA SCORE CALCULATOR
======================= */
function calculateCGPAScore(cgpa) {
    if (!cgpa) return 0;

    const value = Number(cgpa);

    if (value >= 3.75) return 35;
    if (value >= 3.50) return 30;
    if (value >= 3.00) return 25;
    if (value >= 2.50) return 15;

    return 5;
}

/* =======================
   DASHBOARD STATS API
======================= */
router.get("/", async (req, res) => {
    try {
        const students = await pool.query("SELECT COUNT(*) FROM students");
        const activities = await pool.query("SELECT COUNT(*) FROM activities");
        const outcomes = await pool.query("SELECT COUNT(*) FROM learning_outcomes");
        const courses = await pool.query("SELECT COUNT(*) FROM course");
        const enrolments = await pool.query("SELECT COUNT(*) FROM enrolment");

        const studentScores = await pool.query(`
            SELECT
                s.student_id,
                s.cgpa,

                COALESCE(SUM(a.score), 0) AS raw_activity_score,

                COALESCE(
                    MAX(
                        CASE
                            WHEN LOWER(sa.role) = 'president' THEN 40
                            WHEN LOWER(sa.role) = 'vice president' THEN 35
                            WHEN LOWER(sa.role) = 'secretary' THEN 30
                            WHEN LOWER(sa.role) = 'treasurer' THEN 30
                            WHEN LOWER(sa.role) = 'committee' THEN 20
                            WHEN LOWER(sa.role) = 'participant' THEN 10
                            ELSE 0
                        END
                    ),
                    0
                ) AS leadership_score

            FROM students s

            LEFT JOIN student_activities sa
                ON s.student_id = sa.student_id

            LEFT JOIN activities a
                ON sa.activity_id = a.activity_id

            GROUP BY
                s.student_id,
                s.cgpa
        `);

        let totalEmployabilityScore = 0;

        const employabilityLevels = {
            highly_employable: 0,
            moderate_employability: 0,
            needs_improvement: 0
        };

        studentScores.rows.forEach(student => {
            const cgpaScore = calculateCGPAScore(student.cgpa);

            const activityScore = Math.min(
                Number(student.raw_activity_score),
                25
            );

            const leadershipScore = Math.min(
                Number(student.leadership_score),
                40
            );

            const totalScore =
                cgpaScore + activityScore + leadershipScore;

            totalEmployabilityScore += totalScore;

            if (totalScore >= 80) {
                employabilityLevels.highly_employable++;
            } else if (totalScore >= 60) {
                employabilityLevels.moderate_employability++;
            } else {
                employabilityLevels.needs_improvement++;
            }
        });

        const averageEmployability =
            studentScores.rows.length > 0
                ? Math.round(totalEmployabilityScore / studentScores.rows.length)
                : 0;

        const score = await pool.query(`
            SELECT COALESCE(SUM(a.score), 0) AS total_score
            FROM student_activities sa
            JOIN activities a ON sa.activity_id = a.activity_id
        `);

        const programmeChart = await pool.query(`
            SELECT programme, COUNT(*) AS total
            FROM students
            GROUP BY programme
            ORDER BY programme
        `);

        const activityChart = await pool.query(`
            SELECT activity_type, COUNT(*) AS total
            FROM activities
            GROUP BY activity_type
            ORDER BY activity_type
        `);

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
            average_employability_score: averageEmployability,

            programme_chart: programmeChart.rows,
            activity_chart: activityChart.rows,
            course_enrolment_chart: courseEnrolmentChart.rows,

            employability_level_chart: [
                {
                    level: "Highly Employable",
                    total: employabilityLevels.highly_employable
                },
                {
                    level: "Moderately Employable",
                    total: employabilityLevels.moderate_employability
                },
                {
                    level: "Needs Improvement",
                    total: employabilityLevels.needs_improvement
                }
            ]
        });

    } catch (err) {
        console.error("Dashboard error:", err.message);

        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;