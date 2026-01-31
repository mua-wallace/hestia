const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractPDFText() {
  try {
    console.log('Reading PDF file...');
    const dataBuffer = fs.readFileSync('datafile.pdf');
    
    console.log('Loading PDF document...');
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdfDocument = await loadingTask.promise;
    
    console.log(`Total pages: ${pdfDocument.numPages}`);
    
    // Extract text from first page only
    const page = await pdfDocument.getPage(1);
    const textContent = await page.getTextContent();
    
    // Combine all text items
    let text = '';
    textContent.items.forEach((item) => {
      text += item.str + ' ';
    });
    
    console.log('\n=== Page 1 Content ===\n');
    console.log(text);
    
    // Save to file
    fs.writeFileSync('extracted-pdf-text.txt', text);
    console.log('\n\nText saved to extracted-pdf-text.txt');
    
    return text;
  } catch (error) {
    console.error('Error extracting PDF:', error.message);
    console.error(error.stack);
    throw error;
  }
}

extractPDFText()
  .then(() => {
    console.log('Extraction completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
