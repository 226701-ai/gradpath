let allOutcomes = [];
let editOutcomeId = null;

const API_URL = "http://localhost:3000/api/outcomes";

/* =======================
   ADD OUTCOME
======================= */
document
.getElementById("outcomeForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const outcome = {
        outcome_name: document.getElementById("outcome_name").value,
        category: document.getElementById("category").value
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(outcome)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to add outcome");
        return;
    }

    document.getElementById("outcomeForm").reset();
    loadOutcomes();
});

/* =======================
   LOAD OUTCOMES
======================= */
async function loadOutcomes() {
    const response = await fetch(API_URL);
    allOutcomes = await response.json();

    const count = document.getElementById("outcomeCount");
    if (count) {
        count.textContent = allOutcomes.length;
    }

    displayOutcomes(allOutcomes);
}

/* =======================
   DISPLAY OUTCOMES - PROFESSIONAL TABLE
======================= */
function displayOutcomes(outcomes) {
    const list = document.getElementById("outcomeList");

    if (!outcomes.length) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No outcome records found</h3>
                <p>Add a new learning outcome to display the data here.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = `
        <table class="data-table professional-table">
            <thead>
                <tr>
                    <th>Outcome Name</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${outcomes.map(outcome => `
                    <tr>
                        <td>${outcome.outcome_name}</td>
                        <td>
                            <span class="programme-badge">
                                ${outcome.category}
                            </span>
                        </td>
                        <td class="action-cell">
                            <button onclick="openOutcomeModal(${outcome.outcome_id})">
                                Edit
                            </button>

                            <button
                                onclick="deleteOutcome(${outcome.outcome_id})"
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
   OPEN EDIT MODAL
======================= */
function openOutcomeModal(id) {
    editOutcomeId = id;

    const outcome = allOutcomes.find(o => o.outcome_id === id);

    document.getElementById("editOutcomeName").value = outcome.outcome_name;
    document.getElementById("editCategory").value = outcome.category;

    document.getElementById("editOutcomeModal").style.display = "flex";
}

/* =======================
   CLOSE EDIT MODAL
======================= */
function closeOutcomeModal() {
    document.getElementById("editOutcomeModal").style.display = "none";
}

/* =======================
   UPDATE OUTCOME
======================= */
async function updateOutcome() {
    const outcome = {
        outcome_name: document.getElementById("editOutcomeName").value,
        category: document.getElementById("editCategory").value
    };

    const response = await fetch(`${API_URL}/${editOutcomeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(outcome)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to update outcome");
        return;
    }

    closeOutcomeModal();
    loadOutcomes();
}

/* =======================
   DELETE OUTCOME
======================= */
async function deleteOutcome(id) {
    if (!confirm("Delete this outcome?")) {
        return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method:"DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to delete outcome");
        return;
    }

    loadOutcomes();
}

/* =======================
   SEARCH OUTCOME
======================= */
document.getElementById("searchOutcome")
.addEventListener("keyup", () => {
    const keyword = document.getElementById("searchOutcome")
        .value
        .toLowerCase();

    const filtered = allOutcomes.filter(outcome =>
        outcome.outcome_name.toLowerCase().includes(keyword) ||
        outcome.category.toLowerCase().includes(keyword)
    );

    displayOutcomes(filtered);
});

/* =======================
   INIT
======================= */
loadOutcomes();