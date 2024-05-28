document.addEventListener("DOMContentLoaded", () => {
  const onboardingDiv = document.getElementById("onboarding");
  const mainDiv = document.getElementById("main");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("saveButton");
  const getIdeasButton = document.getElementById("getIdeasButton");
  // Check if the API key is already in chrome.storage.local
  chrome.storage.local.get(["openai_api_key"], (result) => {
    if (result.openai_api_key) {
      onboardingDiv.classList.add("hidden");
      mainDiv.classList.remove("hidden");
    } else {
      onboardingDiv.classList.remove("hidden");
      mainDiv.classList.add("hidden");
    }
  });
  // Save the API key to localStorage
  saveButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    if (apiKey) {
      chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        alert("API Key saved!");
        onboardingDiv.classList.add("hidden");
        mainDiv.classList.remove("hidden");
      });
    } else {
      alert("Please enter an API key.");
    }
  });
  // Handle the click event for getting LinkedIn post ideas
  getIdeasButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getPostIdeas" }, (response) => {
      if (response && response.ideas) {
        renderIdeas(response.ideas.split("\n"));
      } else if (response && response.customError) {
        alert(response.customError);
      }
    });
  });
});


function renderIdeas(ideas) {
  let ideasContainerEl = document.querySelector(".ideas-container");
  ideasContainerEl.innerHTML = "";
  ideas.forEach(idea => {
    let ideaListItem = document.createElement("li");
    ideaListItem.innerText = idea;
    ideaListItem.classList.add("idea")
    ideasContainerEl.appendChild(ideaListItem)
  });
}
