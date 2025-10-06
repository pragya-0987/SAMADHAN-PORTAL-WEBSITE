
const issueType = document.getElementById("issueType");
const issueDetails = document.getElementById("issueDetails");

issueType.addEventListener("change", function () {
  if (this.value !== "") {
    issueDetails.style.display = "block";
  } else {
    issueDetails.style.display = "none";
  }
});

function submitIssue() {
  const email = document.getElementById("userEmail").value;
  const desc = document.getElementById("issueDescription").value;

  if (email && desc) {
    document.getElementById("issueSubmittedMsg").style.display = "block";
  } else {
    alert("Please fill in your email and describe your issue.");
  }
}

document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("thanksMessage").style.display = "block";
  this.reset();
});
