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

    const response =
        await fetch(`${DASHBOARD_API}/${studentId}`);

    const data = await response.json();

    document.getElementById("studentName")
        .textContent = data.name;

    document.getElementById("studentMatric")
        .textContent = data.matric;

    document.getElementById("studentProgramme")
        .textContent = data.programme;

    document.getElementById("studentScore")
        .textContent = data.employability_score;

    const percentage =
        Math.min((data.employability_score / 100) * 100, 100);

    document.getElementById("scoreProgress")
        .style.width = percentage + "%";

    document.getElementById("scoreProgress")
        .textContent = percentage.toFixed(0) + "%";
}

/* =======================
   INIT
======================= */
loadStudentDashboard();