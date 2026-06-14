const REGISTER_API = "http://localhost:3000/api/auth/register-student";

document.getElementById("registerForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        matric: document.getElementById("matric").value.trim(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        programme: document.getElementById("programme").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    const message = document.getElementById("registerMessage");

    if (!response.ok) {
        message.textContent = result.error || "Registration failed";
        message.style.color = "#c0392b";
        return;
    }

    message.textContent = "Registration successful. Redirecting to login...";
    message.style.color = "#27ae60";

    setTimeout(() => {
        window.location.href = "login.html?role=student";
    }, 1200);
});