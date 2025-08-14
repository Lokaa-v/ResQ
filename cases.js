document.addEventListener("DOMContentLoaded", () => {
    // Example: Loading cases from localStorage or API (for now localStorage)
    loadCases();
  });
  
  function loadCases() {
    const caseList = document.getElementById("caseList");
    caseList.innerHTML = ""; // Clear previous
  
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
  
    if (cases.length === 0) {
      caseList.innerHTML = "<p>No cases available.</p>";
      return;
    }
  
    cases.forEach((c, index) => {
      const caseDiv = document.createElement("div");
      caseDiv.classList.add("case-card");
      caseDiv.innerHTML = `
        <h3>${c.name}</h3>
        <p>Age: ${c.age}</p>
        <p>Last Seen: ${c.lastSeenLocation}</p>
        <p><strong>District:</strong> ${c.district}</p>
        <button onclick="viewCase(${index})">View Details</button>
      `;
      caseList.appendChild(caseDiv);
    });
  }
  
  function viewCase(index) {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    const selected = cases[index];
  
    // Show the case details (use a modal or navigate to another page)
    alert(`Name: ${selected.name}\nAge: ${selected.age}\nLocation: ${selected.lastSeenLocation}\nDistrict: ${selected.district}\nDescription: ${selected.description}`);
  }


const express = require('express');
const router = express.Router();
const Case = require('../models/Case'); // This should point to your Case model

// GET /api/cases - Get all case data
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

module.exports = router;
  