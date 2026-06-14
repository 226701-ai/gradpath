let allStudentActivities = [];

const API_URL = "http://localhost:3000/api/student-activities";
const STUDENT_API = "http://localhost:3000/api/students";
const ACTIVITY_API = "http://localhost:3000/api/activities";

/* =======================
   LOAD DROPDOWNS
======================= */
async function loadDropdowns() {
    try {
        const studentResponse = await fetch(STUDENT_API);
        const students = await studentResponse.json();

        const activityResponse = await fetch(ACTIVITY_API);
        const activities = await activityResponse.json();

        const studentSelect = document.getElementById("student_id");
        const activitySelect = document.getElementById("activity_id");

        studentSelect.innerHTML = `<option value="">Select Student</option>`;
        activitySelect.innerHTML = `<option value="">Select Activity</option>`;

        students.forEach(student => {
            studentSelect.innerHTML += `
                <option value="${student.student_id}">
                    ${student.name}
                </option>
            `;
        });

        activities.forEach(activity => {
            activitySelect.innerHTML += `
                <option value="${activity.activity_id}">
                    ${activity.activity_name}
                </option>
            `;
        });

    } catch (error) {
        console.error("Dropdown error:", error);
    }
}

/* =======================
   SUBMIT ASSIGN ACTIVITY
======================= */
document.getElementById("studentActivityForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentActivity = {
        student_id: document.getElementById("student_id").value,
        activity_id: document.getElementById("activity_id").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentActivity)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to assign activity");
            return;
        }

        document.getElementById("studentActivityForm").reset();

        await loadDropdowns();
        await loadStudentActivities();

    } catch (error) {
        console.error("Assign activity error:", error);
        alert("Error assigning activity");
    }
});

/* =======================
   LOAD DATA
======================= */
async function loadStudentActivities() {
    try {
        const response = await fetch(API_URL);
        allStudentActivities = await response.json();

        displayStudentActivities(allStudentActivities);

    } catch (error) {
        console.error("Load student activities error:", error);
    }
}

/* =======================
   DISPLAY TABLE
======================= */
function displayStudentActivities(records) {
    const list = document.getElementById("studentActivityList");
    list.innerHTML = "";

    if (!records.length) {
        list.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No student activity record found
                </td>
            </tr>
        `;
        return;
    }

    records.forEach(record => {
        list.innerHTML += `
            <tr>
                <td>${record.student_name}</td>
                <td>${record.activity_name}</td>
                <td>${record.score}</td>
                <td>${record.outcome_name}</td>
                <td>
                    <button
                        onclick="deleteStudentActivity(${record.student_activity_id})"
                        class="delete-btn"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* =======================
   DELETE STUDENT ACTIVITY
======================= */
async function deleteStudentActivity(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student activity?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to delete student activity");
            return;
        }

        alert("Student activity deleted successfully!");

        await loadStudentActivities();

    } catch (error) {
        console.error("Delete student activity error:", error);
        alert("Delete failed");
    }
}

/* =======================
   SEARCH
======================= */
document.getElementById("searchStudentActivity")
.addEventListener("keyup", () => {
    const keyword = document.getElementById("searchStudentActivity")
        .value
        .toLowerCase();

    const filtered = allStudentActivities.filter(record =>
        (record.student_name || "").toLowerCase().includes(keyword) ||
        (record.activity_name || "").toLowerCase().includes(keyword) ||
        (record.outcome_name || "").toLowerCase().includes(keyword) ||
        (record.score || "").toString().includes(keyword)
    );

    displayStudentActivities(filtered);
});

/* =======================
   INIT
======================= */
loadDropdowns();
loadStudentActivities();