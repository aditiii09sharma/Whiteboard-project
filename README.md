# Advanced Collaborative Whiteboard

A feature-rich, interactive whiteboard application built with HTML5 Canvas that allows users to draw, create shapes, and collaborate in real-time.

## Features

### 🎨 Drawing Tools
- **Pen Tool**: Freehand drawing with customizable size and opacity
- **Eraser Tool**: Remove parts of your drawing with adjustable eraser size
- **Select Tool**: For future selection functionality

### 🔷 Shape Tools
- **Rectangle**: Draw rectangles with optional fill
- **Circle**: Create perfect circles and ovals
- **Line**: Straight lines with arrowhead options
- **Triangle**: Equilateral triangles
- **Arrow**: Directional arrows with customizable heads
- **Star**: Five-pointed stars with adjustable proportions

### 🎯 Customization Options
- **Color Picker**: Choose any color for strokes
- **Fill Color**: Separate color picker for shape filling
- **Fill Toggle**: Enable/disable shape filling
- **Brush Size**: Adjustable from 1px to 50px
- **Opacity Control**: 10% to 100% transparency

### ⚡ Productivity Features
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Clear Canvas**: One-click canvas clearing with confirmation
- **Save Image**: Export your drawing as PNG
- **Cursor Tracking**: Real-time cursor position display
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### ⌨️ Keyboard Shortcuts
- `Ctrl + Z`: Undo last action
- `Ctrl + Y`: Redo last action

## Installation

No installation required! Simply open the `index.html` file in any modern web browser.

### Quick Start
1. Download the HTML file
2. Open it in your web browser
3. Start drawing!

## Usage

### Basic Drawing
1. Select the **Pen Tool** from the toolbar
2. Choose your desired color and brush size
3. Click and drag on the canvas to draw

### Creating Shapes
1. Select any shape tool (Rectangle, Circle, etc.)
2. Click and drag on the canvas to define the shape size
3. Release to place the shape permanently

### Using the Eraser
1. Select the **Eraser Tool**
2. Adjust the size if needed
3. Click and drag over areas you want to remove

### Saving Your Work
1. Click the **Save** button in the action panel
2. Your drawing will be downloaded as a PNG file

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Architecture
- Built with vanilla JavaScript (no external dependencies)
- Uses HTML5 Canvas for rendering
- Implements efficient state management for undo/redo functionality
- Responsive design with CSS Grid and Flexbox

### Performance Features
- Dual canvas system (main canvas + temporary preview canvas)
- Limited history size (50 steps) to prevent memory issues
- Debounced resize handling for smooth window resizing
- Efficient touch event handling for mobile devices

## File Structure

```
whiteboard.html          # Main application file
```

## Customization

### Adding New Tools
To add a new drawing tool:

1. Add a button to the toolbar HTML
2. Add event listener in the `setupEventListeners()` method
3. Implement drawing logic in the `drawFinalShape()` method
4. Add preview logic in the `drawShapePreview()` method

### Modifying Styles
The application uses CSS custom properties for easy theming. Key variables:

```css
:root {
    --primary-color: #3f51b5;    /* Main theme color */
    --secondary-color: #ff4081;  /* Accent color */
    --background-color: #f4f7f9; /* Page background */
    --canvas-bg: #ffffff;        /* Canvas background */
    --toolbar-bg: #2c3e50;      /* Toolbar background */
}
```

## Troubleshooting

### Common Issues

**Shapes disappear after drawing:**
- Ensure you're using the latest version of the code
- Check browser console for errors

**Undo/Redo not working:**
- Verify browser supports Canvas API
- Check if JavaScript is enabled

**Touch not working on mobile:**
- Ensure you're using a touch-enabled device
- Try refreshing the page

### Performance Tips
- Use smaller brush sizes for better performance
- Clear the canvas periodically if working on large drawings
- Close other browser tabs if experiencing lag

## Future Enhancements

Planned features for future versions:
- Real-time collaboration
- Layer support
- Text tool
- Image import
- Custom brushes
- Export to SVG/PDF formats
- Shape editing capabilities

## Contributing

This is a standalone project. Feel free to modify and enhance according to your needs.

## License

Open source - feel free to use for personal or educational purposes.

---

**Enjoy creating with the Advanced Collaborative Whiteboard!** 🎨✨