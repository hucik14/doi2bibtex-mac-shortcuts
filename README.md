# DOI to BibTeX - macOS Shortcuts

Convert DOI links to formatted BibTeX citations locally on your Mac using Apple Shortcuts.

## Features

- the Shortcut asks for a DOI entry and then converts it to BibTeX citation (in your clipboad)
- works directly via official doi.org API
- formats automatically the one-liner output
- macOS 12 (Monterey) or later (does not work on iPhone or iPad because of JavaScript)

## Download & Install

1. **Download the shortcut:**
   - Download the shortcut from icloud: [https://www.icloud.com/shortcuts/6db292124c034975a465749ce20e5440](https://www.icloud.com/shortcuts/6db292124c034975a465749ce20e5440)

   
2. **Install:**
   - Double-click the downloaded `.shortcut` file
   - Click "Add Shortcut" when prompted
   - Grant permissions if asked (Javascript permission needed)

3. **Ready to use!**
   - Find it in your Shortcuts app
   - Invoke via Spotlight, Siri, or add it to the menu bar

## Usage

### Supported Input Formats

The shortcut accepts DOIs in multiple formats:

```
10.1109/ACCESS.2025.3646349
https://doi.org/10.1109/ACCESS.2025.3646349
http://dx.doi.org/10.1109/ACCESS.2025.3646349
```

### Example

**Input:**
```
10.1016/j.mechmachtheory.2014.04.001
```

**Output (automatically copied to clipboard):**
```bibtex
@article{Can2014aplanar,
  title={A planar parallel 3-RRR robot with synchronously driven cranks},
  volume={79},
  ISSN={0094-114X},
  url={http://dx.doi.org/10.1016/j.mechmachtheory.2014.04.001},
  DOI={10.1016/j.mechmachtheory.2014.04.001},
  journal={Mechanism and Machine Theory},
  publisher={Elsevier BV},
  author={Can, Engin and Stachel, Hellmuth},
  year={2014},
  month=sep,
  pages={29–45}
}
```


## Acknowledgments

- Inspired by the amazing [doi2bib.org](https://www.doi2bib.org/) which can be used by other users without Mac
