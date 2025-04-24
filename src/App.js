import React, { useState, useEffect, useMemo } from 'react';
// --- Import all view components ---
import ManageView from './components/ManageView';
import QuizView from './components/QuizView';
import DocsView from './components/DocsView';

import './App.css';

// --- Function to prepare quiz items based on selected files and mode ---
// Now takes the entire data object {filename: itemsArray} and selectedFiles array
const prepareQuizItems = (allData, selectedFiles) => { // Removed 'mode' from args, QuizArea handles random logic
  if (!allData || !selectedFiles || selectedFiles.length === 0) return [];

  // Flatten items from selected files and add sourceFile property
  let itemsToQuiz = [];
  selectedFiles.forEach(filename => {
      const fileItems = allData[filename];
      if (fileItems && Array.isArray(fileItems)) {
          fileItems.forEach(item => {
              // Basic validation for the raw item structure
              if (item.id === undefined || typeof item.front !== 'object' || item.front === null || typeof item.back !== 'object' || item.back === null) {
                 console.warn(`Skipping invalid item format from file "${filename}" during preparation. Item:`, item);
                 return; // Skip this item
              }
               // Add source file info and return the item in a standard format for QuizArea
              itemsToQuiz.push({
                  id: item.id, // Use original ID
                  sourceFile: filename, // Add source file property
                  front: item.front, // Keep original front
                  back: item.back // Keep original back
              });
          });
      }
  });

   if (itemsToQuiz.length === 0) return []; // Return empty if no valid items were found

  // Shuffle the flattened list
  const shuffledItems = [...itemsToQuiz];
  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]]; // Swap
  }

  // --- Return the array of {id, sourceFile, front, back} objects ---
  // QuizArea will handle the front/back logic per card if mode is 'random'
  return shuffledItems;
};


