/**
 * BibTeX Formatter
 * Formats BibTeX entries with proper indentation and modified citation keys
 */

/**
 * Formats a BibTeX entry with proper structure and modified citation key
 * @param {string} bibtex - Raw BibTeX string
 * @returns {string} Formatted BibTeX
 */
function formatBibTeX(bibtex) {
  if (!bibtex || typeof bibtex !== 'string') {
    throw new Error('Invalid BibTeX input');
  }
  
  // Remove leading spaces before @
  let cleaned = bibtex.trim().replace(/^\s+@/, '@');
  
  // Extract the entry type and citation key
  const match = cleaned.match(/@(\w+)\{([^,]+),/);
  if (!match) {
    throw new Error('Could not parse BibTeX entry');
  }
  
  const entryType = match[1];
  const oldKey = match[2];
  
  // Extract the title to get first 7 characters
  const titleMatch = cleaned.match(/title\s*=\s*\{([^}]+)\}/i);
  let titlePrefix = '';
  
  if (titleMatch) {
    const title = titleMatch[1];
    // Get first 7 characters from title, remove special characters and spaces
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '');
    titlePrefix = cleanTitle.substring(0, 7);
  }
  
  // Create new citation key
  const newKey = titlePrefix ? `${oldKey}_${titlePrefix}` : oldKey;
  
  // Split the content to get individual fields
  const content = cleaned.substring(
    cleaned.indexOf('{') + 1,
    cleaned.lastIndexOf('}')
  );
  
  // Remove the old key from content
  const fieldsContent = content.substring(content.indexOf(',') + 1).trim();
  
  // Split by commas but preserve commas inside braces
  const fields = [];
  let currentField = '';
  let braceLevel = 0;
  
  for (let i = 0; i < fieldsContent.length; i++) {
    const char = fieldsContent[i];
    
    if (char === '{') {
      braceLevel++;
    } else if (char === '}') {
      braceLevel--;
    } else if (char === ',' && braceLevel === 0) {
      if (currentField.trim()) {
        fields.push(currentField.trim());
      }
      currentField = '';
      continue;
    }
    
    currentField += char;
  }
  
  // Add last field
  if (currentField.trim()) {
    fields.push(currentField.trim());
  }
  
  // Build formatted BibTeX
  let formatted = `@${entryType}{${newKey},\n`;
  
  for (let i = 0; i < fields.length; i++) {
    formatted += `  ${fields[i]}`;
    if (i < fields.length - 1) {
      formatted += ',';
    }
    formatted += '\n';
  }
  
  formatted += '}';
  
  return formatted;
}

/**
 * Main entry point for Shortcuts
 * @param {string} input - Raw BibTeX string
 * @returns {string} Formatted BibTeX or error message
 */
function run(input) {
  try {
    const bibtex = String(input).trim();
    return formatBibTeX(bibtex);
  } catch (error) {
    return 'Error: ' + error.toString();
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatBibTeX,
    run
  };
}