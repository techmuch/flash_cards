import React, { useState } from 'react';
// Ensure useState is imported

function FileDropZone({ onFileUpload }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setError(null); // Clear previous errors

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Can potentially handle multiple files here, but let's process one at a time for simplicity
      const file = files[0];

      if (file.type !== 'application/json') {
        setError('Please drop a JSON file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
           // Basic validation for the new structure
          if (Array.isArray(data) && data.every(item =>
                item.id !== undefined &&
                typeof item.front === 'object' && item.front !== null &&
                typeof item.back === 'object' && item.back !== null
              )) {
            // --- Pass the file name and the parsed data ---
            onFileUpload(file.name, data);
          } else {
            setError('Invalid JSON format. Expected an array of objects, each with "id", "front" (object), and "back" (object).');
          }
        } catch (err) {
          setError('Error parsing JSON file.');
          console.error('JSON parsing error:', err);
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
      };
      reader.readAsText(file);
    }
  };

  // Basic inline styles for demonstration
  const dropZoneStyle = {
    border: dragging ? '2px dashed #007bff' : '2px dashed #ccc',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: dragging ? '#f0f0f0' : '#fff',
    marginTop: '20px',
    marginBottom: '20px', /* Added margin bottom */
    borderRadius: '8px',
  };

  return (
    <div
      style={dropZoneStyle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p>Drag and drop your JSON flashcard file(s) here</p>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default FileDropZone;