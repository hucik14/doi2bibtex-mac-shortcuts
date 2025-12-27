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
    .replace('https://doi.org/', '')
    .replace('http://doi.org/', '')
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
  
  const fetch = (await import('node-fetch')).default;
  
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
  try {
    const doiInput = String(input);
    const cleanDOI = extractDOI(doiInput);
    return doi2bibAppleScript(cleanDOI);
  } catch (error) {
    return 'Error: ' + error.message;
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