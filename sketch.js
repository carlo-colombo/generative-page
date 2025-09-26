let sampleText; // global variable to store the text

function preload() {
  // load the text from external file
  sampleText = loadStrings('RUR.txt');
}


function setup() {
  let canvas = createCanvas(3200, 2400);

  // Set CSS variables in :root element for proportional sizing
  document.documentElement.style.setProperty('--canvas-width', width + 'px');
  document.documentElement.style.setProperty('--canvas-height', height + 'px');

  // Position the canvas to appear over HTML elements
  canvas.style('position', 'absolute');
  canvas.style('top', '20px');
  canvas.style('left', '20px');
  canvas.style('z-index', '100');
  canvas.style('pointer-events', 'none'); // Allow interaction with elements below
  
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
  let columnCount = 3; // configurable number of columns

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

      // Apply random whiteish colors suitable for blue background
      let colorPalette = [
        '#ffffff', // pure white
        '#f8f9fa', // very light grey
        '#e9ecef', // light grey
        '#dee2e6', // slightly darker light grey
        '#ced4da', // medium light grey
        '#f0f8ff', // alice blue (very light)
        '#e6f3ff', // very light blue
        '#ccddff', // light blue tint
        '#b3d9ff', // slightly more saturated light blue
        '#e0e0e0'  // light grey
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

  // Create technical blue gradient background
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color('#0d47a1'), color('#1976d2'), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Draw light rectangles
  drawLightRectangles();
  
  // Draw random lines after setting up the text
  drawRandomLines();
  
  // Create HTML border inset
  let borderInset = createHTMLBorderInset();
  
  // Create technical details box as child of border inset
  createTechnicalDetailsBox(borderInset);
  
  // Create HTML boxes as children of border inset
  createHTMLBoxes(borderInset);
}

function drawLightRectangles() {
  // Draw a few light rectangles with varying opacity and sizes
  let numRectangles = random(23, 28); // Random number of rectangles (20 more)
  
  for (let i = 0; i < numRectangles; i++) {
    // Random position within canvas bounds (avoiding the border area)
    let x = random(50, width - 150);
    let y = random(50, height - 150);
    
    // Random size
    let rectWidth = random(40, 200);
    let rectHeight = random(30, 120);
    
    // Light colors with transparency
    let lightColors = [
      [255, 255, 255, 25], // White
      [255, 255, 240, 30], // Ivory
      [240, 248, 255, 25], // Alice blue
      [255, 250, 240, 28], // Floral white
      [245, 245, 220, 22]  // Beige
    ];
    
    let chosenColor = random(lightColors);
    fill(chosenColor[0], chosenColor[1], chosenColor[2], chosenColor[3]);
    
    // Random stroke or no stroke
    if (random() < 0.4) {
      stroke(255, 255, 255, 40);
      strokeWeight(0.5);
    } else {
      noStroke();
    }
    
    // Draw rectangle with slight random rotation
    push();
    translate(x + rectWidth/2, y + rectHeight/2);
    rotate(radians(random(-3, 3)));
    rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
    pop();
  }
}

function drawRandomLines() {
  // Set line properties for whiteish with yellow tint
  stroke(255, 255, 230, 50); // Whiteish with yellow tint and transparency
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
  stroke(255, 255, 200, 30); // Slightly more yellow for accent lines
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

function createHTMLBorderInset() {
  // Create the HTML border element that matches the original canvas border
  let borderInset = createDiv('');
  borderInset.addClass('border-inset');
  
  // Position and size to match the original canvas border (30px inset, 2px stroke)
  borderInset.style('position', 'absolute');
  borderInset.style('top', '50px'); // 20px canvas offset + 30px inset
  borderInset.style('left', '50px'); // 20px canvas offset + 30px inset
  borderInset.style('width', (width - 60) + 'px'); // Canvas width minus 60px (30px on each side)
  borderInset.style('height', (height - 60) + 'px'); // Canvas height minus 60px (30px on each side)
  borderInset.style('pointer-events', 'none'); // Don't interfere with interactions
  borderInset.style('z-index', '200'); // Above canvas but below other elements
  
  return borderInset; // Return the element so it can be used as a parent
}

function formatDate(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Format returns YYYY-MM-DD, replace hyphens with dots
  return formatter.format(date).replace(/-/g, '.');
}

function createTechnicalDetailsBox(parentElement) {
  // Get seed from URL parameter for display
  let urlParams = new URLSearchParams(window.location.search);
  let seedValue = urlParams.get('seed') || '42';
  
  // Get current date using formatting function
  let currentDate = formatDate();
  
  // Create the technical details box
  let detailsBox = createDiv('');
  detailsBox.addClass('technical-details-box');
  
  // Create content for the box
  let content = `
    <div class="technical-line"><span class="label">SOURCE:</span> R.U.R. - Karel Čapek</div>
    <div class="technical-line"><span class="label">AUTHOR:</span> lit</div>
    <div class="technical-line"><span class="label">SEED:</span> ${seedValue}</div>
    <div class="technical-line"><span class="label">TOOLS:</span> p5j, copilot, vscode</div>
    <div class="technical-line"><span class="label">DATE:</span> ${currentDate}</div>
  `;
  
  detailsBox.html(content);
  
  // Make it a child of the border inset element
  parentElement.child(detailsBox);
}

function createHTMLBoxes(parentElement) {
  // Calculate boundaries relative to the parent element (border inset)
  let parentWidth = width - 60; // Border inset width (canvas width - 60px)
  let parentHeight = height - 60; // Border inset height (canvas height - 60px)
  
  // Create a container for the HTML boxes
  let boxesContainer = createDiv('');
  boxesContainer.addClass('boxes-container');
  boxesContainer.style('position', 'absolute');
  boxesContainer.style('bottom', '-20px'); // Position at bottom with margin
  boxesContainer.style('right', '-20px'); // Position at right with margin
  boxesContainer.style('pointer-events', 'none');
  boxesContainer.style('z-index', '1000');
  
  // Make the container a child of the border inset element
  parentElement.child(boxesContainer);
  
  let overlapAmount = -8; // Negative spacing for overlapping
  let boxesCreated = 0;
  let maxAttempts = 50; // Prevent infinite loops
  
  // Generate HTML boxes with random properties, stopping before overflow
  for (let i = 0; i < maxAttempts; i++) {
    // Random width and height for each box
    let boxWidth = random(25, 85);
    let boxHeight = random(120, 280);
    
    // For now, we'll create a reasonable number of boxes since overflow detection is more complex with inline-block
    if (boxesCreated >= 15) { // Limit to prevent too many boxes
      console.log(`Stopped creating boxes at ${boxesCreated} boxes to prevent overcrowding.`);
      break;
    }
    
    // Variation in purely blueish colors (avoiding red and green)
    let blueR = Math.floor(random(5, 15)); // Very low red component
    let blueG = Math.floor(random(8, 20)); // Very low green component  
    let blueB = Math.floor(random(40, 80)); // Much higher blue component for pure blue tint
    let blueColor = `rgb(${blueR}, ${blueG}, ${blueB})`;

    // Random number of grid sets between 2 and 6 for each box
    let numGridSets = Math.floor(random(1, 4)); // Random between 2 and 6

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
      
      // Choose random colors for grid lines - dark grey or dark blue
      let gridColors = [
        '64, 64, 64',     // Dark grey
        '96, 96, 96',     // Medium dark grey
        '32, 32, 32',     // Very dark grey
        '13, 71, 161',    // Dark blue (matching theme)
        '21, 101, 192',   // Medium dark blue
        '25, 118, 210'    // Slightly lighter dark blue
      ];
      let verticalColor = random(gridColors);
      let horizontalColor = random(gridColors);
      
      // Add vertical gradient with minor rotation
      gradientArray.push(`repeating-linear-gradient(${verticalRotation}deg, rgba(${verticalColor}, ${gridOpacity}), rgba(${verticalColor}, ${gridOpacity}) ${gridLineWidth}px, transparent ${gridLineWidth}px, transparent ${verticalSpacing}px)`);
      
      // Add horizontal gradient with minor rotation
      gradientArray.push(`repeating-linear-gradient(${horizontalRotation}deg, rgba(${horizontalColor}, ${gridOpacity}), rgba(${horizontalColor}, ${gridOpacity}) ${gridLineWidth}px, transparent ${gridLineWidth}px, transparent ${horizontalSpacing}px)`);
    }
    
    // Create HTML div element for the box
    let box = createDiv('');
    box.style('width', boxWidth + 'px');
    box.style('height', boxHeight + 'px');
    box.style('background-color', blueColor);
    box.style('background-image', gradientArray.join(', '));
    box.style('pointer-events', 'none'); // Don't interfere with interactions
    
    // Make the box a child of the boxes container
    boxesContainer.child(box);
    
    boxesCreated++;
    
    // Gradually reduce overlap as we move right (push effect)
    if (boxesCreated > 10) { // After 10 boxes, start reducing overlap
      overlapAmount += 0.3; // Gradually less overlap toward the right
    }
  }
  
  console.log(`Successfully created ${boxesCreated} boxes without overflow.`);
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

