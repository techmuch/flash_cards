import React from 'react';
import FileDropZone from './FileDropZone';

function ManageView({
    quizData, // { filename: itemsArray }
    selectedFiles, // string[]
    quizMode, // string
    handleFileUpload, // func(filename, data)
    handleRemoveAll, // func()
    handleFileSelectChange, // func(filename, isSelected)
    handleModeChange, // func(event)
    onStartQuiz // func()
}) {
    const hasLoadedData = quizData && Object.keys(quizData).length > 0;
    const hasSelectedFiles = selectedFiles && selectedFiles.length > 0;
    const totalItemsSelected = selectedFiles.reduce((sum, filename) => {
        const items = quizData[filename];
        return sum + (items ? items.length : 0);
    }, 0);


    return (
        <div className="manage-view">
            <h2>Manage Flashcard Collections</h2>

            <FileDropZone onFileUpload={handleFileUpload} />
            {hasLoadedData && <p>Or drag and drop more JSON files to add to your collection.</p>}

            {/* Loaded Files List and Controls (Visible if data is loaded) */}
            {hasLoadedData && (
                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <h3>Your Collections ({Object.keys(quizData).length} file{Object.keys(quizData).length !== 1 ? 's' : ''} loaded)</h3>

                    <button onClick={handleRemoveAll} style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Remove All Flashcard Data
                    </button>

                    {/* Mode Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="quizMode">Quiz Mode:</label>
                        <select id="quizMode" value={quizMode} onChange={handleModeChange} style={{ marginLeft: '10px', padding: '5px' }}>
                            <option value="front-to-back">Front to Back</option>
                            <option value="back-to-front">Back to Front</option>
                            <option value="random">Random Side per Card</option>
                        </select>
                    </div>

                    {/* File Selection Table */}
                    <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}> {/* Increased max-width slightly */}
                        <p>Select files to include in the quiz:</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Include</th>
                                    <th style={{ borderBottom: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>File Name</th>
                                    <th style={{ borderBottom: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(quizData).map(([filename, items]) => (
                                    <tr key={filename}>
                                        <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.includes(filename)}
                                                onChange={(e) => handleFileSelectChange(filename, e.target.checked)}
                                            />
                                        </td>
                                        <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{filename}</td>
                                        <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{items.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Start Quiz Button */}
                        <button
                            onClick={onStartQuiz}
                            disabled={!hasSelectedFiles || totalItemsSelected === 0}
                            style={{ padding: '10px 20px', fontSize: '1.1em', cursor: 'pointer' }}
                        >
                            Start Quiz ({totalItemsSelected} items)
                        </button>
                         {!hasSelectedFiles && <p style={{color: '#888', fontSize: '0.9em', marginTop: '5px'}}>Select at least one file to start the quiz.</p>}


                    </div>
                </div>
            )}

             {!hasLoadedData && (
                <p>Drop a JSON file above to load your first flashcard collection.</p>
             )}
        </div>
    );
}

export default ManageView;