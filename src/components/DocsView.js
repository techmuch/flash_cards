import React from 'react';
// --- Import ReactMarkdown ---
import ReactMarkdown from 'react-markdown';
// --- Import the new CSS file ---
import './DocsView.css';

// --- Define the documentation content using Markdown syntax ---
const docsMarkdown = `
## Application Documentation

### How to Use

1.  **Manage Collections:** Upon opening the app, you'll be in the "Manage Collections" view. Drag and drop one or more JSON files containing flashcard data onto the drop zone. Your loaded files will appear in the table below. They are saved automatically in your browser's local storage.
2.  **Select Files:** In the table, check the boxes next to the JSON files you want to include in your next quiz session.
3.  **Choose Quiz Mode:** Select your desired quiz mode from the dropdown:
    * **Front to Back:** Prompts will always be from the 'front' side of the JSON.
    * **Back to Front:** Prompts will always be from the 'back' side of the JSON.
    * **Random Side per Card:** For each flashcard presented, the app will randomly choose either the 'front' or 'back' side to be the prompt.
4.  **Start Quiz:** Click the "Start Quiz" button. The app will switch to the "Quiz View".
5.  **Take the Quiz:**
    * The prompt side of the flashcard will be displayed.
    * Click anywhere on the card area or click the "Flip Card" button to reveal the answer side.
    * Click the "Next Item" button to move to the next card in the shuffled set.
    * The quiz finishes when you have reviewed all selected items.
6.  **Quit Quiz:** Click the "Quit Quiz" button at any time to return to the "Manage Collections" view. Your progress in the current quiz will be lost, but your loaded files remain saved.
7.  **Remove Data:** In the "Manage Collections" view, click "Remove All Flashcard Data" to clear all loaded files from your browser's local storage.
8.  **Documentation:** Click the "Documentation" button to view this page.

### JSON File Format

Flashcard data should be in a JSON file containing a single array. Each element in the array is a flashcard object with the following structure:

\`\`\`json
[
  {
    "id": "unique_identifier_1",
    "front": {
      "Header 1": "Content 1",
      "Header 2": ["List Item 1", "List Item 2"]
    },
    "back": {
      "Header A": "Content A",
      "Header B": "Content B"
    }
  },
  {
    "id": "unique_identifier_2",
    "front": {
      "Question": "What year did the Battle of 123 take place?"
    },
    "back": {
      "Answer": "Year 123",
      "Key Figures": ["Figure 1", "Figure 2"]
    }
  }
  // ... more flashcard objects
]
\`\`\`

* \`"id"\`: A unique identifier (string or number) for the flashcard within its file.
* \`"front"\`: An object containing the content for the front side of the card. Keys are treated as section headers, values are the content.
* \`"back"\`: An object containing the content for the back side of the card. Keys are treated as section headers, values are the content.
* Values within \`"front"\` and \`"back"\` can be single strings or arrays of strings. Arrays are rendered as bullet points.
* Math typesetting using LaTeX syntax (e.g., \`$E=mc^2$\` for inline, \`$$a^2 + b^2 = c^2$$\` for block) can be included within string values. Basic rendering is supported.

### Example Prompt for Generating Flashcards with an LLM (AI)

You can use a Large Language Model like Gemini, ChatGPT, etc., to help you create JSON flashcard files. Copy and paste a prompt similar to the one below into the AI chat interface, adjusting the subject and content requirements as needed.

\`\`\`
Generate 10 flashcard items about High School Biology concepts in the following JSON format.
Each item must have a unique "id".
Each item must have a "front" object and a "back" object.
Use descriptive keys within the "front" and "back" objects (e.g., "Term", "Definition", "Process", "Example", "Question", "Answer").
Values can be strings or arrays of strings.
Include appropriate biology terms and concepts.
Use proper scientific terminology.

JSON Format:
\`\`\`json
[
  {
    "id": "...",
    "front": {
      "Header": "Content",
      ...
    },
    "back": {
      "Header": "Content",
      ...
    }
  },
  ...
]
\`\`\`
Output only the JSON array. Do not include any other text before or after the JSON.
\`\`\`

This is a client-side application. Data is stored in your browser's local storage.
`;


function DocsView() {
  return (
    // Use the same container styles, Markdown handles inner structure
    <div className="docs-view" style={{ textAlign: 'left', maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
      {/* Render the markdown content */}
      <ReactMarkdown>{docsMarkdown}</ReactMarkdown>
    </div>
  );
}

export default DocsView;