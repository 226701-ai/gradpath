const API_URL = "http://localhost:3000/api/dashboard";

let programmeChartInstance = null;
let activityChartInstance = null;
let courseEnrolmentChartInstance = null;

/* =======================
   ANIMATE NUMBER COUNTER
======================= */
function animateValue(id, end) {
    let start = 0;
    let duration = 800;
    let increment = end / (duration / 16);

    let obj = document.getElementById(id);

    if (!obj) return;

    let timer = setInterval(() => {
        start += increment;

        if (start >= end) {
            obj.textContent = end;
            clearInterval(timer);
        } else {
            obj.textContent = Math.floor(start);
        }
    }, 16);
}

/* =======================
   LOAD DASHBOARD
======================= */
async function loadDashboard() {

    document.getElementById("loading").style.display = "block";

    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("Dashboard data:", data);

    document.getElementById("loading").style.display = "none";

    /* COUNTERS */
    animateValue("students", data.total_students || 0);
    animateValue("activities", data.total_activities || 0);
    animateValue("outcomes", data.total_outcomes || 0);
    animateValue("courses", data.total_courses || 0);
    animateValue("enrolments", data.total_enrolments || 0);
    animateValue("score", data.total_score || 0);

    /* DESTROY OLD CHARTS */
    if (programmeChartInstance) programmeChartInstance.destroy();
    if (activityChartInstance) activityChartInstance.destroy();
    if (courseEnrolmentChartInstance) courseEnrolmentChartInstance.destroy();

    /* PROGRAMME CHART */
    programmeChartInstance = new Chart(
        document.getElementById("programmeChart"),
        {
            type: "bar",
            data: {
                labels: (data.programme_chart || []).map(i => i.programme),
                datasets: [{
                    label: "Students",
                    data: (data.programme_chart || []).map(i => i.total),
                    backgroundColor: "#7A0019"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

    /* ACTIVITY CHART */
    activityChartInstance = new Chart(
        document.getElementById("activityChart"),
        {
            type: "pie",
            data: {
                labels: (data.activity_chart || []).map(i => i.activity_type),
                datasets: [{
                    data: (data.activity_chart || []).map(i => i.total),
                    backgroundColor: ["#7A0019", "#c0392b", "#e74c3c", "#ff7675"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

    /* COURSE ENROLMENT CHART */
    courseEnrolmentChartInstance = new Chart(
        document.getElementById("courseEnrolmentChart"),
        {
            type: "bar",
            data: {
                labels: (data.course_enrolment_chart || []).map(i => i.course_code),
                datasets: [{
                    label: "Enrolled Students",
                    data: (data.course_enrolment_chart || []).map(i => i.total),
                    backgroundColor: "#34495e"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

/* INIT */
loadDashboard();