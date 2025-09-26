// this is a p5js sketch
// it reproduce a page in a book
// it shows text in a configurable number of columns
// it uses html to render the column text
// it uses p5js to render the page background
// the text is black on a old paper color background
// the text is justified and fills the columns

let sampleText; // global variable to store the text
let overlayCanvas; // transparent overlay canvas for the boxes

function preload() {
  // load the text from external file
  sampleText = loadStrings('RUR.txt');
}


function setup() {
  let canvas = createCanvas(1200, 800);
  
  // Position the canvas to appear over HTML elements
  canvas.style('position', 'absolute');
  canvas.style('top', '20px');
  canvas.style('left', '20px');
  canvas.style('z-index', '100');
  canvas.style('pointer-events', 'none'); // Allow interaction with elements below
  
  // Create a transparent overlay canvas on top
  overlayCanvas = createGraphics(1200, 800);
  
  // Get seed from query string parameter, default to 42 if not provided
  let urlParams = new URLSearchParams(window.location.search);
  let seedValue = urlParams.get('seed');
  if (seedValue !== null) {
    seedValue = parseInt(seedValue);
  } else {
    seedValue = 42; // default seed
  }
  
  // Seed the random number generator for reproducible results
  randomSeed(seedValue);

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
  
  // Create HTML boxes instead of canvas overlay
  createHTMLBoxes();
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
  // No need to draw anything since boxes are HTML elements
}

function createHTMLBoxes() {
  // Calculate bottom line position - align to the bottom of the canvas area
  let bottomY = height - 10; // Bottom of canvas with small margin
  let numBoxes = 22; // Number of boxes to create
  
  // Start from middle of the page and push toward right
  let startX = width / 2; // Start from horizontal center
  let currentX = startX;
  let overlapAmount = -8; // Negative spacing for overlapping
  
  // Generate HTML boxes with random properties
  for (let i = 0; i < numBoxes; i++) {
    // Random width and height for each box
    let boxWidth = random(25, 85);
    let boxHeight = random(120, 280);
    
    // Variation in dark grey colors
    let greyValue = Math.floor(random(20, 45)); // Variation in darker greys
    let greyColor = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;

    // Random number of grid sets between 2 and 6 for each box
    let numGridSets = Math.floor(random(2, 6)); // Random between 2 and 6

    // Create multiple sets of vertical and horizontal gradients
    let gradientArray = [];
    
    for (let gridSet = 0; gridSet < numGridSets; gridSet++) {
      // Random spacing for this grid set
      let verticalSpacing = random(3, 15);
      let horizontalSpacing = random(3, 15);
      
      // Random properties for this grid set
      let gridOpacity = random(0.05, 0.2);
      let gridLineWidth = random(0.3, 1.2);
      
      // Minor random rotation for grid lines between -1 and 1 degree
      let verticalRotation = 90 + random(-1, 1);  // 90deg ± 1deg for vertical lines
      let horizontalRotation = 0 + random(-1, 1);   // 0deg ± 1deg for horizontal lines
      
      // Add vertical gradient with minor rotation
      gradientArray.push(`repeating-linear-gradient(${verticalRotation}deg, rgba(255,255,255, ${gridOpacity}), rgba(255,255,255, ${gridOpacity}) ${gridLineWidth}px, transparent ${gridLineWidth}px, transparent ${verticalSpacing}px)`);
      
      // Add horizontal gradient with minor rotation
      gradientArray.push(`repeating-linear-gradient(${horizontalRotation}deg, rgba(255,255,255, ${gridOpacity}), rgba(255,255,255, ${gridOpacity}) ${gridLineWidth}px, transparent ${gridLineWidth}px, transparent ${horizontalSpacing}px)`);
    }
    
    // Calculate Y position so ALL boxes have their bottom edge at the same bottomY line
    let boxY = bottomY - boxHeight;
    
    // Remove vertical jitter to ensure perfect bottom alignment
    // let verticalJitter = random(-8, 8);
    // boxY += verticalJitter;
    
    
    // Create HTML div element for the box
    let box = createDiv('');
    box.style('position', 'absolute');
    box.style('left', (20 + currentX) + 'px'); // Add canvas offset
    box.style('top', (20 + boxY) + 'px'); // Add canvas offset
    box.style('width', boxWidth + 'px');
    box.style('height', boxHeight + 'px');
    box.style('background-color', greyColor);
    box.style('background-image', gradientArray.join(', '));
    box.style('z-index', '1000'); // Higher than text and canvas
    box.style('pointer-events', 'none'); // Don't interfere with interactions
    
    // Move to next position with overlapping
    currentX += boxWidth + overlapAmount;
    
    // Gradually reduce overlap as we move right (push effect)
    if (i > numBoxes / 2) {
      overlapAmount += 0.5; // Gradually less overlap toward the right
    }
  }
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

