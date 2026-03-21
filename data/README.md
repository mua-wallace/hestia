# Reference data

This folder holds reference and generated data used for design or seeding. Not part of the app bundle.

| File | Description |
|------|-------------|
| `datafile.pdf` | Source PDF (design or requirements) |
| `extracted-pdf-text.txt` | Text extracted from the PDF |
| `operational-data.csv` | Operational/sample data (e.g. AM) |
| `pm-operational-data.csv` | PM shift sample data |
| `parsed-rooms.json` | Parsed room data |
| `test-output.txt` | Test run output |

Scripts that use this data (e.g. `extract-pdf.js`, `generateMockFromCsv.js`) live in the project root `scripts/` folder.
