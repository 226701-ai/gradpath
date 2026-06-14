let allEnrolments = [];

const API_URL = "http://localhost:3000/api/enrolment";
const STUDENT_API = "http://localhost:3000/api/students";
const COURSE_API = "http://localhost:3000/api/course";

/* =======================
   LOAD DROPDOWNS
======================= */
async function loadDropdowns() {
    try {
        const studentResponse = await fetch(STUDENT_API);
        const students = await studentResponse.json();

        const courseResponse = await fetch(COURSE_API);
        const courses = await courseResponse.json();

        const studentSelect = document.getElementById("student_id");
        const courseSelect = document.getElementById("course_code");

        studentSelect.innerHTML = `<option value="">Select Student</option>`;
        courseSelect.innerHTML = `<option value="">Select Course</option>`;

        students.forEach(student => {
            studentSelect.innerHTML += `
                <option value="${student.student_id}">
                    ${student.name}
                </option>
            `;
        });

        courses.forEach(course => {
            courseSelect.innerHTML += `
                <option value="${course.course_code}">
                    ${course.course_name}
                </option>
            `;
        });

    } catch (error) {
        console.error("Dropdown error:", error);
    }
}

/* =======================
   LOAD ENROLMENTS
======================= */
async function loadEnrolments() {
    try {
        const response = await fetch(API_URL);
        allEnrolments = await response.json();

        console.log("Enrolments:", allEnrolments);

        displayEnrolments(allEnrolments);

    } catch (error) {
        console.error("Load enrolments error:", error);
    }
}

/* =======================
   DISPLAY TABLE
======================= */
function displayEnrolments(enrolments) {
    const list = document.getElementById("enrolmentList");
    list.innerHTML = "";

    if (!enrolments.length) {
        list.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No enrolment record found
                </td>
            </tr>
        `;
        return;
    }

    enrolments.forEach(item => {
        list.innerHTML += `
            <tr>
                <td>${item.matric || "-"}</td>
                <td>${item.student_name}</td>
                <td>${item.course_code}</td>
                <td>${item.course_name}</td>
                <td>${item.grade}</td>
                <td>
                    <button
                        onclick="deleteEnrolment(${item.student_id}, '${item.course_code}')"
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
   ADD ENROLMENT
======================= */
document.getElementById("enrolmentForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const enrolment = {
        student_id: document.getElementById("student_id").value,
        course_code: document.getElementById("course_code").value,
        grade: document.getElementById("grade").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enrolment)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to add enrolment");
            return;
        }

        document.getElementById("enrolmentForm").reset();

        await loadDropdowns();
        await loadEnrolments();

    } catch (error) {
        console.error("Add enrolment error:", error);
        alert("Error adding enrolment");
    }
});

/* =======================
   DELETE ENROLMENT
======================= */
async function deleteEnrolment(studentId, courseCode) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this enrolment?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(
            `${API_URL}/${studentId}/${courseCode}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to delete enrolment");
            return;
        }

        alert("Enrolment deleted successfully!");

        await loadEnrolments();

    } catch (error) {
        console.error("Delete enrolment error:", error);
        alert("Delete failed");
    }
}

/* =======================
   SEARCH
======================= */
document.getElementById("searchEnrolment")
.addEventListener("keyup", () => {
    const keyword = document
        .getElementById("searchEnrolment")
        .value
        .toLowerCase();

    const filtered = allEnrolments.filter(item =>
        (item.matric && item.matric.toLowerCase().includes(keyword)) ||
        item.student_name.toLowerCase().includes(keyword) ||
        item.course_code.toLowerCase().includes(keyword) ||
        item.course_name.toLowerCase().includes(keyword) ||
        item.grade.toLowerCase().includes(keyword)
    );

    displayEnrolments(filtered);
});

/* =======================
   INIT
======================= */
loadDropdowns();
loadEnrolments();