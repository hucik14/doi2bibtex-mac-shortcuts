/* Test file for doi2bib module using Jest
*/

const { extractDOI, doi2bib } = require('../src/doi2bib');

describe('DOI Extractor', () => {
  test('extracts DOI from full URL', () => {
    const input = 'https://doi.org/10.1109/ACCESS.2025.3646349';
    const result = extractDOI(input);
    expect(result).toBe('10.1109/ACCESS.2025.3646349');
  });

  test('extracts DOI from http URL', () => {
    const input = 'http://doi.org/10.1109/ACCESS.2025.3646349';
    const result = extractDOI(input);
    expect(result).toBe('10.1109/ACCESS.2025.3646349');
  });

  test('handles plain DOI', () => {
    const input = '10.1109/ACCESS.2025.3646349';
    const result = extractDOI(input);
    expect(result).toBe('10.1109/ACCESS.2025.3646349');
  });

  test('trims whitespace', () => {
    const input = '  10.1109/ACCESS.2025.3646349  ';
    const result = extractDOI(input);
    expect(result).toBe('10.1109/ACCESS.2025.3646349');
  });

  test('throws error for empty input', () => {
    expect(() => extractDOI('')).toThrow('No DOI provided');
  });

  test('throws error for null input', () => {
    expect(() => extractDOI(null)).toThrow('No DOI provided');
  });
});

describe('DOI to BibTeX Fetcher', () => {
  // Note: These tests make network requests
  
  test('fetches valid BibTeX for known DOI', async () => {
    const doi = '10.1109/ACCESS.2025.3646349';
    const result = await doi2bib(doi);
    
    expect(result).toContain('@article');
    expect(result).toContain('title=');
    expect(result).toContain('year=');
  }, 10000); // 10 second timeout for network request

  test('handles DOI with URL prefix', async () => {
    const doi = 'https://doi.org/10.1109/ACCESS.2025.3646349';
    const result = await doi2bib(doi);
    
    expect(result).toContain('@article');
  }, 10000);

  test('throws error for invalid DOI', async () => {
    const doi = '10.1234/invalid.doi.12345';
    
    await expect(doi2bib(doi)).rejects.toThrow();
  }, 10000);

  test('throws error for malformed DOI', async () => {
    const doi = 'not-a-doi';
    
    await expect(doi2bib(doi)).rejects.toThrow();
  }, 10000);
});

describe('Integration Test', () => {
  test('complete workflow: DOI to formatted BibTeX', async () => {
    const { formatBibTeX } = require('../src/formatter');
    
    const doi = '10.1109/ACCESS.2025.3646349';
    const rawBibTeX = await doi2bib(doi);
    const formatted = formatBibTeX(rawBibTeX);
    
    // Check formatting
    expect(formatted).toMatch(/^@article/);
    expect(formatted).toContain('\n  ');
    expect(formatted).toMatch(/\}$/);
    
    // Check citation key modification
    const lines = formatted.split('\n');
    expect(lines[0]).toMatch(/[A-Za-z]{0,7},$/);
    expect(lines[0]).toContain('Po_tulka2025');
  }, 10000);
});