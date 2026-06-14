const API_URL = "http://localhost:3000/api/certifications";
const STUDENT_API = "http://localhost:3000/api/students";

async function loadDropdowns() {
    try {
        const res = await fetch(STUDENT_API);
        if (!res.ok) throw new Error("Failed to load students");
        const students = await res.json();
        const select = document.getElementById("student_id");
        select.innerHTML = '<option value="">Select Student</option>'; // Reset
        students.forEach(s => {
            select.innerHTML += `<option value="${s.student_id}">${s.name}</option>`;
        });
    } catch (err) {
        console.error("Error loading dropdowns:", err);
    }
}

async function loadCertifications() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load certifications");
        const data = await res.json();
        const list = document.getElementById("certList");
        list.innerHTML = "";
        data.forEach(c => {
            list.innerHTML += `
                <tr>
                    <td>${c.student_name}</td>
                    <td>${c.cert_name}</td>
                    <td>${c.grade}</td>
                    <td><button onclick="deleteCert(${c.id})" class="delete-btn">Delete</button></td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error loading certs:", err);
    }
}

document.getElementById("certForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const cert = {
        student_id: document.getElementById("student_id").value,
        cert_name: document.getElementById("cert_name").value,
        grade: document.getElementById("cert_grade").value
    };

    console.log("Attempting to save:", cert); // DEBUG: Check what we are sending

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cert)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || "Failed to save certification");
        }

        console.log("Success:", result);
        document.getElementById("certForm").reset();
        loadCertifications(); // Reload table
    } catch (err) {
        console.error("Submission Error:", err);
        alert("Error saving: " + err.message);
    }
});

async function deleteCert(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadCertifications();
    } catch (err) {
        console.error("Delete Error:", err);
    }
}

loadDropdowns();
loadCertifications();