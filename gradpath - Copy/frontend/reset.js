const resetForm = document.getElementById("resetForm");
const message = document.getElementById("message");

const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

if (!userId) {
    message.textContent = "Invalid reset link.";
    message.className = "login-message error";
    resetForm.style.display = "none";
}

resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    message.textContent = "";
    message.className = "login-message";

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        message.textContent = "Password must be at least 8 characters.";
        message.classList.add("error");
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.classList.add("error");
        return;
    }

    try {
        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        message.textContent = data.message;
        message.classList.add(response.ok ? "success" : "error");

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Something went wrong. Please try again.";
        message.classList.add("error");
    }
});