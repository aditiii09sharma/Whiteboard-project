# 🎨 CanvasShare: Advanced Collaborative Whiteboard

## Project Overview
CanvasShare is an advanced, real-time drawing application built using **HTML5 Canvas**, **CSS Grid/Flexbox**, and **Vanilla JavaScript**. This project is designed to showcase mastery of client-side logic, complex state management, and preparedness for **real-time WebSocket integration**.

The current version includes full single-user drawing functionality, including dynamic tool switching, color/size controls, and a robust Undo/Redo history stack.

---

## 🚀 Core Features & Technologies

### Client-Side Features (Implemented)
* **HTML5 Canvas API Mastery:** Direct manipulation of the Canvas element for pixel-perfect drawing.
* **Robust Undo/Redo:** Implemented using a **State Stack** (array of `toDataURL()` images) to manage drawing history efficiently.
* **Dynamic Toolset:** Supports **Pen** and **Eraser** tools. The Eraser uses the advanced `globalCompositeOperation = 'destination-out'` method for clean erasing.
* **Custom Styling:** Modern UI layout using **Flexbox** and **CSS Custom Properties** (variables).

### Advanced Skills Demonstrated
* **Object-Oriented JavaScript:** The core logic is encapsulated within a `Whiteboard` class for clean, scalable code.
* **Event Handling:** Precise handling of `mousedown`, `mousemove`, and `mouseup` events to create smooth drawing strokes.
* **Performance:** Code is structured to handle continuous drawing events efficiently.

---

## 🛠️ Installation and Setup

This project currently operates as a standalone front-end application. No server is required to test the core drawing features.

### 1. Clone the Repository

```bash
git clone [https://github.com/YourUsername/whiteboard-project.git](https://github.com/YourUsername/whiteboard-project.git)
cd whiteboard-project