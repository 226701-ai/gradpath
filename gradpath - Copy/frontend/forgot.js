const forgotForm = document.getElementById("forgotForm");
const message = document.getElementById("message");

forgotForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    message.textContent = "";
    message.className = "login-message";

    const email = document.getElementById("email").value.trim();

    try {
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        message.textContent = data.message;
        message.classList.add(response.ok ? "success" : "error");

    } catch (error) {
        console.error(error);
        message.textContent = "Something went wrong. Please try again.";
        message.classList.add("error");
    }
});