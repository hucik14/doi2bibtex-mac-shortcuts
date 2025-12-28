/* Test file for formatter module using Jest
*/

const { formatBibTeX } = require('../src/formatter');

describe('BibTeX Formatter', () => {
  const sampleBibTeX = ` @article{Can2014, title={A planar parallel 3-RRR robot with synchronously driven cranks}, volume={79}, ISSN={0094-114X}, url={http://dx.doi.org/10.1016/j.mechmachtheory.2014.04.001}, DOI={10.1016/j.mechmachtheory.2014.04.001}, journal={Mechanism and Machine Theory}, publisher={Elsevier BV}, author={Can, Engin and Stachel, Hellmuth}, year={2014}, month=sep, pages={29–45} }`;

  test('removes leading spaces before @', () => {
    const input = '  @article{key, title={Test}}';
    const result = formatBibTeX(input);
    expect(result).toMatch(/^@article/);
  });

  test('adds first 7 chars of title to citation key', () => {
    const result = formatBibTeX(sampleBibTeX);
    expect(result).toContain('Can2014aplanar');
  });

  test('formats fields on separate lines with indentation', () => {
    const result = formatBibTeX(sampleBibTeX);
    const lines = result.split('\n');
    
    // Check first line has entry type and key
    expect(lines[0]).toMatch(/@article\{Can2014aplanar,$/);
    
    // Check fields are indented
    expect(lines[1]).toMatch(/^  title=/);
    expect(lines[2]).toMatch(/^  volume=/);
    
    // Check last line is closing brace
    expect(lines[lines.length - 1]).toBe('}');
  });

  test('preserves commas within braces', () => {
    const input = '@article{key, author={Smith, John and Doe, Jane}}';
    const result = formatBibTeX(input);
    expect(result).toContain('Smith, John and Doe, Jane');
  });

  test('handles entries without title gracefully', () => {
    const input = '@misc{key, year={2025}, note={No title}}';
    const result = formatBibTeX(input);
    expect(result).toContain('@misc{key,');
  });

  test('throws error for invalid BibTeX', () => {
    const invalid = 'not a bibtex entry';
    expect(() => formatBibTeX(invalid)).toThrow('Could not parse BibTeX entry');
  });

  test('throws error for empty input', () => {
    expect(() => formatBibTeX('')).toThrow('Invalid BibTeX input');
  });

  test('removes special characters from title prefix', () => {
    const input = '@article{key, title={Re-thinking: AI & ML}}';
    const result = formatBibTeX(input);
    expect(result).toContain('keyrethink');
  });

  test('handles very short titles', () => {
    const input = '@article{key, title={AI}}';
    const result = formatBibTeX(input);
    expect(result).toContain('keyai');
  });
});