function App() {
  const [quizData, setQuizData] = useState(null); // { filename: itemsArray }
  const [selectedFiles, setSelectedFiles] = useState([]); // string[]
  const [quizMode, setQuizMode] = useState('front-to-back'); // string
  const [isLoading, setIsLoading] = useState(true);
  // --- State to manage current view ---
  const [currentView, setCurrentView] = useState('manage'); // 'manage', 'quiz', 'docs'


  // Keys for localStorage
  const localStorageDataKey = 'flashcardQuizData';
  const localStorageModeKey = 'flashcardQuizMode';

  // Load data and mode from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem(localStorageDataKey);
    const savedMode = localStorage.getItem(localStorageModeKey);

    let loadedData = null;
    let loadedMode = 'front-to-back';
    let loadedFiles = [];

    if (savedData) {
      try {
        loadedData = JSON.parse(savedData);
        if (loadedData !== null && typeof loadedData === 'object' && !Array.isArray(loadedData)) {
            const isValidData = Object.entries(loadedData).every(([filename, items]) =>
                 Array.isArray(items) && items.every(item =>
                    item.id !== undefined &&
                    typeof item.front === 'object' && item.front !== null &&
                    typeof item.back === 'object' && item.back !== null
                 )
            );

            if (isValidData) {
                 console.log("Data loaded from localStorage. Files:", Object.keys(loadedData).length);
                 loadedFiles = Object.keys(loadedData); // Get list of filenames
            } else {
                console.error("Invalid data structure in localStorage. Clearing.");
                loadedData = null;
                localStorage.removeItem(localStorageDataKey);
            }

        } else {
            console.error("Unexpected data type in localStorage. Expected object. Clearing.");
            loadedData = null;
            localStorage.removeItem(localStorageDataKey);
        }

      } catch (e) {
        console.error("Failed to parse data from localStorage:", e);
        loadedData = null;
        localStorage.removeItem(localStorageDataKey);
      }
    }

    if (savedMode && ['front-to-back', 'back-to-front', 'random'].includes(savedMode)) {
        loadedMode = savedMode;
         console.log("Mode loaded from localStorage:", loadedMode);
    } else if (savedMode) {
         console.warn("Invalid mode in localStorage:", savedMode, ". Using default.");
    }

    setQuizData(loadedData);
    setSelectedFiles(loadedFiles); // Select all loaded files by default
    setQuizMode(loadedMode);
    // --- Start in 'manage' view ---
    setCurrentView('manage');
    setIsLoading(false);

     console.log("Initial Load Complete. Data Loaded:", !!loadedData, "Files Loaded:", loadedFiles.length);

  }, []); // Empty dependency array = runs once on mount

  // --- useMemo to prepare quiz items FROM SELECTED FILES ---
  // Depends on the raw quizData and selectedFiles list
  const preparedQuizItems = useMemo(() => {
      console.log("Memoizing: Preparing quiz items from selected files:", selectedFiles.length);
      // Pass allData and selectedFiles to the preparation function
      const items = prepareQuizItems(quizData, selectedFiles); // Note: mode is NOT passed here anymore
      console.log("Memoizing: Prepared items count:", items.length);
      return items;
  }, [quizData, selectedFiles]); // --- DEPENDENCIES ---


  const handleFileUpload = (filename, data) => {
     if (!Array.isArray(data) || !data.every(item => item.id !== undefined && typeof item.front === 'object' && item.front !== null && typeof item.back === 'object' && item.back !== null)) {
          alert(`Invalid data structure received from file "${filename}". Please check your JSON file.`);
           console.error(`File "${filename}" has invalid data structure.`);
          return;
     }

    const updatedQuizData = { ...quizData, [filename]: data };
    setQuizData(updatedQuizData);

    setSelectedFiles(prevSelected => {
        const filesSet = new Set(prevSelected);
        filesSet.add(filename); // Add the newly loaded file
        return Array.from(filesSet);
    });

    try {
        localStorage.setItem(localStorageDataKey, JSON.stringify(updatedQuizData));
        localStorage.setItem(localStorageModeKey, quizMode); // Save mode when new data is added
         console.log(`File "${filename}" uploaded and data saved. Total files:`, Object.keys(updatedQuizData).length);
    } catch (e) {
        console.error("Failed to save data to localStorage:", e);
        alert("Could not save data to browser storage. Please check your browser settings or clear some space.");
    }
     // Stay on manage view
     setCurrentView('manage');
  };

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    console.log("Changing quiz mode to:", newMode);
    setQuizMode(newMode);
    try {
         if (quizData) {
             localStorage.setItem(localStorageModeKey, newMode);
              console.log("Mode saved to localStorage.");
         }
    } catch (e) {
        console.error("Failed to save mode to localStorage:", e);
        alert("Could not save mode to browser storage.");
    }
  };

  const handleFileSelectChange = (filename, isSelected) => {
      setSelectedFiles(prevSelected => {
          if (isSelected) {
              return Array.from(new Set([...prevSelected, filename]));
          } else {
              return prevSelected.filter(file => file !== filename);
          }
      });
  };

   const handleRemoveAll = () => {
       if (window.confirm("Are you sure you want to remove ALL flashcard data from your browser?")) {
            localStorage.removeItem(localStorageDataKey);
            localStorage.removeItem(localStorageModeKey);
            setQuizData(null);
            setSelectedFiles([]);
            setQuizMode('front-to-back');
            setCurrentView('manage'); // Ensure we are on the manage view after removing
            console.log("All data removed from localStorage.");
       }
   };

   // --- View Switching Handlers ---
   const startQuiz = () => {
       if (preparedQuizItems && preparedQuizItems.length > 0) {
           setCurrentView('quiz');
            console.log("Starting quiz...");
       } else {
           alert("Please select files that contain valid flashcard items to start the quiz.");
       }
   };

   const quitQuiz = () => {
       if (window.confirm("Are you sure you want to quit the current quiz?")) {
           setCurrentView('manage');
           console.log("Quiz quit.");
       }
   };

   const goToDocs = () => {
       setCurrentView('docs');
        console.log("Going to docs view.");
   };

   const goToManage = () => {
       setCurrentView('manage');
       console.log("Going to manage view.");
   };


  if (isLoading) {
    return <div className="App"><p>Loading...</p></div>;
  }

  // Determine state for conditional rendering and button enabling
  const hasLoadedData = quizData && Object.keys(quizData).length > 0;
  const hasSelectedFiles = selectedFiles && selectedFiles.length > 0;
  const hasPreparedItems = preparedQuizItems && preparedQuizItems.length > 0;


  return (
    <div className="App">
      {/* --- Application Title --- */}
      <h1>Flashcard Quiz</h1>

      {/* --- Navigation Buttons (Visible in Manage and Docs views) --- */}
      {currentView !== 'quiz' && (
          <div style={{ marginBottom: '20px' }}>
              {currentView !== 'manage' && (
                  <button onClick={goToManage} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>
                      Manage Collections
                  </button>
              )}
               {currentView !== 'docs' && (
                  <button onClick={goToDocs} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                      Documentation
                  </button>
               )}
          </div>
      )}

      {/* --- Render Current View --- */}
      {currentView === 'manage' && (
          <ManageView
              quizData={quizData}
              selectedFiles={selectedFiles}
              quizMode={quizMode}
              handleFileUpload={handleFileUpload}
              handleRemoveAll={handleRemoveAll}
              handleFileSelectChange={handleFileSelectChange}
              handleModeChange={handleModeChange}
              onStartQuiz={startQuiz} // Pass the startQuiz handler
          />
      )}

      {currentView === 'quiz' && (
          <QuizView
              preparedQuizItems={preparedQuizItems} // Pass the list of items for the quiz
              quizMode={quizMode} // Pass the selected quiz mode
              onQuitQuiz={quitQuiz} // Pass the quitQuiz handler
          />
      )}

      {currentView === 'docs' && (
          <DocsView />
      )}

      {/* --- Message if app is ready but no data/files yet --- */}
      {!isLoading && !hasLoadedData && currentView === 'manage' && (
          <p>Drag and drop a JSON file above to begin.</p>
      )}

    </div>
  );
}

export default App;