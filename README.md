# LinkedIn Reply Sensei

![LinkedIn Reply Suggester Logo](images/logo128.png)

LinkedIn Reply Suggester is a Chrome extension that suggests replies for LinkedIn posts using the ChatGPT API. This extension adds a "Suggest Reply" button to each LinkedIn post's reply input field, allowing users to generate a suggested reply with a single click.

## Features

- Adds a "Suggest Reply" button to LinkedIn post reply input fields
- Uses the OpenAI API to generate suggested replies
- Easy to configure with your own OpenAI API key
- Change the system prompt to match your own style

## Installation

1. Clone this repository to your local machine.

```bash
git clone https://github.com/ArnavPuri/linkedin-reply-suggester.git
cd linkedin-reply-suggester
```

2. Load the extension in Chrome:

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" using the toggle in the top right corner
- Click "Load unpacked" and select the directory where you cloned this repository

## Usage
1. Navigate to LinkedIn and find a post.
2. Click on the Comment button. A "Suggest Reply" button will appear next to it.
3. Click the "Suggest Reply" button to generate a suggested reply using the OpenAI API.
4. The suggested reply will be automatically inserted into the reply input field. Modify it and make it your own

## TODOs
- [] Handle the quote shared posts
- [x] ~~Update system prompts~~

Enjoy using LinkedIn Reply Suggester!
