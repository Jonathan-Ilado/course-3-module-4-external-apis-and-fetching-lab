// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// Select HTML elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// Create loading indicator
const loadingIndicator = document.createElement("div");
loadingIndicator.id = "loading";
loadingIndicator.classList.add("hidden");
loadingIndicator.innerHTML = '<span class="spinner"></span> Loading weather alerts...';
loadingIndicator.setAttribute("role", "status");
document.body.insertBefore(loadingIndicator, alertsDisplay);

// Display errors
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("error");
}

// Clear errors
function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
  errorMessage.classList.remove("error");
}

// Fetch weather alerts
async function fetchWeatherAlerts(state) {
  alertsDisplay.innerHTML = "";
  clearError();

  loadingIndicator.classList.remove("hidden");
  fetchButton.disabled = true;

  try {
    const response = await fetch(
      `${weatherApi}${encodeURIComponent(state)}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const data = await response.json();

    console.log(data);

    displayAlerts(data);
  } catch (errorObject) {
    console.log(errorObject.message);
    showError(errorObject.message);
  } finally {
    loadingIndicator.classList.add("hidden");
    fetchButton.disabled = false;
  }
}

// Display weather alerts
function displayAlerts(data) {
  alertsDisplay.innerHTML = "";

  const summary = document.createElement("h2");
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  if (data.features.length === 0) {
    const message = document.createElement("p");
    message.textContent = "There are currently no active weather alerts.";
    alertsDisplay.appendChild(message);
    return;
  }

  const alertList = document.createElement("ul");

  data.features.forEach((alert) => {
    const listItem = document.createElement("li");

    listItem.textContent =
      alert.properties.headline || "No headline available";

    alertList.appendChild(listItem);
  });

  alertsDisplay.appendChild(alertList);
}

// Handle button clicks
fetchButton.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();

  // Clear the input field
  stateInput.value = "";

  // Validate the state abbreviation
  if (!/^[A-Z]{2}$/.test(state)) {
    alertsDisplay.innerHTML = "";
    showError("Please enter a two-letter state abbreviation, such as CA or MN.");
    return;
  }

  fetchWeatherAlerts(state);
});