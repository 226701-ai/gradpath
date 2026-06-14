let allStudents = [];
let editId = null;

const API_URL = "http://localhost:3000/api/students";

/* =======================
   TOAST MESSAGE
======================= */
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.className = "toast";
    }, 2500);
}

/* =======================
   CREATE STUDENT
======================= */
document.getElementById("studentForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        matric: document.getElementById("matric").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        programme: document.getElementById("programme").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    document.getElementById("studentForm").reset();
    loadStudents();

    showToast("Student added successfully ✔", "success");
});

/* =======================
   LOAD STUDENTS
======================= */
async function loadStudents() {
    const response = await fetch(API_URL);
    allStudents = await response.json();

    displayStudents(allStudents);
}

/* =======================
   DISPLAY STUDENTS - PROFESSIONAL TABLE
======================= */
function displayStudents(students) {
    const list = document.getElementById("studentList");

    if (!students.length) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No student records found</h3>
                <p>Add a new student to display the data here.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = `
        <table class="data-table professional-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Matric</th>
                    <th>Email</th>
                    <th>Programme</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.matric || "-"}</td>
                        <td>${student.email}</td>
                        <td>${student.programme}</td>
                        
                        <td class="action-cell">
                            <button onclick="openEditModal(${student.student_id})">
                                Edit
                            </button>

                            <button
                                onclick="deleteStudent(${student.student_id})"
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
   SEARCH
======================= */
document.getElementById("searchStudent")
.addEventListener("keyup", () => {
    const keyword = document
        .getElementById("searchStudent")
        .value
        .toLowerCase();

    const filtered = allStudents.filter(student =>
        (student.matric || "").toLowerCase().includes(keyword) ||
        (student.name || "").toLowerCase().includes(keyword) ||
        (student.email || "").toLowerCase().includes(keyword) ||
        (student.programme || "").toLowerCase().includes(keyword)
    );

    displayStudents(filtered);
});

/* =======================
   DELETE STUDENT
======================= */
async function deleteStudent(id) {
    const confirmDelete = confirm("Are you sure?");

    if (!confirmDelete) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadStudents();

    showToast("Student deleted ✔", "success");
}

/* =======================
   OPEN EDIT MODAL
======================= */
function openEditModal(id) {
    editId = id;

    const student = allStudents.find(s => s.student_id === id);

    document.getElementById("editMatric").value = student.matric || "";
    document.getElementById("editName").value = student.name;
    document.getElementById("editEmail").value = student.email;
    document.getElementById("editProgramme").value = student.programme;

    document.getElementById("editModal").style.display = "flex";
}

/* =======================
   UPDATE STUDENT
======================= */
async function updateStudent() {
    const matric = document.getElementById("editMatric").value;
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;
    const programme = document.getElementById("editProgramme").value;

    await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            matric,
            name,
            email,
            programme
        })
    });

    closeModal();
    loadStudents();

    showToast("Student updated successfully ✔", "success");
}

/* =======================
   CLOSE MODAL
======================= */
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

/* =======================
   INIT
======================= */
loadStudents();