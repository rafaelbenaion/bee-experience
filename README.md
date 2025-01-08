# Bee Experience

## Play

You can play the game here : [https://rafaelbenaion.github.io/bee-experience](https://rafaelbenaion.github.io/bee-experience/)

---

## Project Description

Bee Experience is an interactive game developed as part of the Reactive AIs course at the Université Côte d'Azur. This project was created by **Rafael Baptista** under the supervision of Professor **Michel Buffa**. The game uses **MediaPipe** technology for gesture recognition, offering a unique and immersive experience. This project explores the use of reactive AIs to create natural interactions between players and the game.

---

## Key Features

- **Gesture Recognition with MediaPipe**:
  - Allows players to control the game using natural gestures.
  - Ensures smooth and intuitive interaction.
- **Prototype Gameplay**:
  - Players interact with a swarm of bees using gestures to explore and test gesture-based controls.
- **Interactive Design**:
  - Integrates adaptive game logic based on gesture detection.

---

## How to Play

1. **Prerequisites**:
   - Ensure you have a functional webcam connected to your computer.
   - Install a code editor like Visual Studio Code.

2. **Running the Game**:
   - Clone the repository:
     ```bash
     git clone https://github.com/rafaelbenaion/bee-experience.git
     ```
   - Navigate to the directory:
     ```bash
     cd bee-experience
     ```
   - Open the project in Visual Studio Code.
   - Open `index.html` in the editor and click on the **Go Live** option to start the game in your browser.

3. **Game Controls**:

   - **Pointing Up**:
     - Use this gesture to **kill** bees with your fingertips.
     - ![Pointing Up Gesture](assets/finger_up.gif)
   - **Closed Fist**:
     - Use this gesture to **attract** all bees to your hand palm.
     - ![Closed Fist Gesture](assets/closed_fist.gif)
   - **Thumbs Up**:
     - Use this gesture to **repel** all the bees around your thumb.
     - ![Thumbs Up Gesture](assets/thumbs_up.gif)
   - **Victory**:
     - Use this gesture to trigger more bee **spawn**.
     - ![Victory Gesture](assets/victory_2fingers.gif)
   - **Both Hands Raised**:
     - Use this gesture to kill **blue bees**.

   > The game is gesture-controlled through your webcam. Position yourself in front of your computer with both palms facing the screen so that your webcam can capture your hands.

4. **Objective**:
   - There is no specific objective; this is a prototype gameplay experience designed to test gesture recognition controls and interactions with a swarm of bees.

---

## Project Structure

The project is organized as follows:

```plaintext
bee-experience/
├── assets/                     # Contains resources such as images and fonts
│   ├── closed_fist.gif         # GIF showing closed fist gesture
│   ├── finger_up.gif           # GIF showing pointing up gesture
│   ├── thumbs_up.gif           # GIF showing thumbs up gesture
│   └── victory_2fingers.gif    # GIF showing victory gesture
├── js/                         # JavaScript files
│   ├── assets/                 # Additional assets
│   ├── drawing_utils.js        # Drawing utilities for visualization
│   ├── hands.js                # Handles hand detection logic
│   ├── p5.js                   # p5.js library
│   ├── script.js               # Main game logic
│   ├── sketch.js               # Game setup and rendering logic
│   ├── vehicle.js              # Handles bee movement logic
│   └── vision_bundle.js        # Mediapipe integration
├── libraries/                  # External libraries
│   ├── p5.min.js               # Minified p5.js library
│   └── p5.sound.min.js         # Minified p5.js sound library
├── models/                     # Pretrained models
│   └── hand_landmarker.task    # Mediapipe hand detection model
├── wasm/                       # WebAssembly files
├── game.html                   # Game interface
├── index.html                  # Main entry point for the game
├── README.md                   # Project documentation
└── style.css                   # Game styling
```

## Installation

1. **Install Required Tools**:
   - Install a code editor such as Visual Studio Code.
   - Ensure you have the **Live Server** extension installed.

2. **Run the Game**:
   - Clone the repository:
     ```bash
     git clone https://github.com/rafaelbenaion/bee-experience.git
     ```
   - Navigate to the project directory:
     ```bash
     cd bee-experience
     ```
   - Open the project directory in Visual Studio Code.
   - Open `index.html`.
   - Right-click on the `index.html` file and select **Open with Live Server** to run the game in your browser.


---

## Technologies Used

- **JavaScript**: Main language for development.
- **MediaPipe**: Library for gesture recognition.
- **p5.js**: Used for graphics and game logic.
- **HTML/CSS**: For structure and styling.

---

## Author

This project was designed and developed by **Rafael Baptista** as part of the **Reactive AIs** course at Université Côte d'Azur, led by **Michel Buffa**.
