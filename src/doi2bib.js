/**
 * DOI to BibTeX Converter
 * Fetches BibTeX citation from a DOI
 */

/**
 * Extracts clean DOI from various input formats
 * @param {string} input - DOI with or without URL prefix
 * @returns {string} Clean DOI
 */
function extractDOI(input) {
  if (!input) {
    throw new Error('No DOI provided');
  }
  
  const doiStr = String(input).trim();
  return doiStr
    .replace(/https?:\/\/doi\.org\//gi, '')
    .trim();
}

/**
 * Fetches BibTeX for a given DOI (Node.js version)
 * @param {string} doi - The DOI to fetch
 * @returns {Promise<string>} BibTeX citation
 */
async function doi2bibNode(doi) {
  const cleanDOI = extractDOI(doi);
  const url = `https://doi.org/${cleanDOI}`;
  
  // Use require instead of dynamic import for Jest compatibility
  const fetch = require('node-fetch');
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/x-bibtex; charset=utf-8'
    },
    redirect: 'follow'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Could not fetch BibTeX for DOI: ${cleanDOI}`);
  }
  
  return await response.text();
}

/**
 * Fetches BibTeX for a given DOI (AppleScript version for Shortcuts)
 * @param {string} doi - The DOI to fetch
 * @returns {string} BibTeX citation
 */
function doi2bibAppleScript(doi) {
  const cleanDOI = extractDOI(doi);
  const url = `https://doi.org/${cleanDOI}`;
  
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;
  
  const curlCmd = `curl -L "${url}" -H "Accept: application/x-bibtex"`;
  const result = app.doShellScript(curlCmd);
  
  return result;
}

/**
 * Main entry point for Shortcuts
 * @param {string} input - DOI input
 * @returns {string} BibTeX citation or error message
 */
function run(input) {
  var doi = '';
  
  try {
    // Handle different input types from Shortcuts
    var doiInput;
    
    if (typeof input === 'string') {
      doiInput = input;
    } else if (Array.isArray(input) && input.length > 0) {
      doiInput = String(input[0]);
    } else if (input) {
      doiInput = String(input);
    } else {
      return 'Error: No input provided';
    }
    
    doi = extractDOI(doiInput);
    return doi2bibAppleScript(doi);
  } catch (error) {
    return 'Error: ' + error.message + '\nDOI attempted: ' + doi;
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractDOI,
    doi2bib: doi2bibNode,
    run
  };
}