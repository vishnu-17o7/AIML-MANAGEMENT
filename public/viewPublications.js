document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded and parsed");
    applyFilters(); // Initial load with default filters
  });
  
  function applyFilters() {
    const publicationType = document.getElementById("publicationType").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const index = document.getElementById("index").value;
  
    // Call the fetch function with the selected filters
    fetchFacultyPublications(publicationType, fromDate, toDate, index);
  }
  
  function fetchFacultyPublications(publicationType, fromDate, toDate, index) {
    const url = `/api/publication_records?publicationType=${publicationType}&fromDate=${fromDate}&toDate=${toDate}&index=${index}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => updateTable(data))
      .catch(error => console.error("Error fetching data:", error));
  }
  
  function updateTable(data) {
    const tableBody = document.querySelector("#publicationTable tbody");
    tableBody.innerHTML = '';
  
    data.forEach(publication => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = publication.PublicationID;
      row.insertCell(1).textContent = publication.FacultyID;
      row.insertCell(2).textContent = publication.Title;
      row.insertCell(3).textContent = publication.Chapter;
      row.insertCell(4).textContent = formatDate(publication.PublicationDate);
      row.insertCell(5).textContent = publication.Volume;
      row.insertCell(6).textContent = publication.IndexType;
      row.insertCell(7).textContent = publication.FilePath;
      row.insertCell(8).textContent = publication.PublicationType;
    });
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  
  // Add other functions and event handlers as needed
  