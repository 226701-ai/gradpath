const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL STUDENTS
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY student_id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET students error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   ADD STUDENT + CREATE USER ACCOUNT
======================= */
router.post("/", async (req, res) => {
    const { matric, name, email, programme } = req.body;

    if (!matric || !name || !email || !programme) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check if matric already exists in students table
        const studentCheck = await client.query(
            `
            SELECT *
            FROM students
            WHERE matric = $1 OR email = $2
            `,
            [matric, email]
        );

        if (studentCheck.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Student matric or email already exists"
            });
        }

        // Check if username already exists in users table
        const usernameCheck = await client.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            `,
            [matric]
        );

        if (usernameCheck.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "User account already exists for this matric number"
            });
        }

        // Insert into students table
        const studentResult = await client.query(
            `
            INSERT INTO students
            (matric, name, email, programme)
            VALUES ($1, $2, $3, $4)
            RETURNING student_id
            `,
            [matric, name, email, programme]
        );

        const studentId = studentResult.rows[0].student_id;

        // Automatically insert into users table
        await client.query(
            `
            INSERT INTO users
            (username, password, role, student_id)
            VALUES ($1, $2, 'student', $3)
            `,
            [matric, matric, studentId]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Student and user account created successfully",
            login: {
                username: matric,
                password: matric
            }
        });

    } catch (err) {
        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: err.message
        });

    } finally {
        client.release();
    }
});

/* =======================
   UPDATE STUDENT
======================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { matric, name, email, programme } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE students
      SET matric = $1,
          name = $2,
          email = $3,
          programme = $4
      WHERE student_id = $5
      RETURNING *
      `,
      [matric, name, email, programme, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("UPDATE student error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   DELETE STUDENT
======================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM student_activities WHERE student_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM enrolment WHERE student_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM students WHERE student_id = $1",
      [id]
    );

    res.json({ message: "Student deleted successfully" });

  } catch (err) {
    console.error("DELETE student error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;