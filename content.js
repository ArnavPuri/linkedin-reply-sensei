// document.addEventListener('click', function (event) {
//     if (event.target.matches('.reply-button')) {
//       let postText = event.target.closest('.post').querySelector('.post-content').innerText;
//       chrome.runtime.sendMessage(
//         { action: "getReplySuggestion", postText: postText },
//         function (response) {
//           if (response && response.reply) {
//             let replyField = event.target.closest('.reply-container').querySelector('.reply-input');
//             replyField.value = response.reply.trim();
//           }
//         }
//       );
//     }
//   }, false);
// Function to find the closest ancestor with a specific class
function findAncestor(element, className) {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

// Function to get the nested child within the ancestor
function getNestedChild(ancestor, nestedClass) {
  if (ancestor) {
    return ancestor.querySelector(`.${nestedClass}`);
  }
  return null;
}

// Function to create and insert the button
function insertReplyButtons() {
  document
    .querySelectorAll('div[role="textbox"][contenteditable="true"]')
    .forEach((inputField) => {
      let ancestor = findAncestor(inputField, "editor-container");
      let existingInputField = getNestedChild(ancestor, "suggest-reply-button");
      if (existingInputField == null) {
        let button = document.createElement("button");
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-webhook"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/></svg>`;
        button.classList.add("suggest-reply-button");
        button.onclick = function () {
          button.querySelector("svg").classList.add("spin");
          let ancestor = findAncestor(inputField, "feed-shared-update-v2");
          let postTextElement = getNestedChild(
            ancestor,
            "update-components-text"
          );
          let postText = postTextElement ? postTextElement.innerText : "";
          chrome.runtime.sendMessage(
            { action: "getReplySuggestion", postText: postText },
            function (response) {
              button.querySelector("svg").classList.remove("spin");
              console.log("Received response ", response);
              if (response && response.reply) {
                inputField.innerText = response.reply.trim();
              } else if (response && response.customError) {
                console.log(response.customError);
                inputField.innerText = response.customError;
                // TODO open the popup asking for API key?
              }
            }
          );
        };
        inputField.parentNode.insertBefore(button, inputField.nextSibling);
      }
    });
}
// Function to inject CSS into the page
function injectCSS() {
  const css = `
    .suggest-reply-button {
      color: #0966c2;
      font-size: 24px;
      margin-top: 12px;
    }
    .suggest-reply-button .spin {
      animation-name: spin-anim;
      animation-duration: 1500ms;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      color: #388fe9;
    }
    @keyframes spin-anim {
      from {transform:rotate(0deg);}
      to {transform:rotate(360deg);}
    }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}
// Run the function to insert buttons
injectCSS();
insertReplyButtons();

// Monitor the DOM for changes and insert buttons into newly added input fields
const observer = new MutationObserver(insertReplyButtons);
observer.observe(document.body, { childList: true, subtree: true });
