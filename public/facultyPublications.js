document.addEventListener("DOMContentLoaded", function () {
    const publicationTypeSelect = document.getElementById("PublicationType");
    const booksFields = document.getElementById("booksFields");
    const journalFields = document.getElementById("journalFields");

    publicationTypeSelect.addEventListener("change", function () {
        const selectedOption = publicationTypeSelect.value;

        if (selectedOption === "books") {
            booksFields.style.display = "block";
            journalFields.style.display = "none";
        } else if (selectedOption === "journals") {
            booksFields.style.display = "none";
            journalFields.style.display = "block";
        } else {
            booksFields.style.display = "none";
            journalFields.style.display = "none";
        }
    });
});
