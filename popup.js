document.getElementById("suggestReply").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        console.log("Suggest Reply clicked!");
        let replyButton = document.querySelector(".reply-button");
        if (replyButton) {
          replyButton.click();
        }
      },
    });
  });
});
