// ------------------------------------------------------------------------------------------------
// Université Côte d'Azur, MIAGE IA 2
// Rafael Baptista, 2025
// ------------------------------------------------------------------------------------------------
// sketch.js
// ------------------------------------------------------------------------------------------------

let gestures_results;

let cam      = null;
let p5canvas = null;
let vehicles = [];

// ------------------------------------------------------------------------------------------------
// Bee images
// ------------------------------------------------------------------------------------------------

let beeImage;
let beeRedImage;
let beeBlueImage;

// ------------------------------------------------------------------------------------------------
// Track if we've spawned bees for a "Victory" gesture
// ------------------------------------------------------------------------------------------------

let victorySpawnHappened = false;

// ------------------------------------------------------------------------------------------------
// Counters for killed bees
// ------------------------------------------------------------------------------------------------
let normalBeeCount  = 0;
let redBeeCount     = 0;
let blueBeeCount    = 0;

// ------------------------------------------------------------------------------------------------
// Array to track active Blue Bees
// ------------------------------------------------------------------------------------------------

let blueBees = [];

// ------------------------------------------------------------------------------------------------
// Function to randomly turn existing bees red every second
// ------------------------------------------------------------------------------------------------

function turnRandomBeesRed() {
  
  let numBeesToTurnRed = floor(random(1, 6)); // Random number between 1 and 5
  
  for (let i = 0; i < numBeesToTurnRed; i++) {
    
    let randomBeeIndex = floor(random(vehicles.length));
    let bee            = vehicles[randomBeeIndex];
    
    if (!bee.isRed && bee.type === 'normal') { // Only turn non-red, normal bees red
      bee.setRed();
    }
  }
}

function preload() {
  beeImage     = loadImage('js/assets/bee.png');
  beeRedImage  = loadImage('js/assets/bee_red.png');
  beeBlueImage = loadImage('js/assets/bee_blue.png');
}

function setup() {
  
  p5canvas = createCanvas(windowWidth, windowHeight);
  p5canvas.parent('#canvas');

  // ----------------------------------------------------------------------------------------------
  // Spawn 3000 normal bees
  // ----------------------------------------------------------------------------------------------

  for (let i = 0; i < 3000; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y, 'normal'));
  }

  // ----------------------------------------------------------------------------------------------
  // Spawn a Blue Bee every 10 seconds
  // ----------------------------------------------------------------------------------------------

  setInterval(spawnBlueBee, 10000); // 10000 ms = 10 seconds

  // ----------------------------------------------------------------------------------------------
  // Called by MediaPipe Hands
  // ----------------------------------------------------------------------------------------------

  gotGestures = function (results) {
    gestures_results = results;
  };

  // ----------------------------------------------------------------------------------------------
  // Automatically request webcam
  // ----------------------------------------------------------------------------------------------
  
  startWebcam();

  // ----------------------------------------------------------------------------------------------
  // Turn random bees red every second
  // ----------------------------------------------------------------------------------------------
  setInterval(turnRandomBeesRed, 1000);
}

function startWebcam() {
  if (window.setCameraStreamToMediaPipe) {
    cam = createCapture(VIDEO);
    cam.size(windowWidth, windowHeight);
    cam.hide();
    cam.elt.onloadedmetadata = function () {
      window.setCameraStreamToMediaPipe(cam.elt);
    };
    p5canvas.style('width', '100%');
    p5canvas.style('height', '100%');
  }
}

function spawnBlueBee() {

  // ----------------------------------------------------------------------------------------------
  // Spawn a blue bee at a random location, ensuring it's not too close to existing Blue Bees
  // ----------------------------------------------------------------------------------------------

  let spawnAttempts = 0;
  let maxAttempts    = 10;
  let x, y, valid     = false;

  while (spawnAttempts < maxAttempts && !valid) {
    x     = random(width);
    y     = random(height);
    valid = true;
    for (let blueBee of blueBees) {
      if (dist(x, y, blueBee.pos.x, blueBee.pos.y) < 200) { // Minimum distance of 200 pixels
        valid = false;
        break;
      }
    }
    spawnAttempts++;
  }

  if (valid) {
    let blueBee = new Vehicle(x, y, 'blue');
    blueBees.push(blueBee);
    vehicles.push(blueBee);
    notify("A Mighty Blue Bee has appeared! Use two hands to kill it!");
  }
}

