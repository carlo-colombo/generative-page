// this is a p5js sketch
// it reproduce a page in a book
// it shows text in a configurable number of columns
// it uses html to render the column text
// it uses p5js to render the page background
// the text is black on a old paper color background
// the text is justified and fills the columns

let sampleText; // global variable to store the text

function preload() {
  // load the text from external file
  sampleText = loadStrings('RUR.txt');
}


function setup() {
  createCanvas(1200, 800);

  // Seed the random number generator for reproducible results
  randomSeed(42);

  let margin = 20; // space around the page
  let columnCount = 5; // configurable number of columns

  // create a single flexbox container for all verses
  let container = createDiv();
  container.addClass('page-container');
  container.style('top', margin + 'px');
  container.style('left', margin + 'px');
  container.style('width', (width - 2 * margin) + 'px');
  container.style('height', (height - 2 * margin) + 'px');
  container.style('column-count', columnCount.toString());

  // convert loaded text array to single string
  let textContent = sampleText.join('\n');

  // split text by paragraphs (verses) using double newlines
  let paragraphs = textContent.split('\n\n');

  // shuffle the paragraphs array to mix them randomly
  paragraphs = shuffle(paragraphs);

  // create individual paragraph elements for each verse
  for (let i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].trim() !== '') { // skip empty paragraphs
      // Highlight robot words in different languages before creating the div
      let highlightedText = highlightRobotWords(paragraphs[i].trim());
      let paragraph = createDiv(highlightedText);
      paragraph.addClass('verse-paragraph');

      // Apply random kerning (letter-spacing) to each verse
      // Random value between -0.9 and 0.5
      let randomKerning = random(-0.9, 0.5);
      paragraph.style('letter-spacing', randomKerning + 'px');

      // Apply random rotation to each verse
      // Random value between -2 and 2 degrees
      let randomRotation = random(-1, 1);
      paragraph.style('transform', 'rotate(' + randomRotation + 'deg)');

      // Apply random bold and italic styles
      let randomBold = random() < 0.3; // 30% chance for bold
      let randomItalic = random() < 0.3; // 30% chance for italic

      if (randomBold) {
        paragraph.style('font-weight', 'bold');
      }

      if (randomItalic) {
        paragraph.style('font-style', 'italic');
      }

      // Apply random color from very dark blues, dark brown, dark grey palette (almost black)
      let colorPalette = [
        '#0a0e1a', // almost black blue
        '#0f1419', // very dark blue
        '#121820', // dark blue-grey
        '#0d1117', // github dark blue
        '#1a0a0a', // almost black brown
        '#2d1b0e', // very dark brown
        '#251a0f', // dark chocolate brown
        '#1a1a1a', // almost black grey
        '#242424', // very dark grey
        '#2f2f2f'  // dark grey
      ];
      let randomColor = random(colorPalette);
      paragraph.style('color', randomColor);

      // Temporarily add the paragraph to check for overflow
      container.child(paragraph);
      
      // Force layout update and check if content overflows beyond the intended columns
      let containerElement = container.elt;
      containerElement.offsetHeight; // Force layout calculation
      
      // Check if content is overflowing vertically OR horizontally (causing extra columns)
      let isOverflowing = containerElement.scrollHeight > containerElement.clientHeight || 
                         containerElement.scrollWidth > containerElement.clientWidth;
      
      if (isOverflowing) {
        // If overflow detected, remove this verse and stop adding more
        paragraph.remove();
        console.log('Stopped adding verses at index', i, 'to prevent overflow (vertical or horizontal)');
        break;
      }
    }
  }

  // set background color to old paper color
  background('#edd8b9ff');
  
  // Draw random lines after setting up the text
  drawRandomLines();
}

function drawRandomLines() {
  // Set line properties for a subtle, aged look
  stroke(0, 0, 0, 60); // Black with transparency
  strokeWeight(0.5);
  
  // Draw random vertical lines
  let numVerticalLines = random(80, 115);
  for (let i = 0; i < numVerticalLines; i++) {
    let x = random(20, width - 20);
    let startY = random(0, height * 0.3);
    let endY = random(height * 0.7, height);
    line(x, startY, x, endY);
  }
  
  // Draw random horizontal lines
  let numHorizontalLines = random(60, 112);
  for (let i = 0; i < numHorizontalLines; i++) {
    let y = random(20, height - 20);
    let startX = random(0, width * 0.3);
    let endX = random(width * 0.7, width);
    line(startX, y, endX, y);
  }
  
  // Add some shorter accent lines for texture
  stroke(0, 0, 0, 30);
  strokeWeight(0.3);
  let numAccentLines = random(15, 25);
  for (let i = 0; i < numAccentLines; i++) {
    if (random() < 0.5) {
      // Short vertical lines
      let x = random(width);
      let y = random(height);
      let lineLength = random(10, 30);
      line(x, y, x, y + lineLength);
    } else {
      // Short horizontal lines
      let x = random(width);
      let y = random(height);
      let lineLength = random(10, 30);
      line(x, y, x + lineLength, y);
    }
  }
}

function draw() {
}

// Function to highlight robot words in various languages
function highlightRobotWords(text) {
  // Define robot words in different languages (case-insensitive)
  const robotWords = [
    'robot', 'robots', 'Robot', 'Robots', 'ROBOT', 'ROBOTS',  // English
    'робот', 'роботы', 'роботов', 'роботам', 'роботами', 'роботах',  // Russian
    'Робот', 'Роботы', 'Роботов', 'Роботам', 'Роботами', 'Роботах',  // Russian capitalized
    'ロボット',  // Japanese
    'ρομπότ',   // Greek
    'roboter', 'Roboter', 'ROBOTER',  // German
    'robota',   // Czech (original word meaning)
    'робота'    // Czech in Cyrillic
  ];
  
  let highlightedText = text;
  
  // Replace each robot word with highlighted version
  robotWords.forEach(word => {
    // Create a global regex for the word (escaping special characters)
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
    highlightedText = highlightedText.replace(regex, `<span class="robot-highlight">${word}</span>`);
  });
  
  return highlightedText;
}

