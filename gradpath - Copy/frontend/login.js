const LOGIN_API = "http://localhost:3000/api/auth/login";

document.getElementById("loginForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    try {
        const response = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        const message = document.getElementById("loginMessage");

        if (!response.ok) {
            message.textContent = result.message || "Invalid login";
            message.style.color = "#c0392b";
            return;
        }

        localStorage.setItem("user", JSON.stringify(result.user));

        if (result.user.role === "admin") {
            window.location.href = "dashboard.html";
        } 
        else if (result.user.role === "student") {
            if (!result.user.student_id) {
                message.textContent = "Student account is not linked to student record.";
                message.style.color = "#c0392b";
                return;
            }

            window.location.href = "studentDashboard.html";
        }

    } catch (error) {
        document.getElementById("loginMessage").textContent =
            "Cannot connect to server. Make sure backend is running.";
    }
});