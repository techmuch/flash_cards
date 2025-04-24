import React from 'react';
import katex from 'katex'; // Import KaTeX library

// Helper function to parse string for LaTeX and render segments
function renderLaTeXString(text) {
    if (typeof text !== 'string') {
        return text; // Return non-string values directly
    }

    const segments = [];
    let lastIndex = 0;

    // Regex to find $$...$$ or $...$ while respecting \$
    // Note: This is a simplified regex. More complex cases (like \$ outside math)
    // might require more robust parsing.
    const regex = /(\$\$[^$]*?\$\$|\$([^$]*?)\$)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const mathDelimiter = match[1]; // The full match like $$...$$ or $...$
        const mathContent = match[2]; // Content inside $...$ (undefined for $$)
        const matchIndex = match.index;

        // Add text segment before the math
        if (matchIndex > lastIndex) {
            segments.push(text.substring(lastIndex, matchIndex));
        }

        // Add math segment
        const isBlock = mathDelimiter.startsWith('$$');
        const mathString = isBlock ? mathDelimiter.substring(2, mathDelimiter.length - 2) : mathContent; // Extract content

        try {
            // Render math using KaTeX
            const renderedMath = katex.renderToString(mathString, {
                displayMode: isBlock, // true for $$, false for $
                throwOnError: false // Don't throw errors, just render the formula source on error
            });
            // Use dangerouslySetInnerHTML to inject the rendered HTML
            segments.push(
                <span // Use span for both inline and block, KaTeX handles block rendering with displayMode
                    key={matchIndex} // Unique key for React list
                    dangerouslySetInnerHTML={{ __html: renderedMath }}
                     style={{ margin: isBlock ? '10px 0' : '0' }} // Add margin for block equations
                ></span>
            );
        } catch (e) {
            console.error("KaTeX rendering error for:", mathDelimiter, e);
            // Fallback: render the original math string as text if KaTeX fails
            segments.push(`[Error rendering math: ${mathDelimiter}]`);
        }

        lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last math segment
    if (lastIndex < text.length) {
        segments.push(text.substring(lastIndex));
    }

    return segments;
}


// --- ContentDisplay Component ---
function ContentDisplay({ content }) {
  if (!content || typeof content !== 'object') {
    return null;
  }

  const keys = Object.keys(content);

  if (keys.length === 0) {
      return <p>No content available.</p>;
  }

  return (
    <div>
      {keys.map((key) => {
        const value = content[key];
        let valueElement = null;

        if (Array.isArray(value)) {
             if (value.length > 0) {
                valueElement = (
                   <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                     {value.map((item, idx) => (
                       <li key={idx}>{renderLaTeXString(item)}</li> // Render each list item
                     ))}
                   </ul>
                 );
             } else {
                 valueElement = <p style={{fontStyle: 'italic', color: '#777'}}>Empty list</p>; // Indicate empty arrays
             }

        } else if (value != null) {
            // If value is a non-null primitive (string, number, boolean), render it
             valueElement = (
                 <span style={{ marginLeft: '5px' }}>
                     {renderLaTeXString(String(value))} {/* Render the string value */}
                 </span>
             );
        } else {
             // Value is null or undefined
             valueElement = <p style={{fontStyle: 'italic', color: '#777'}}>No value</p>; // Indicate missing values
        }


        // Render the key (header) and the value content
        return (
            <div key={key} style={{ marginBottom: '10px' }}>
                 {/* --- APPLY renderLaTeXString TO THE KEY HERE --- */}
                <strong style={{ fontWeight: 'bold' }}>{renderLaTeXString(key)}:</strong>
                {valueElement}
            </div>
        );
      })}
    </div>
  );
}

export default ContentDisplay;