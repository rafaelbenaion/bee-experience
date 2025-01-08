# Bee Experience

## Project Description

Bee Experience is an interactive game developed as part of the Reactive AIs course at the Université Côte d'Azur. This project was created by **Rafael Baptista** under the supervision of Professor **Michel Buffa**. The game uses **MediaPipe** technology for gesture recognition, offering a unique and immersive experience. This project explores the use of reactive AIs to create natural interactions between players and the game.

---

## Key Features

- **Gesture Recognition with MediaPipe**:
  - Allows players to control the game using natural gestures.
  - Ensures smooth and intuitive interaction.
- **Immersive Gameplay**:
  - Players embody a bee and must complete various tasks related to collecting nectar and pollination.
- **Interactive Design**:
  - Integrates adaptive game logic based on gesture detection.

---

## How to Play

1. **Prerequisites**:
   - Ensure you have a functional webcam connected to your computer.
   - Install the required dependencies (see the Installation section below).

2. **Starting the Game**:
   - Clone the repository:
     ```bash
     git clone https://github.com/rafaelbenaion/bee-experience.git
     ```
   - Navigate to the directory:
     ```bash
     cd bee-experience
     ```
   - Run the main script:
     ```bash
     python main.py
     ```

3. **Game Controls**:
   - **Raise your left hand**: Move the bee to the left.
   - **Raise your right hand**: Move the bee to the right.
   - **Join both hands**: Collect nectar or perform a specific action in the game.

4. **Objective**:
   - Collect nectar from flowers while avoiding obstacles. Players must maximize their points within a time limit.

---

## Project Structure

The project is organized as follows:

```plaintext
bee-experience/
├── main.py                # Main script to launch the game
├── mediapipe_utils.py     # Utility functions for MediaPipe integration
├── game_logic.py          # Game logic
├── assets/                # Directory containing resources (images, sounds, etc.)
├── models/                # Pretrained AI models
├── README.md              # Project documentation
