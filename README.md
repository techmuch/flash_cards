# Flexible Flashcard Quiz (Client-Side)

## Project Description

This is a simple, client-side web application built with React that allows users to study flashcards loaded from custom JSON files. The application runs entirely in the browser, using `localStorage` to persist the flashcard data between sessions. It supports a flexible JSON format for flashcards, making it suitable for studying various subjects like vocabulary, science concepts, history facts, quotes, scriptures, and more. Users can load data by dragging and dropping JSON files into the application and choose from different quiz modes.

## Features

* **Client-Side Only:** Runs completely in the user's browser. No dedicated backend server required beyond serving static files.
* **JSON Data Loading:** Load flashcard data from local JSON files via drag and drop.
* **Local Data Persistence:** Loaded flashcard data is automatically saved to the browser's `localStorage` for continued use between visits.
* **Flexible Flashcard Structure:** Supports a generalized JSON format with `front` and `back` objects, allowing multiple labeled sections on each side (e.g., Term, Definition, Examples, Question, Answer).
* **Multiple Quiz Modes:**
    * Quiz from Front to Back
    * Quiz from Back to Front
    * Quiz by randomly selecting a side (Front or Back) for the prompt on each card.
* **Static Build:** Compiles into static HTML, CSS, and JavaScript files for easy deployment.
* **Basic Quiz Interface:** Displays the prompt side, allows revealing the answer, and navigating to the next card.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm (or Yarn) installed. You can download Node.js from [nodejs.org](https://nodejs.org/), which includes npm.
* A web browser.

### Installation

1.  **Clone the repository** (or download the source code as a zip file):
    ```bash
    git clone <repository-url>
    ```
    Navigate into the project directory:
    ```bash
    cd <your-project-folder-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start` (or `yarn start`)

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console. This is useful for development.

### `npm run build` (or `yarn build`)

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed! The contents of the `build` folder are static files that can be served by any web server (e.g., Nginx, Apache, or static hosting services like GitHub Pages, Netlify, Vercel).

## Usage

1.  **Start the Application:** Run `npm start` (for development) or deploy the contents of the `build` folder to a web server.
2.  **Load Flashcard Data:**
    * When the application starts, if no data is found in your browser's local storage, you will see a drop zone.
    * Prepare your flashcard data in a JSON file following the structure described in the [JSON File Format](#json-file-format) section below.
    * Drag your JSON file and drop it onto the designated area in the application.
    * The application will parse the file, load the data, save it to your browser's `localStorage`, and start the quiz.
    * *Note:* Currently, dropping a new file will replace the existing data in `localStorage`.
3.  **Select Quiz Mode:** Use the "Quiz Mode" dropdown menu at the top of the page to choose how you want to be quizzed (Front to Back, Back to Front, or Random Side). The quiz items will be re-shuffled based on the new mode.
4.  **Take the Quiz:**
    * The application will display the "Prompt" side of the current flashcard.
    * Click anywhere on the flashcard area to reveal the "Answer" side.
    * Click the "Next Item" button to move to the next flashcard in the shuffled list.
    * Once you have gone through all items, you will see a "Quiz Finished" message with an option to restart.
5.  **Data Persistence:** Your loaded flashcard data and the selected quiz mode are saved in your browser's `localStorage`. The next time you open the application in the same browser, your data and mode should be automatically loaded.

## JSON File Format

The application expects a JSON file containing an array of flashcard objects. Each object must have an `id`, a `front` object, and a `back` object. The `front` and `back` objects can contain any number of key-value pairs, where keys are the headers for sections and values are the content (either a single string or an array of strings).

Here is the required structure:

```json
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
      "Answer": "Year YYYY",
      "Key Figures": ["Figure 1", "Figure 2"]
    }
  },
  // ... more flashcard objects
]