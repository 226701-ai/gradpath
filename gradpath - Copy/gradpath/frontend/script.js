const API_URL = "http://localhost:3000/api/students";

document.getElementById("studentForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const student = {
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

  alert("Student added successfully!");
  document.getElementById("studentForm").reset();
  loadStudents();
});

async function loadStudents() {
  const response = await fetch(API_URL);
  const students = await response.json();

  const list = document.getElementById("studentList");
  list.innerHTML = "";

  students.forEach(student => {
    list.innerHTML += `
      <div class="card">
        <p><strong>ID:</strong> ${student.student_id}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Programme:</strong> ${student.programme}</p>
      </div>
    `;
  });
}

loadStudents();