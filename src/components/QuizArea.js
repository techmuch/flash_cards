import React, { useState, useEffect } from 'react';
// Ensure useState and useEffect are imported
// --- Import ContentDisplay from its new file ---
import ContentDisplay from './ContentDisplay';


// Helper component to render object content dynamically (Assuming this is defined correctly in ContentDisplay.js)
// Moved ContentDisplay function to src/components/ContentDisplay.js

// --- START of the QuizArea functional component ---
function QuizArea({ quizItems, quizMode }) { // --- ENSURE PROPS ARE DESTRUCTURED HERE ---
  // --- STATE VARIABLES (Must be INSIDE the component function) ---
  const [shuffledItems, setShuffledItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentCardPromptSide, setCurrentCardPromptSide] = useState('front'); // 'front' or 'back'
  // --- END of STATE VARIABLES ---


  // --- EFFECT to shuffle items when quizItems or quizMode changes ---
  // (Must be INSIDE the component function)
  useEffect(() => {
    console.log("QuizItems prop changed or quizMode changed, shuffling...");
    if (quizItems && quizItems.length > 0) {
      const shuffledData = [...quizItems]; // Create a copy
      // Simple shuffle function (Fisher-Yates)
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]]; // Swap
      }
      // --- Update state variables ---
      setShuffledItems(shuffledData);
      setCurrentIndex(0);
      setShowAnswer(false);
      setQuizFinished(false);
       console.log("Items shuffled. New length:", shuffledData.length);
    } else {
       console.log("QuizItems prop is empty or null. Resetting quiz area state.");
       // --- Update state variables ---
       setShuffledItems([]);
       setCurrentIndex(0);
       setShowAnswer(false);
       setQuizFinished(false);
    }
     // --- Determine card-specific prompt side for the first card (index 0) ---
     // Use quizItems directly here as shuffledItems might not be updated yet in this render cycle
     determineCurrentCardPromptSide(0, quizMode, quizItems);

  }, [quizItems, quizMode]); // DEPENDENCY ARRAY INCLUDES quizItems AND quizMode


  // --- EFFECT to determine prompt side for the current card when index or mode changes ---
  // (Must be INSIDE the component function)
  useEffect(() => {
      // Only run if we have items to prevent errors on empty state
      if (shuffledItems.length > 0) {
         // --- Use state variables ---
         determineCurrentCardPromptSide(currentIndex, quizMode, shuffledItems);
          // Ensure answer is hidden when moving to a new card
          setShowAnswer(false); // --- Use state setter ---
      }
       // Ensure answer is hidden also when quizMode changes IF we are on the first card
       // This handles the case where mode changes while the user is on the first card with answer showing
       if (shuffledItems.length > 0 && currentIndex === 0) {
           setShowAnswer(false); // --- Use state setter ---
       }

  }, [currentIndex, quizMode, shuffledItems]); // Dependencies on state variables and prop


  // --- HELPER FUNCTION (Can be inside or outside, but inside can access state/props directly) ---
  // (If outside, it would need shuffledItems, currentIndex, quizMode, setCurrentCardPromptSide passed as args)
  // (Keeping it inside is simpler as it uses state setters directly)
  const determineCurrentCardPromptSide = (index, mode, items) => {
      if (!items || items.length === 0 || index < 0 || index >= items.length) {
          setCurrentCardPromptSide('front'); // --- Use state setter ---
          return;
      }
       const currentItem = items[index];

      if (mode === 'front-to-back') {
          setCurrentCardPromptSide('front'); // --- Use state setter ---
      } else if (mode === 'back-to-front') {
          setCurrentCardPromptSide('back'); // --- Use state setter ---
      } else { // mode === 'random'
          const randomSide = Math.random() < 0.5 ? 'front' : 'back';
          setCurrentCardPromptSide(randomSide); // --- Use state setter ---
           console.log(`Item ${index + 1}: Randomly selected prompt side: ${randomSide}`);
      }
  };
  // --- END of HELPER FUNCTION ---


  // --- DERIVED STATE / VARIABLES (Must be INSIDE the component function) ---
  // eslint-disable-next-line no-unused-vars -- currentItem is used in JSX conditional rendering
  const currentItem = shuffledItems[currentIndex]; // --- Use state variables ---

   // Determine which content object is the prompt and which is the answer
   const promptContent = currentCardPromptSide === 'front' ? currentItem?.front : currentItem?.back; // --- Use state variable ---
   const answerContent = currentCardPromptSide === 'front' ? currentItem?.back : currentItem?.front;   // --- Use state variable ---
   // --- END of DERIVED STATE / VARIABLES ---


  // --- EVENT HANDLERS (Must be INSIDE the component function) ---
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer); // --- Use state setter ---
  };

  const nextItem = () => {
    // setShowAnswer(false); // This is now handled by the useEffect on currentIndex change
    if (currentIndex < shuffledItems.length - 1) { // --- Use state variables ---
      setCurrentIndex(currentIndex + 1); // --- Use state setter ---
    } else {
      setQuizFinished(true); // --- Use state setter ---
    }
      // The useEffect tied to currentIndex will handle determining the next card's prompt side
  };

  const restartQuiz = () => {
      if(quizItems && quizItems.length > 0) {
        const shuffledData = [...quizItems];
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]]; // Swap
        }
        // --- Use state setters ---
        setShuffledItems(shuffledData);
        setCurrentIndex(0);
        setShowAnswer(false);
        setQuizFinished(false);
        // Determine prompt side for the first card of the restarted quiz
        determineCurrentCardPromptSide(0, quizMode, shuffledData);
      }
  }
  // --- END of EVENT HANDLERS ---


  // --- CONDITIONAL RENDERING (Must be INSIDE the component function) ---
  if (shuffledItems.length === 0 && !quizFinished) { // --- Use state variables ---
    return <p>No quiz items available with the current settings.</p>;
  }

  if (quizFinished) { // --- Use state variable ---
      return (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>Quiz Finished!</h2>
              <p>You've reviewed all {quizItems ? quizItems.length : 0} items.</p>
              <button onClick={restartQuiz} style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}>
                Restart Quiz
              </button>
          </div>
      );
  }
  // --- END of CONDITIONAL RENDERING ---


  // --- MAIN RENDER RETURN (Must be INSIDE the component function) ---
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* --- Use state variables --- */}
      <h3>Item {currentIndex + 1} of {shuffledItems.length}</h3>
      {/* Optional: Show source file */}
      {currentItem?.sourceFile && <p style={{fontSize: '0.9em', fontStyle: 'italic'}}>Source: {currentItem.sourceFile}</p>}

      <div style={{
          border: '1px solid #ccc',
          padding: '30px',
          margin: '20px auto',
          maxWidth: '500px',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: showAnswer ? 'flex-start' : 'center', // --- Use state variable ---
          alignItems: 'flex-start',
          textAlign: 'left',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',
          maxHeight: '450px'
        }}
        onClick={toggleAnswer} // --- Use event handler ---
        title="Click to toggle answer"
      >
        <h4 style={{ width: '100%', textAlign: 'center', marginBottom: '20px', textDecoration: 'underline' }}>Prompt</h4>
        {/* --- Use ContentDisplay for prompt content --- */}
        {currentItem && promptContent && <ContentDisplay content={promptContent} />} {/* Use derived variables */}
        {/* --- FIX: Clarify OR and AND with parentheses --- */}
        {(!currentItem || !promptContent) && <p>No prompt content.</p>}


        {showAnswer && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', width: '100%' }}>
            <h4 style={{ width: '100%', textAlign: 'center', marginBottom: '20px', textDecoration: 'underline' }}>Answer</h4>
             {/* --- Use ContentDisplay for answer content --- */}
            {currentItem && answerContent && <ContentDisplay content={answerContent} />} {/* Use derived variables */}
            {/* --- FIX: Clarify OR and AND with parentheses --- */}
             {(!currentItem || !answerContent) && <p>No answer content.</p>}
          </div>
        )}
      </div>

      <div style={{ marginTop: '15px' }}>
          <button
            onClick={toggleAnswer} // --- Use event handler ---
            style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer', marginRight: '10px' }}
            disabled={!currentItem || quizFinished} // --- Use state variables ---
          >
            Show Answer
          </button>
          <button
            onClick={nextItem} // --- Use event handler ---
            style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}
            disabled={!currentItem || quizFinished} // --- Use state variables ---
          >
            {currentIndex < shuffledItems.length - 1 ? 'Next Item' : 'Finish Quiz'} {/* Use state variables */}
          </button>
      </div>

    </div>
  );
  // --- END of MAIN RENDER RETURN ---
}
// --- END of the QuizArea functional component ---


// --- ENSURE Component is default exported (Must be OUTSIDE the component function) ---
export default QuizArea;
