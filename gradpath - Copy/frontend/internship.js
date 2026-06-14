const API_URL = "http://localhost:3000/api/internships";
const STUDENT_API = "http://localhost:3000/api/students";

async function loadDropdowns() {
    const res = await fetch(STUDENT_API);
    const students = await res.json();
    const select = document.getElementById("student_id");
    students.forEach(s => {
        select.innerHTML += `<option value="${s.student_id}">${s.name}</option>`;
    });
}

async function loadInternships() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const list = document.getElementById("internList");
    list.innerHTML = "";
    data.forEach(i => {
        list.innerHTML += `
            <tr>
                <td>${i.student_name}</td>
                <td>${i.company_name}</td>
                <td>${i.rating}</td>
                <td><button onclick="deleteIntern(${i.id})" class="delete-btn">Delete</button></td>
            </tr>
        `;
    });
}

document.getElementById("internForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const intern = {
        student_id: document.getElementById("student_id").value,
        company_name: document.getElementById("company_name").value,
        rating: document.getElementById("rating").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intern)
    });
    document.getElementById("internForm").reset();
    loadInternships();
});

async function deleteIntern(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadInternships();
}

loadDropdowns();
loadInternships();