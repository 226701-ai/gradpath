/* =======================
   CGPA SCORE CALCULATOR
======================= */
function getAcademicScore(cgpa) {
    const gpa = Number(cgpa);
    if (gpa >= 3.75) return 40; // High distinction
    if (gpa >= 3.50) return 35; // Distinction
    if (gpa >= 3.00) return 30; // Credit
    if (gpa >= 2.50) return 20; // Pass
    return 10;                  // Needs improvement
}

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:id", async (req, res) => {
    // 1. Define ID explicitly
        const { id } = req.params;

        try {
            const result = await pool.query(
        `
        WITH StudentCGPA AS (
            SELECT 
                e.student_id,
                SUM(CASE e.grade WHEN 'A' THEN 4.00 WHEN 'A-' THEN 3.75 WHEN 'B+' THEN 3.50 WHEN 'B' THEN 3.00 WHEN 'C+' THEN 2.50 WHEN 'C' THEN 2.00 WHEN 'D' THEN 1.00 ELSE 0.0 END * c.credit_hours) / NULLIF(SUM(c.credit_hours), 0) AS dynamic_cgpa
            FROM enrolment e
            JOIN course c ON e.course_code = c.course_code
            WHERE e.student_id = $1
            GROUP BY e.student_id
        ),
        StudentScores AS (
            SELECT student_id, SUM(CASE grade WHEN 'A' THEN 5.0 WHEN 'B' THEN 3.0 WHEN 'C' THEN 1.0 ELSE 0 END) as cert_points 
            FROM certifications GROUP BY student_id
        ),
        StudentInternship AS (
            SELECT student_id, SUM(rating) as intern_points 
            FROM internships GROUP BY student_id
        )

        SELECT 
            s.student_id, s.name, s.matric, s.programme,
            COALESCE(cgp.dynamic_cgpa, 0) AS cgpa,
            COALESCE(cs.cert_points, 0) AS cert_points,
            COALESCE(si.intern_points, 0) AS intern_points,
            COALESCE(
                SUM(
                    a.score * CASE 
                        WHEN LOWER(sa.role) = 'president' THEN 1.0
                        WHEN LOWER(sa.role) IN ('vice president', 'secretary', 'treasurer') THEN 0.8
                        WHEN LOWER(sa.role) = 'committee' THEN 0.6
                        WHEN LOWER(sa.role) = 'participant' THEN 0.2
                        ELSE 0.0
                    END
                ), 0
            ) AS total_cocu_points
        FROM students s
        LEFT JOIN StudentCGPA cgp ON s.student_id = cgp.student_id
        LEFT JOIN StudentScores cs ON s.student_id = cs.student_id
        LEFT JOIN StudentInternship si ON s.student_id = si.student_id
        LEFT JOIN student_activities sa ON s.student_id = sa.student_id
        LEFT JOIN activities a ON sa.activity_id = a.activity_id
        WHERE s.student_id = $1
        GROUP BY s.student_id, s.name, s.matric, s.programme, cgp.dynamic_cgpa, cs.cert_points, si.intern_points
        `,
        [id]
    );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        const student = result.rows[0];

        // 1. Calculate Academic Score (Max 40%)
        const cgpaVal = Number(student.cgpa).toFixed(2);
        const cgpaScore = getAcademicScore(cgpaVal);

        // 2. Co-Curriculum Score (Max 35%)
        const COCU_MILESTONE = 100; 
        const cocuScore = Math.min((Number(student.total_cocu_points) / COCU_MILESTONE) * 35, 35);

        // 3. Internship Score (Max 15%)
        const internshipScore = Math.min(Number(student.intern_points) * 3, 15);

        // 4. Certification Score (Max 10%)
        const certScore = Math.min(Number(student.cert_points), 10);

        // GRAND TOTAL
        const employabilityScore = Math.round(cgpaScore + cocuScore + internshipScore + certScore);

        let employabilityStatus = "Needs Improvement";
        if (employabilityScore >= 80) employabilityStatus = "Highly Employable";
        else if (employabilityScore >= 60) employabilityStatus = "Moderately Employable";

        res.json({
            student_id: student.student_id,
            name: student.name,
            matric: student.matric,
            programme: student.programme,
            cgpa: cgpaVal,
            scores_breakdown: {
                academic: cgpaScore.toFixed(1),
                cocurriculum: cocuScore.toFixed(1),
                internship: internshipScore,
                certifications: certScore
            },
            employability_score: employabilityScore,
            employability_status: employabilityStatus
        });

    } catch (err) {
        console.error("Dashboard Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;