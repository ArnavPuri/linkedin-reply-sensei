import { CONFIG } from "./config.js";
const storageCache = { openai_api_key: undefined };
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = chrome.storage.sync.get().then((items) => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});

function getOpenAIRequestJSON(postText, systemPrompt) {
  return {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: systemPrompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: postText,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Got message " + request.action);
  if (request.action === "getReplySuggestion") {
    chrome.storage.local.get(["openai_api_key"], (result) => {
      const apiKey = result.openai_api_key;
      if (!apiKey) {
        sendResponse({ reply: "API key not set." });
      } else {
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(getOpenAIRequestJSON(request.postText, CONFIG.SYSTEM_PROMPT)),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Here2!")
            if (data.error) {
              console.log("ERROR2!", data.error)
              sendResponse({ reply: "Something went wrong: " + data.error.message });
            } else {
              sendResponse({ reply: data.choices[0].message.content });
            }
          })
          .catch((error) => sendResponse({ customError: "API Error: " + error }));
          // return true;  
      }
      // return true;  
    });
    return true;  
  } else if (request.action === "getPostIdeas") {
    chrome.storage.local.get(["openai_api_key"], (result) => {
      const apiKey = result.openai_api_key;
      if (!apiKey) {
        sendResponse({ error: "API key not set." });
      } 
      else {
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(getOpenAIRequestJSON("Generate some ideas for LinkedIn posts that I can post as a Software Developer, IIT graduate and Educator", "You are an expert LinkedIn content creator and give creative and engagement ideas for LinkedIn growth")),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Here!")
            if (data.error) {
              console.log("ERROR!", data.error)
              sendResponse({ customError: "API Error: " + data.error.message });
            } else {
              sendResponse({ ideas: data.choices[0].message.content });
            }
          })
          .catch((error) => sendResponse({ customError: "API Error: " + error }));
      } 
    });
    return true; // Will respond asynchronously.
  }
});