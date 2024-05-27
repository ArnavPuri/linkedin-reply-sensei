import { CONFIG } from './config.js';

function getOpenAIRequestJSON(postText) {
    return {
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "Reply to this LinkedIn post as myself. I am a sofware developer who has friendly tone, and use less words to generally respond. Can use sarcasm and wittiness if appropriate"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": postText
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
  }
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getReplySuggestion") {
        console.log(request.postText);
        console.log(request);
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify(getOpenAIRequestJSON(request.postText))
        })
            .then(response => response.json())
            .then(data => sendResponse({ reply: data.choices[0].message.content }))
            .catch(error => console.error('Error:', error));
        return true;  // Will respond asynchronously.
    }
});
