const COURSE_API = "http://localhost:3000/api/course";

let allCourses = [];
let editCourseCode = null;

/* =======================
   LOAD COURSES
======================= */
async function loadCourses() {
    const res = await fetch(COURSE_API);
    allCourses = await res.json();

    displayCourses(allCourses);
}

/* =======================
   DISPLAY COURSES - PROFESSIONAL TABLE
======================= */
function displayCourses(courses) {
    const list = document.getElementById("courseList");

    if (!courses.length) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No course records found</h3>
                <p>Add a new course to display the data here.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = `
        <table class="data-table professional-table">
            <thead>
                <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credit Hours</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${courses.map(course => `
                    <tr>
                        <td>${course.course_code}</td>
                        <td>${course.course_name}</td>
                        <td>
                            <span class="programme-badge">
                                ${course.credit_hours} Credit Hours
                            </span>
                        </td>
                        <td class="action-cell">
                            <button onclick="openCourseModal('${course.course_code}')">
                                Edit
                            </button>

                            <button
                                onclick="deleteCourse('${course.course_code}')"
                                class="delete-btn"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

/* =======================
   ADD COURSE
======================= */
document.getElementById("courseForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        course_code: document.getElementById("course_code").value,
        course_name: document.getElementById("course_name").value,
        credit_hours: document.getElementById("credit_hours").value
    };

    const response = await fetch(COURSE_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to add course");
        return;
    }

    document.getElementById("courseForm").reset();
    loadCourses();
});

/* =======================
   OPEN EDIT MODAL
======================= */
function openCourseModal(courseCode) {
    editCourseCode = courseCode;

    const course = allCourses.find(c => c.course_code === courseCode);

    document.getElementById("editCourseCode").value = course.course_code;
    document.getElementById("editCourseName").value = course.course_name;
    document.getElementById("editCreditHours").value = course.credit_hours;

    document.getElementById("editCourseModal").style.display = "flex";
}

/* =======================
   CLOSE EDIT MODAL
======================= */
function closeCourseModal() {
    document.getElementById("editCourseModal").style.display = "none";
}

/* =======================
   UPDATE COURSE
======================= */
async function updateCourse() {
    const data = {
        course_name: document.getElementById("editCourseName").value,
        credit_hours: document.getElementById("editCreditHours").value
    };

    const response = await fetch(`${COURSE_API}/${editCourseCode}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to update course");
        return;
    }

    closeCourseModal();
    loadCourses();
}

/* =======================
   DELETE COURSE
======================= */
async function deleteCourse(courseCode) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`${COURSE_API}/${courseCode}`, {
        method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to delete course");
        return;
    }

    loadCourses();
}

/* =======================
   SEARCH COURSE
======================= */
document.getElementById("searchCourse")
.addEventListener("keyup", () => {
    const keyword = document.getElementById("searchCourse")
        .value.toLowerCase();

    const filtered = allCourses.filter(course =>
        course.course_code.toLowerCase().includes(keyword) ||
        course.course_name.toLowerCase().includes(keyword) ||
        course.credit_hours.toString().includes(keyword)
    );

    displayCourses(filtered);
});

/* =======================
   INIT
======================= */
loadCourses();