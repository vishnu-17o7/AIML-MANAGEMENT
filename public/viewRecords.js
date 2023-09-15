document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded and parsed");
    fetch("/api/attendance_records") // Assuming your server API endpoint is /api/attendance_records
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#recordTable tbody");

            data.forEach((record) => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = record.id;
                row.insertCell(1).textContent = record.professor_id;
                row.insertCell(2).textContent = record.event_type;
                row.insertCell(3).textContent = record.event_date;
                row.insertCell(4).textContent = record.event_name;
                row.insertCell(5).textContent = record.location;
                row.insertCell(6).textContent = record.organizer;
                row.insertCell(7).textContent = record.duration_minutes;
                row.insertCell(8).textContent = record.feedback;
                row.insertCell(9).textContent = record.proof_file_path;
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
});
