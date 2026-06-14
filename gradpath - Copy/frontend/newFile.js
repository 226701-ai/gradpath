import { allStudentActivities, displayStudentActivities } from "./studentActivity";

document.getElementById("searchStudentActivity")
    .addEventListener("keyup", () => {

        const keyword = document
            .getElementById("searchStudentActivity")
            .value
            .toLowerCase();

        const filtered = allStudentActivities.filter(record => record.student_name.toLowerCase().includes(keyword) ||
            record.activity_name.toLowerCase().includes(keyword) ||
            record.outcome_name.toLowerCase().includes(keyword) ||
            record.score.toString().includes(keyword)
        );

        displayStudentActivities(filtered);
    });
