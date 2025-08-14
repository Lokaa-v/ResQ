function login() {
    // No validation - allow any username/password
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  
    // Fetch cases from the server and load them into the dashboard
    fetchCases();
}
  
function logout() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

function fetchCases() {
    // Fetch cases from the backend
    fetch('http://localhost:5000/cases')
        .then(response => response.json())
        .then(cases => {
            const matchAccuracyList = document.getElementById("matchAccuracyList");
            matchAccuracyList.innerHTML = "";  // Clear previous cases

            // Display all cases
            cases.forEach(caseItem => {
                const matchCard = document.createElement("div");
                matchCard.classList.add("match-card");
                matchCard.innerHTML = `
                    <h3>${caseItem.name}</h3>
                    <p>Age: ${caseItem.age}</p>
                    <p>District: ${caseItem.district}</p>
                    <button onclick="viewCaseDetails('${caseItem._id}')">View Details</button>
                `;
                matchAccuracyList.appendChild(matchCard);
            });
        })
        .catch(err => console.error('Error fetching cases:', err));
}

function viewCaseDetails(caseId) {
    // Fetch case details from the server by ID
    fetch(`http://localhost:5000/case-photo/${caseId}`)
        .then(response => response.blob())
        .then(image => {
            const imageUrl = URL.createObjectURL(image);
            document.getElementById("detailImage").src = imageUrl;
        })
        .catch(err => console.error('Error fetching image:', err));

    // Fetch case details like name, age, location, etc.
    fetch(`http://localhost:5000/cases/${caseId}`)
        .then(response => response.json())
        .then(caseData => {
            document.getElementById("detailName").textContent = caseData.name;
            document.getElementById("detailAge").textContent = caseData.age;
            document.getElementById("detailLocation").textContent = caseData.lastSeenLocation;
            document.getElementById("detailDistrict").textContent = caseData.district;
            document.getElementById("detailDescription").textContent = caseData.description;
            document.getElementById("detailStatus").textContent = "Missing";
        })
        .catch(err => console.error('Error fetching case details:', err));

    document.getElementById("caseDetailsBox").classList.remove("hidden");
}

function closeCaseDetails() {
    document.getElementById("caseDetailsBox").classList.add("hidden");
}
  
// Attach event listener to "Cases" menu
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sidebar ul li");
  
    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Remove active from all
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
  
            if (item.textContent.trim() === "Cases") {
                fetchCases(); // Load cases on click
            }
        });
    });
});
