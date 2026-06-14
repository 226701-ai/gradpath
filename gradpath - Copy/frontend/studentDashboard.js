const DASHBOARD_API = "http://localhost:3000/api/student-dashboard";

/* =======================
   CHECK LOGIN
======================= */
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "student") {
    window.location.href = "login.html?role=student";
}

if (!user.student_id) {
    alert("This student account is not linked to any student record.");
    window.location.href = "login.html?role=student";
}

/* =======================
   LOAD STUDENT DASHBOARD
======================= */
async function loadStudentDashboard() {
    const studentId = user.student_id;

    try {
        const response = await fetch(`${DASHBOARD_API}/${studentId}`);
        const data = await response.json();

        document.getElementById("studentName").textContent = data.name || "-";
        document.getElementById("studentMatric").textContent = data.matric || "-";
        document.getElementById("studentProgramme").textContent = data.programme || "-";
        document.getElementById("studentCGPA").textContent = data.cgpa || "0.00";

        document.getElementById("cgpaScore").textContent = data.scores_breakdown.academic || 0;
        document.getElementById("cocuScore").textContent = data.scores_breakdown.cocurriculum || 0;
        document.getElementById("internshipScore").textContent = data.scores_breakdown.internship || 0;
        document.getElementById("certScore").textContent = data.scores_breakdown.certifications || 0;

        document.getElementById("employabilityStatus").textContent = data.employability_status || "-";
        document.getElementById("studentScore").textContent = `${data.employability_score || 0}%`;

        const percentage = Math.min(Number(data.employability_score), 100);
        document.getElementById("scoreProgress").style.width = percentage + "%";
        document.getElementById("scoreProgress").textContent = percentage.toFixed(0) + "%";

    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

/* =======================
   INIT
======================= */
loadStudentDashboard();