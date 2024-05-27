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
  document.querySelectorAll('div[role="textbox"][contenteditable="true"]').forEach((inputField) => {
    let ancestor = findAncestor(inputField, "editor-container");
    let existingInputField = getNestedChild(ancestor, "suggest-reply-button");
    if (existingInputField == null) {
      let button = document.createElement('button');
      button.innerText = '🪄 Reply';
      button.classList.add('suggest-reply-button');
      button.style.backgroundColor = '#0966c2';
      button.style.color = 'white';
      button.style.borderRadius = '12px';
      button.style.padding = '8px 16px';
      button.style.margin = '12px 0px';
      button.onclick = function() {
        let ancestor = findAncestor(inputField, "feed-shared-update-v2");
        let postTextElement = getNestedChild(ancestor, "update-components-text");
        let postText = postTextElement ? postTextElement.innerText : '';
        chrome.runtime.sendMessage(
          { action: "getReplySuggestion", postText: postText },
          function (response) {
            if (response && response.reply) {
              inputField.innerText = response.reply.trim();
            }
          }
        );
      };
      inputField.parentNode.insertBefore(button, inputField.nextSibling);
    }
  });
}

// Run the function to insert buttons
// insertReplyButtons();

// Monitor the DOM for changes and insert buttons into newly added input fields
const observer = new MutationObserver(insertReplyButtons);
observer.observe(document.body, { childList: true, subtree: true });
