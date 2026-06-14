let allActivities = [];
let allOutcomes = [];
let editActivityId = null;

const API_URL = "http://localhost:3000/api/activities";
const OUTCOME_API = "http://localhost:3000/api/outcomes";

/* =======================
   LOAD OUTCOME DROPDOWNS
======================= */
async function loadOutcomeDropdowns() {
    const response = await fetch(OUTCOME_API);
    allOutcomes = await response.json();

    const addSelect = document.getElementById("outcome_id");
    const editSelect = document.getElementById("editOutcomeId");

    addSelect.innerHTML = `<option value="">Select Outcome</option>`;
    editSelect.innerHTML = `<option value="">Select Outcome</option>`;

    allOutcomes.forEach(outcome => {
        addSelect.innerHTML += `
            <option value="${outcome.outcome_id}">
                ${outcome.outcome_name}
            </option>
        `;

        editSelect.innerHTML += `
            <option value="${outcome.outcome_id}">
                ${outcome.outcome_name}
            </option>
        `;
    });
}

/* =======================
   ADD ACTIVITY
======================= */
document.getElementById("activityForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const activity = {
        activity_name: document.getElementById("activity_name").value,
        activity_type: document.getElementById("activity_type").value,
        score: document.getElementById("score").value,
        outcome_id: document.getElementById("outcome_id").value
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(activity)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to add activity");
        return;
    }

    document.getElementById("activityForm").reset();

    await loadOutcomeDropdowns();
    await loadActivities();
});

/* =======================
   LOAD ACTIVITIES
======================= */
async function loadActivities() {
    const response = await fetch(API_URL);
    allActivities = await response.json();

    const count = document.getElementById("activityCount");
    if (count) {
        count.textContent = allActivities.length;
    }

    displayActivities(allActivities);
}

/* =======================
   DISPLAY ACTIVITIES - PROFESSIONAL TABLE
======================= */
function displayActivities(activities) {
    const list = document.getElementById("activityList");

    if (!activities.length) {
        list.innerHTML = `
            <div class="empty-state">
                <h3>No activity records found</h3>
                <p>Add a new activity to display the data here.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = `
        <table class="data-table professional-table">
            <thead>
                <tr>
                    <th>Activity Name</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Learning Outcome</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${activities.map(activity => `
                    <tr>
                        <td>${activity.activity_name}</td>
                        <td>
                            <span class="programme-badge">
                                ${activity.activity_type}
                            </span>
                        </td>
                        <td>${activity.score}</td>
                        <td>${activity.outcome_name}</td>
                        <td class="action-cell">
                            <button onclick="openActivityModal(${activity.activity_id})">
                                Edit
                            </button>

                            <button
                                onclick="deleteActivity(${activity.activity_id})"
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
function openActivityModal(id) {
    editActivityId = id;

    const activity = allActivities.find(a => a.activity_id === id);

    document.getElementById("editActivityName").value = activity.activity_name;
    document.getElementById("editActivityType").value = activity.activity_type;
    document.getElementById("editScore").value = activity.score;
    document.getElementById("editOutcomeId").value = activity.outcome_id;

    document.getElementById("editActivityModal").style.display = "flex";
}

/* =======================
   CLOSE EDIT MODAL
======================= */
function closeActivityModal() {
    document.getElementById("editActivityModal").style.display = "none";
}

/* =======================
   UPDATE ACTIVITY
======================= */
async function updateActivity() {
    const activity = {
        activity_name: document.getElementById("editActivityName").value,
        activity_type: document.getElementById("editActivityType").value,
        score: document.getElementById("editScore").value,
        outcome_id: document.getElementById("editOutcomeId").value
    };

    const response = await fetch(`${API_URL}/${editActivityId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(activity)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to update activity");
        return;
    }

    closeActivityModal();
    await loadActivities();
}

/* =======================
   DELETE ACTIVITY
======================= */
async function deleteActivity(id) {
    if (!confirm("Delete this activity?")) {
        return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Failed to delete activity");
        return;
    }

    await loadActivities();
}

/* =======================
   SEARCH ACTIVITY
======================= */
document.getElementById("searchActivity")
.addEventListener("keyup", () => {
    const keyword = document.getElementById("searchActivity")
        .value
        .toLowerCase();

    const filtered = allActivities.filter(activity =>
        activity.activity_name.toLowerCase().includes(keyword) ||
        activity.activity_type.toLowerCase().includes(keyword) ||
        activity.outcome_name.toLowerCase().includes(keyword) ||
        activity.score.toString().includes(keyword)
    );

    displayActivities(filtered);
});

/* =======================
   INIT
======================= */
loadOutcomeDropdowns();
loadActivities();