function draw() {
  clear();
  background(0);

  // ----------------------------------------------------------------------------------------------
  // Reset isTempRed & do random movement
  // ----------------------------------------------------------------------------------------------

  for (let v of vehicles) {
    v.isTempRed = false;

    // --------------------------------------------------------------------------------------------
    // Simple random wandering
    // --------------------------------------------------------------------------------------------

    let randomForce = createVector(random(-0.1, 0.1), random(-0.1, 0.1));
    v.applyForce(randomForce);
    v.update();
    v.show();
  }

  // 2) Increment counters for removed bees and handle Blue Bee kill counts
  let removedBees = vehicles.filter(v => v.isRemoved);
  for (let v of removedBees) {
    if (v.type === 'red') {
      redBeeCount++;
    } else if (v.type === 'blue') {
      blueBeeCount++;
    } else {
      normalBeeCount++;
    }
  }

  // ----------------------------------------------------------------------------------------------
  // Update the interface
  // ----------------------------------------------------------------------------------------------

  document.getElementById('normal-bee-count').innerText = normalBeeCount;
  document.getElementById('red-bee-count').innerText    = redBeeCount;
  document.getElementById('blue-bee-count').innerText   = blueBeeCount;

  // ----------------------------------------------------------------------------------------------
  // Remove exploded bees
  // ----------------------------------------------------------------------------------------------

  vehicles = vehicles.filter(v => !v.isRemoved);

  // ----------------------------------------------------------------------------------------------
  // Handle gestures
  // ----------------------------------------------------------------------------------------------

  if (gestures_results && gestures_results.landmarks) {
    
    // --------------------------------------------------------------------------------------------
    // Collect all 'Pointing_Up' fingertips
    // --------------------------------------------------------------------------------------------
    
    let pointingUpFingertips = [];

    for (let i = 0; i < gestures_results.landmarks.length; i++) {

      const landmarks   = gestures_results.landmarks[i];
      const gestureName = gestures_results.gestures[i][0]?.categoryName || "";

      // ------------------------------------------------------------------------------------------
      // POINTING UP (Red Fingertip)
      // ------------------------------------------------------------------------------------------

      if (gestureName === "Pointing_Up") {
        let fingertipX = null;
        let fingertipY = null;

        // ----------------------------------------------------------------------------------------
        // Look for landmark #8 => index fingertip
        // ----------------------------------------------------------------------------------------

        for (let j = 0; j < landmarks.length; j++) {
          if (j === 8) {

            const landmark  = landmarks[j];
            fingertipX      = constrain(width - landmark.x * width, 0, width);
            fingertipY      = constrain(landmark.y * height, 0, height);

            // ------------------------------------------------------------------------------------
            // Draw the red fingertip
            // ------------------------------------------------------------------------------------
            
            noStroke();
            for (let radius = 30; radius > 0; radius -= 5) {
              const alpha = map(radius, 30, 0, 20, 180);
              fill(255, 0, 0, alpha);
              circle(fingertipX, fingertipY, radius);
            }

            // ------------------------------------------------------------------------------------
            // Debug circle
            // ------------------------------------------------------------------------------------

            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            circle(fingertipX, fingertipY, 200);

          } else {

            // ------------------------------------------------------------------------------------
            // Normal blueish circles for other landmarks
            // ------------------------------------------------------------------------------------

            const landmark = landmarks[j];
            const px       = constrain(width - landmark.x * width, 0, width);
            const py       = constrain(landmark.y * height, 0, height);

            noStroke();
            for (let radius = 30; radius > 0; radius -= 5) {
              const alpha = map(radius, 30, 0, 20, 180);
              fill(100, 150, 210, alpha);
              circle(px, py, radius);
            }
          }
        }

        // ----------------------------------------------------------------------------------------
        // Collect 'Pointing_Up' fingertip positions
        // ----------------------------------------------------------------------------------------

        if (fingertipX !== null && fingertipY !== null) {
          pointingUpFingertips.push(createVector(fingertipX, fingertipY));

          // --------------------------------------------------------------------------------------
          // Explode normal and red bees within explodeRange
          // --------------------------------------------------------------------------------------

          let explodeRange = 20; 
          for (let v of vehicles) {
            if (v.type !== 'blue') { // Only normal/red bees
              let d = dist(v.pos.x, v.pos.y, fingertipX, fingertipY);
              if (d < explodeRange) {
                v.startExplosion();
              }
            }
          }
        }
      }

      // ------------------------------------------------------------------------------------------
      // CLOSED FIST (Attract bees)
      // ------------------------------------------------------------------------------------------

      if (gestureName === "Closed_Fist") {
        
        // ----------------------------------------------------------------------------------------
        // Approx "middle of fist" by averaging all landmarks
        // ----------------------------------------------------------------------------------------

        let sumX = 0;
        let sumY = 0;

        for (let j = 0; j < landmarks.length; j++) {
          sumX += landmarks[j].x;
          sumY += landmarks[j].y;
        }

        let avgX        = sumX / landmarks.length;
        let avgY        = sumY / landmarks.length;
        let fistCenterX = width - avgX * width;
        let fistCenterY = avgY * height;

        // ----------------------------------------------------------------------------------------
        // Bees "arrive" at fist center
        // ----------------------------------------------------------------------------------------

        for (let v of vehicles) {

          let center      = createVector(fistCenterX, fistCenterY);
          let arriveForce = v.arrive(center);
          v.applyForce(arriveForce);

        }

        // ----------------------------------------------------------------------------------------
        // Debug circle
        // ----------------------------------------------------------------------------------------

        push();
        noFill();
        stroke(255, 255, 0);
        strokeWeight(3);
        circle(fistCenterX, fistCenterY, 80);
        pop();
      }

      // ------------------------------------------------------------------------------------------
      // THUMBS_UP (Disperse bees)
      // ------------------------------------------------------------------------------------------

      if (gestureName === "Thumb_Up") { 
        
        // ----------------------------------------------------------------------------------------
        // Calculate the center of the thumb (using landmark #4: thumb tip)
        // ----------------------------------------------------------------------------------------

        let thumbTipX = null;
        let thumbTipY = null;

        for (let j = 0; j < landmarks.length; j++) {
          if (j === 4) { // Landmark 4 is the thumb tip
           
            const landmark  = landmarks[j];
            thumbTipX       = constrain(width - landmark.x * width, 0, width);
            thumbTipY       = constrain(landmark.y * height, 0, height);

            // ------------------------------------------------------------------------------------
            // Draw the thumb tip
            // ------------------------------------------------------------------------------------

            noStroke();
            fill(0, 255, 0, 100); // Green semi-transparent
            ellipse(thumbTipX, thumbTipY, 50, 50);

          } else {

            // ------------------------------------------------------------------------------------
            // Normal drawing for other landmarks
            // ------------------------------------------------------------------------------------

            const landmark = landmarks[j];
            const px       = constrain(width - landmark.x * width, 0, width);
            const py       = constrain(landmark.y * height, 0, height);

            noStroke();
            fill(100, 150, 210, 50);
            ellipse(px, py, 20, 20);
          }
        }

        // ----------------------------------------------------------------------------------------
        // Apply flee behavior to all bees if thumb tip is detected
        // ----------------------------------------------------------------------------------------

        if (thumbTipX !== null && thumbTipY !== null) {
          
          let thumbPosition = createVector(thumbTipX, thumbTipY);
          
          for (let v of vehicles) {
            let fleeForce = v.flee(thumbPosition);
            v.applyForce(fleeForce);
          }
          
          // --------------------------------------------------------------------------------------
          // Optional: Draw a repel zone
          // --------------------------------------------------------------------------------------

          noFill();
          stroke(0, 255, 0);
          strokeWeight(2);
          ellipse(thumbTipX, thumbTipY, 150, 150);
        }
      }

      // ------------------------------------------------------------------------------------------
      // VICTORY (Spawn More Bees) 
      // ------------------------------------------------------------------------------------------

      if (gestureName === "Victory") {

        // ----------------------------------------------------------------------------------------
        // If you want it to happen once:
        // ----------------------------------------------------------------------------------------

        if (!victorySpawnHappened) {

          // --------------------------------------------------------------------------------------
          // Spawn 200 bees, for example
          // --------------------------------------------------------------------------------------

          for (let k = 0; k < 200; k++) {
            
            let x = random(width);
            let y = random(height);
            vehicles.push(new Vehicle(x, y, 'normal'));
          
          }

          // --------------------------------------------------------------------------------------
          // Debug circle
          // --------------------------------------------------------------------------------------

          push();
          noFill();
          stroke(255, 0, 255);
          strokeWeight(3);

          // --------------------------------------------------------------------------------------
          // Calculate the center by averaging all landmarks
          // --------------------------------------------------------------------------------------

          let sumX = 0;
          let sumY = 0;
          for (let j = 0; j < landmarks.length; j++) {
            sumX += landmarks[j].x;
            sumY += landmarks[j].y;
          }
          let avgX        = sumX / landmarks.length;
          let avgY        = sumY / landmarks.length;
          let fistCenterX = width - avgX * width;
          let fistCenterY = avgY * height;

          circle(fistCenterX, fistCenterY, 280);
          noStroke();
          fill(255, 0, 255, 100); 
          ellipse(fistCenterX, fistCenterY, 150, 150);
          pop();

          // --------------------------------------------------------------------------------------
          // Mark so it doesn't keep spawning repeatedly
          // --------------------------------------------------------------------------------------

          victorySpawnHappened = true;
        }
      } else {

        // ----------------------------------------------------------------------------------------
        // If it's any gesture that is NOT "Victory", 
        // reset to allow spawning again next time
        // ----------------------------------------------------------------------------------------

        victorySpawnHappened = false;
      }

      // ------------------------------------------------------------------------------------------
      // Killing Blue Bees with Two Fingers
      // ------------------------------------------------------------------------------------------
      // After collecting all 'Pointing_Up' fingertips, process Blue Bees
      // Each Blue Bee should be checked against all 'Pointing_Up' fingertips
      // If two or more fingertips are within its radius, kill it
      // ------------------------------------------------------------------------------------------

      blueBees.forEach(blueBee => {
        
        if (!blueBee.killed) {
          let count = 0;
          for (let fingertip of pointingUpFingertips) {
            
            let d = dist(fingertip.x, fingertip.y, blueBee.pos.x, blueBee.pos.y);
            if (d < blueBee.r) { // Within Blue Bee's radius
              count++;
            }
            
            if (count >= 2) {
              blueBee.startExplosion();
              blueBee.killed = true;
              blueBeeCount++;
              break; // No need to check further once killed
            }
          }
        }
      });

      // ------------------------------------------------------------------------------------------
      // Draw skeleton connections
      // ------------------------------------------------------------------------------------------

      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20]
      ];

      for (let connection of connections) {
        
        const [startIdx, endIdx]  = connection;
        const start               = landmarks[startIdx];
        const end                 = landmarks[endIdx];
        const sx                  = constrain(width - start.x * width, 0, width);
        const sy                  = constrain(start.y * height, 0, height);
        const ex                  = constrain(width - end.x * width, 0, width);
        const ey                  = constrain(end.y * height, 0, height);
        const mx                  = (sx + ex) / 2;
        const my                  = (sy + ey) / 2;

        noStroke();
        for (let radius = 30; radius > 0; radius -= 5) {
          const alpha = map(radius, 30, 0, 20, 180);
          fill(100, 150, 210, alpha);
          circle(mx, my, radius);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (cam) {
    cam.size(windowWidth, windowHeight);
  }
}

// ------------------------------------------------------------------------------------------------
// Notification Function (Optional Enhancement)
// ------------------------------------------------------------------------------------------------

function notify(message) {

  // ----------------------------------------------------------------------------------------------
  // Create a temporary on-screen message
  // ----------------------------------------------------------------------------------------------

  let msg = createDiv(message);
  msg.style('position', 'fixed');
  msg.style('top', '90%');
  msg.style('left', '50%');
  msg.style('transform', 'translate(-50%, -50%)');
  msg.style('background-color', 'rgba(255, 255, 255, 0.5)');
  msg.style('padding', '20px');
  msg.style('border-radius', '10px');
  msg.style('font-size', '20px');
  msg.style('color', '#000');
  msg.style('z-index', '1001');
  msg.style('text-align', 'center');
  
  setTimeout(() => {
    msg.remove();
  }, 4000); // Message disappears after 4 seconds
}
