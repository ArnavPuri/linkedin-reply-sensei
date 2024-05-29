document.addEventListener("DOMContentLoaded", () => {
  const onboardingDiv = document.getElementById("onboarding");
  const mainDiv = document.getElementById("main");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("saveButton");
  const getIdeasButton = document.getElementById("getIdeasButton");
  const settingsButton = document.querySelector("#settings");
  const replyPromptInput = document.getElementById("replyPrompt");
  const ideaPromptInput = document.getElementById("ideaPrompt");
  const updateReplyPromptButton = document.getElementById(
    "updateReplyPromptButton"
  );
  const updateIdeasPromptButton = document.getElementById(
    "updateIdeasPromptButton"
  );

  let showOnboardingPage = () => {
    onboardingDiv.classList.remove("hidden");
    mainDiv.classList.add("hidden");
  };

  let showMainPage = () => {
    onboardingDiv.classList.add("hidden");
    mainDiv.classList.remove("hidden");
  };

  let updateUI = (showOnboarding) =>
    showOnboarding ? showOnboardingPage() : showMainPage();

  let replySuggestionPrompt =
    "Reply to this LinkedIn post as myself. I am a sofware developer who has friendly tone, and use less words to generally respond. Can use sarcasm and wittiness if appropriate.";
  let ideasGeneratorPrompt = `Generate some ideas for LinkedIn posts that I can post as a Software Developer, IIT graduate and Educator. You are an expert LinkedIn content creator and give creative and engagement ideas for LinkedIn growth`;
  // Check if the API key is already in chrome.storage.local
  replyPromptInput.value = replySuggestionPrompt;
  ideaPromptInput.value = ideasGeneratorPrompt;

  chrome.storage.local.get(
    ["openai_api_key", "replySuggestionPrompt", "ideasGeneratorPrompt"],
    (result) => {
      updateUI(result.openai_api_key == undefined);
      if (result.replySuggestionPrompt != undefined) {
        replySuggestionPrompt = result.replySuggestionPrompt;
        replyPromptInput.value = replySuggestionPrompt;
      }
      if (result.ideasGeneratorPrompt != undefined) {
        ideasGeneratorPrompt = ideasGeneratorPrompt;
        ideaPromptInput.value = ideasGeneratorPrompt;
      }
    }
  );
  // Save the API key to localStorage
  saveButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    if (apiKey) {
      chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        alert("API Key saved!");
        updateUI(false);
      });
    } else {
      alert("Please enter an API key.");
    }
  });
  updateReplyPromptButton.addEventListener("click", () => {
    const replyPrompt = replyPromptInput.value;
    if (replyPrompt) {
      chrome.storage.local.set({ replySuggestionPrompt: replyPrompt }, () => {
        replySuggestionPrompt = replyPrompt;
        alert("Reply prompt updated!");
        updateUI(false);
      });
    }
  });

  updateIdeasPromptButton.addEventListener("click", () => {
    const ideaPrompt = ideaPromptInput.value;
    if (ideaPrompt) {
      chrome.storage.local.set({ ideasGeneratorPrompt: ideaPrompt }, () => {
        ideasGeneratorPrompt = ideaPrompt;
        alert("Ideas generator prompt updated!");
        updateUI(false);
      });
    }
  });

  settingsButton.addEventListener("click", () => {
    updateUI(!mainDiv.classList.contains("hidden"));
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
  ideas.forEach((idea) => {
    let ideaListItem = document.createElement("li");
    ideaListItem.innerText = idea;
    ideaListItem.classList.add("idea");
    ideasContainerEl.appendChild(ideaListItem);
  });
}
