document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded and parsed");
    fetch("/api/attendance_records")
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

function applyFilters() {
    // Get filter values
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const eventTypesSelect = document.querySelectorAll('input[name="eventTypes"]:checked');
    const selectedEventTypes = Array.from(eventTypesSelect).map(checkbox => checkbox.value);
    const sortByDate = document.getElementById("sortByDate").value;

    // Send filters to the server
    fetchAttendanceRecords(fromDate, toDate, selectedEventTypes, sortByDate);
}
function fetchAttendanceRecords(fromDate = "", toDate = "", eventTypes = [], sortByDate = "") {
    // Construct the URL with filters
    const url = `/api/attendance_records?fromDate=${fromDate}&toDate=${toDate}&eventTypes=${eventTypes.join("','")}&sortByDate=${sortByDate}`;

    // Fetch records from the server
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Update the table with filtered data
            updateTable(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function updateTable(data) {
    // Clear existing table rows
    const tableBody = document.querySelector("#recordTable tbody");
    tableBody.innerHTML = '';

    // Add new rows with filtered data
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
}