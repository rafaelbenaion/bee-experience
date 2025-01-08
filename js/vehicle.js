// ------------------------------------------------------------------------------------------------
// Université Côte d'Azur, MIAGE IA 2
// Rafael Baptista, 2025
// ------------------------------------------------------------------------------------------------
// vehicle.js
// ------------------------------------------------------------------------------------------------

class Vehicle {
  constructor(x, y, type = 'normal') { // Accepts 'type' parameter
    
    // --------------------------------------------------------------------------------------------
    // Basic motion
    // --------------------------------------------------------------------------------------------

    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    // --------------------------------------------------------------------------------------------
    // Movement limits
    // --------------------------------------------------------------------------------------------

    this.maxSpeed = type === 'blue' ? 3 : 7; // Blue bees move slower
    this.maxForce = 1;

    // --------------------------------------------------------------------------------------------
    // Size for collision and rendering
    // --------------------------------------------------------------------------------------------

    this.r    = type === 'blue' ? 40 : 10; // Blue bees are 4 times larger (10 * 4 = 40)
    this.type = type;                      // 'normal', 'red', 'blue'

    // --------------------------------------------------------------------------------------------
    // States
    // --------------------------------------------------------------------------------------------

    this.isExploding = false;
    this.isRemoved   = false;

    // --------------------------------------------------------------------------------------------
    // Explosion visuals
    // --------------------------------------------------------------------------------------------

    this.fadeAlpha           = 255;
    this.explosionSize       = this.r * 2;
    this.explosionGrowthRate = 3;

    // --------------------------------------------------------------------------------------------
    // Initialize based on type
    // --------------------------------------------------------------------------------------------

    if (this.type === 'blue') {
      this.blueImage = loadImage('js/assets/bee_blue.png'); // Load blue bee image
      this.killCount = 0;                                   // Tracks number of kills near
      this.killed    = false;                               // Flag to indicate if has been killed
    }

    // --------------------------------------------------------------------------------------------
    // Start random movement
    // --------------------------------------------------------------------------------------------

    this.randomMovement();
  }

  // ----------------------------------------------------------------------------------------------
  // Simple steering: arrive => uses seek with arrival = true
  // ----------------------------------------------------------------------------------------------
  
  arrive(target) {
    return this.seek(target, true);
  }

  seek(target, arrival = false) {

    let force        = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {

      let brakingRadius = 100;
      let distance      = force.mag();

      if (distance < brakingRadius) {
        desiredSpeed = map(distance, 0, brakingRadius, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // ----------------------------------------------------------------------------------------------
  // Flee behavior: move away from the target
  // ----------------------------------------------------------------------------------------------
  
  flee(target) {

    let desired          = p5.Vector.sub(this.pos, target);
    let distance         = desired.mag();
    let perceptionRadius = 100; 

    if (distance < perceptionRadius) {
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  randomMovement() {
    let randomForce = createVector(random(-1, 1), random(-1, 1));
    randomForce.setMag(0.5);
    this.applyForce(randomForce);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // --------------------------------------------------------------------------------------------
    // Explosion logic
    // --------------------------------------------------------------------------------------------

    if (this.isExploding) {

      this.fadeAlpha      -= 10;
      this.explosionSize  += this.explosionGrowthRate;

      if (this.fadeAlpha <= 0) {
        
        this.fadeAlpha = 0;
        this.isRemoved = true;
      
      }
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    if (this.isExploding) {

      // ------------------------------------------------------------------------------------------
      // Draw explosion
      // ------------------------------------------------------------------------------------------

      fill(255, 0, 0, this.fadeAlpha);
      noStroke();
      ellipse(0, 0, this.explosionSize);
    } else {

      // ------------------------------------------------------------------------------------------
      // Render based on type
      // ------------------------------------------------------------------------------------------

      if (this.type === 'blue' && this.blueImage) {

        // ----------------------------------------------------------------------------------------
        // Blue Bee Image Rendering
        // ----------------------------------------------------------------------------------------

        let angle = this.vel.heading() + PI / 2;
        rotate(angle);
        imageMode(CENTER);
        image(this.blueImage, 0, 0, this.r * 2, this.r * 2);

      } else if (this.type === 'red') {

        // ----------------------------------------------------------------------------------------
        // Red Bee Image Rendering
        // ----------------------------------------------------------------------------------------

        if (beeRedImage) {
          let angle = this.vel.heading() + PI / 2;
          rotate(angle);
          imageMode(CENTER);
          image(beeRedImage, 0, 0, this.r * 2, this.r * 2);
        } else {
          this.drawBee(true);
        }
      } else {

        // ----------------------------------------------------------------------------------------
        // Normal Bee Image Rendering
        // ----------------------------------------------------------------------------------------

        if (beeImage) {
          let angle = this.vel.heading() + PI / 2;
          rotate(angle);
          imageMode(CENTER);
          image(beeImage, 0, 0, this.r * 2, this.r * 2);
        } else {
          this.drawBee(false);
        }
      }
    }

    pop();
  }

  drawBee(isRed) {
    if (isRed) fill(255, 0, 0);
    else fill(255);

    noStroke();
    ellipse(0, 0, this.r * 2, this.r);

    // --------------------------------------------------------------------------------------------
    // Stripes
    // --------------------------------------------------------------------------------------------

    stroke(0);
    strokeWeight(2);
    line(-this.r, 0, this.r, 0);

    // --------------------------------------------------------------------------------------------
    // Wings
    // --------------------------------------------------------------------------------------------

    noFill();
    if (isRed) {
      stroke(255, 0, 0, 150);
    } else {
      stroke(255, 255, 255, 150);
    }
    strokeWeight(1);
    ellipse(-this.r / 2, -this.r / 2, this.r, this.r / 2);
    ellipse(this.r / 2, -this.r / 2, this.r, this.r / 2);

    // --------------------------------------------------------------------------------------------
    // Head
    // --------------------------------------------------------------------------------------------

    fill(255);
    noStroke();
    ellipse(this.r, 0, this.r / 2, this.r / 2);

    // --------------------------------------------------------------------------------------------
    // Eyes
    // --------------------------------------------------------------------------------------------

    fill(0);
    ellipse(this.r + 2, -2, 2, 2);
    ellipse(this.r + 2, 2, 2, 2);
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  startExplosion() {
    if (!this.isExploding) {
      this.isExploding = true;
    }
  }

  isFullyExploded() {
    return this.isRemoved;
  }

  // ----------------------------------------------------------------------------------------------
  // Method to set bee as red permanently
  // ----------------------------------------------------------------------------------------------

  setRed() {
    this.type     = 'red';
    this.maxSpeed = 7; // Reset speed if needed
  }

  // ----------------------------------------------------------------------------------------------
  // Method to set bee as blue permanently
  // ----------------------------------------------------------------------------------------------

  setBlue() {
    this.type     = 'blue';
    this.maxSpeed = 3;  // Blue bees move slower
    this.r        = 40; // Increase size
  }

}
