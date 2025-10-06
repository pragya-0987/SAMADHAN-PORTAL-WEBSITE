const complaintBody = document.getElementById("complaintBody");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const summary = document.getElementById("summary");

const isAdmin = true; // Change to false for regular users

function getComplaints() {
  return JSON.parse(localStorage.getItem("complaints") || "[]");
}

function saveComplaints(complaints) {
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

function renderTable() {
  const complaints = getComplaints();
  const statusValue = statusFilter.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  complaintBody.innerHTML = "";

  const filtered = complaints.filter((c) => {
    const matchStatus =
      statusValue === "all" || c.status.toLowerCase() === statusValue;
    const matchCategory =
      categoryValue === "all" || c.category === categoryValue;
    return matchStatus && matchCategory;
  });

  filtered.forEach((c, index) => {
    let row = document.createElement("tr");

    const statusCell = isAdmin
      ? `<select data-index="${index}" class="statusSelect">
          <option value="Pending" ${
            c.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option value="Resolved" ${
            c.status === "Resolved" ? "selected" : ""
          }>Resolved</option>
          <option value="Declined" ${
            c.status === "Declined" ? "selected" : ""
          }>Declined</option>
        </select>`
      : c.status;

    row.innerHTML = `
      <td>${c.date}</td>
      <td>${c.category}</td>
      <td>${c.email}</td>
      <td>${c.description}</td>
      <td>${statusCell}</td>
      <td><button class="delete-btn" data-index="${index}" title="Delete Complaint">❌</button></td>
    `;

    complaintBody.appendChild(row);
  });

  // Summary update
  let resolvedCount = complaints.filter((c) => c.status === "Resolved").length;
  let pendingCount = complaints.filter((c) => c.status === "Pending").length;
  let declinedCount = complaints.filter((c) => c.status === "Declined").length;

  summary.textContent = `Resolved: ${resolvedCount} | Pending: ${pendingCount} | Declined: ${declinedCount}`;

  // Bind status dropdown (if admin)
  if (isAdmin) {
    document.querySelectorAll(".statusSelect").forEach((select) => {
      select.addEventListener("change", function () {
        const index = this.getAttribute("data-index");
        const allComplaints = getComplaints();
        const statusValue = statusFilter.value.toLowerCase();
        const categoryValue = categoryFilter.value;

        const filteredAgain = allComplaints.filter((c) => {
          const matchStatus =
            statusValue === "all" || c.status.toLowerCase() === statusValue;
          const matchCategory =
            categoryValue === "all" || c.category === categoryValue;
          return matchStatus && matchCategory;
        });

        const updatedComplaint = filteredAgain[index];
        const realIndex = allComplaints.findIndex(
          (c) =>
            c.email === updatedComplaint.email &&
            c.date === updatedComplaint.date &&
            c.description === updatedComplaint.description
        );

        allComplaints[realIndex].status = this.value;
        saveComplaints(allComplaints);
        renderTable();
      });
    });
  }

  // Bind delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const allComplaints = getComplaints();
      const statusValue = statusFilter.value.toLowerCase();
      const categoryValue = categoryFilter.value;

      const filteredAgain = allComplaints.filter((c) => {
        const matchStatus =
          statusValue === "all" || c.status.toLowerCase() === statusValue;
        const matchCategory =
          categoryValue === "all" || c.category === categoryValue;
        return matchStatus && matchCategory;
      });

      const toDelete = filteredAgain[index];
      const realIndex = allComplaints.findIndex(
        (c) =>
          c.email === toDelete.email &&
          c.date === toDelete.date &&
          c.description === toDelete.description
      );

      if (realIndex !== -1) {
        allComplaints.splice(realIndex, 1);
        saveComplaints(allComplaints);
        renderTable();
      }
    });
  });
}

// Filter event listeners
statusFilter.addEventListener("change", renderTable);
categoryFilter.addEventListener("change", renderTable);

// Initial table render
renderTable();

async function loadComplaints() {
  try {
    const res = await fetch(
      "https://samadhaan-portal-backend-4.onrender.com/api/complaints"
    );
    const complaints = await res.json();
    console.log(complaints);

    const tableBody = document.querySelector("#complaintsTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    complaints.forEach((comp) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${comp.id}</td>
        <td>${comp.name}</td>
        <td>${comp.email}</td>
        <td>${comp.complaint}</td>
        <td>${new Date(comp.date).toLocaleString()}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
  }
}

// Load complaints on page load
window.onload = loadComplaints;
