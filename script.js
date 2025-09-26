class Whiteboard {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.tempCanvas = document.getElementById('temp-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.startX = 0;
        this.startY = 0;

        // Drawing state
        this.color = '#000000';
        this.fillColor = '#000000';
        this.size = 5;
        this.opacity = 1.0;
        this.tool = 'pen';
        this.fillShape = true;

        // History for undo/redo
        this.history = [];
        this.maxHistory = 50;
        this.currentStep = -1;

        // Cursor tracking
        this.cursorX = 0;
        this.cursorY = 0;

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.saveState();
        this.updateUI();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth - 40;
        const height = container.clientHeight - 40;
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.tempCanvas.width = width;
        this.tempCanvas.height = height;
        
        if (this.history.length > 0) {
            this.redrawFromHistory();
        }
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.trackCursor.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // Tool controls
        document.getElementById('color-picker').addEventListener('input', (e) => {
            this.color = e.target.value;
            this.updateUI();
        });

        document.getElementById('fill-color-picker').addEventListener('input', (e) => {
            this.fillColor = e.target.value;
        });

        document.getElementById('fill-shape').addEventListener('change', (e) => {
            this.fillShape = e.target.checked;
        });

        document.getElementById('size-slider').addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            document.getElementById('current-size').textContent = this.size + 'px';
        });

        document.getElementById('opacity-slider').addEventListener('input', (e) => {
            this.opacity = parseInt(e.target.value) / 100;
            document.getElementById('current-opacity').textContent = e.target.value + '%';
        });

        // Tool buttons
        document.getElementById('pen-tool').addEventListener('click', () => this.setTool('pen'));
        document.getElementById('eraser-tool').addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('select-tool').addEventListener('click', () => this.setTool('select'));
        document.getElementById('rectangle-tool').addEventListener('click', () => this.setTool('rectangle'));
        document.getElementById('circle-tool').addEventListener('click', () => this.setTool('circle'));
        document.getElementById('line-tool').addEventListener('click', () => this.setTool('line'));
        document.getElementById('triangle-tool').addEventListener('click', () => this.setTool('triangle'));
        document.getElementById('arrow-tool').addEventListener('click', () => this.setTool('arrow'));
        document.getElementById('star-tool').addEventListener('click', () => this.setTool('star'));

        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                this.clearCanvas();
            }
        });
        document.getElementById('save-btn').addEventListener('click', () => this.saveCanvas());

        window.addEventListener('resize', this.debounce(this.resizeCanvas.bind(this), 250));
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getCoordinates(e);
        [this.lastX, this.lastY] = [pos.x, pos.y];
        [this.startX, this.startY] = [pos.x, pos.y];
        
        if (this.tool === 'pen' || this.tool === 'eraser') {
            this.saveState();
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        e.preventDefault();
        const pos = this.getCoordinates(e);

        // Clear temp canvas for shape preview
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

        if (this.tool === 'pen' || this.tool === 'eraser') {
            this.drawFreehand(pos);
        } else {
            this.drawShapePreview(pos);
        }

        [this.lastX, this.lastY] = [pos.x, pos.y];
    }

    drawFreehand(pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);

        this.setDrawingStyle();
        
        if (this.tool === 'pen') {
            this.ctx.strokeStyle = this.color;
            this.ctx.globalCompositeOperation = 'source-over';
        } else {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.globalCompositeOperation = 'destination-out';
        }

        this.ctx.stroke();
        this.resetDrawingStyle();
    }

    drawShapePreview(pos) {
        this.tempCtx.setLineDash([5, 5]);
        
        switch (this.tool) {
            case 'rectangle':
                this.drawRectangle(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
            case 'circle':
                this.drawCircle(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
            case 'line':
                this.drawLine(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
            case 'triangle':
                this.drawTriangle(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
            case 'arrow':
                this.drawArrow(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
            case 'star':
                this.drawStar(this.tempCtx, this.startX, this.startY, pos.x, pos.y, true);
                break;
        }
        
        this.tempCtx.setLineDash([]);
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        
        // Clear temp canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        
        // For shape tools, draw final shape and save state
        if (this.tool !== 'pen' && this.tool !== 'eraser' && this.tool !== 'select') {
            // Save state BEFORE drawing the final shape
            this.saveState();
            this.drawFinalShape();
        }
        
        this.isDrawing = false;
    }

    drawFinalShape() {
        const endX = this.lastX;
        const endY = this.lastY;
        
        this.setDrawingStyle(this.ctx, false);
        
        switch (this.tool) {
            case 'rectangle':
                this.drawRectangle(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
            case 'circle':
                this.drawCircle(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
            case 'line':
                this.drawLine(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
            case 'triangle':
                this.drawTriangle(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
            case 'arrow':
                this.drawArrow(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
            case 'star':
                this.drawStar(this.ctx, this.startX, this.startY, endX, endY, false);
                break;
        }
        
        this.resetDrawingStyle(this.ctx);
    }

    // Shape drawing methods
    drawRectangle(ctx, startX, startY, endX, endY, isPreview) {
        const width = endX - startX;
        const height = endY - startY;
        
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        this.applyFillAndStroke(ctx, isPreview);
    }

    drawCircle(ctx, startX, startY, endX, endY, isPreview) {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.applyFillAndStroke(ctx, isPreview);
    }

    drawLine(ctx, startX, startY, endX, endY, isPreview) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    drawTriangle(ctx, startX, startY, endX, endY, isPreview) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX * 2 - endX, endY);
        ctx.closePath();
        this.applyFillAndStroke(ctx, isPreview);
    }

    drawArrow(ctx, startX, startY, endX, endY, isPreview) {
        const headLength = 20;
        const angle = Math.atan2(endY - startY, endX - startX);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        // Arrow head
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    drawStar(ctx, startX, startY, endX, endY, isPreview) {
        const spikes = 5;
        const outerRadius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const innerRadius = outerRadius / 2;
        
        ctx.beginPath();
        let rotation = Math.PI / 2 * 3;
        let x, y;
        let step = Math.PI / spikes;

        for (let i = 0; i < spikes; i++) {
            x = startX + Math.cos(rotation) * outerRadius;
            y = startY + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x, y);
            rotation += step;

            x = startX + Math.cos(rotation) * innerRadius;
            y = startY + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x, y);
            rotation += step;
        }
        ctx.closePath();
        this.applyFillAndStroke(ctx, isPreview);
    }

    applyFillAndStroke(ctx, isPreview) {
        if (this.fillShape && !isPreview) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    setDrawingStyle(ctx = this.ctx, isPreview = false) {
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = isPreview ? this.opacity * 0.7 : this.opacity;
    }

    resetDrawingStyle(ctx = this.ctx) {
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.startDrawing(e.touches[0]);
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.draw(e.touches[0]);
    }

    trackCursor(e) {
        const pos = this.getCoordinates(e);
        this.cursorX = Math.round(pos.x);
        this.cursorY = Math.round(pos.y);
        document.getElementById('cursor-position').textContent = `X: ${this.cursorX}, Y: ${this.cursorY}`;
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    setTool(tool) {
        this.tool = tool;
        this.updateUI();
        
        if (tool === 'eraser') {
            this.canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${this.size * 2}" height="${this.size * 2}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="white" stroke="black" stroke-width="2"/></svg>') ${this.size} ${this.size}, auto`;
        } else if (tool === 'select') {
            this.canvas.style.cursor = 'default';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }
    }

    updateUI() {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${this.tool}-tool`).classList.add('active');
        
        const modeNames = {
            'pen': 'Free Drawing',
            'eraser': 'Eraser Tool',
            'select': 'Select Tool',
            'rectangle': 'Rectangle Tool',
            'circle': 'Circle Tool',
            'line': 'Line Tool',
            'triangle': 'Triangle Tool',
            'arrow': 'Arrow Tool',
            'star': 'Star Tool'
        };
        document.getElementById('drawing-mode').textContent = `Mode: ${modeNames[this.tool]}`;
    }

    saveState() {
        if (this.currentStep < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentStep + 1);
        }

        if (this.history.length >= this.maxHistory) {
            this.history.shift();
        }

        this.history.push(this.canvas.toDataURL());
        this.currentStep = this.history.length - 1;
        this.updateButtonStates();
    }

    undo() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.redrawFromHistory();
            this.updateButtonStates();
        }
    }

    redo() {
        if (this.currentStep < this.history.length - 1) {
            this.currentStep++;
            this.redrawFromHistory();
            this.updateButtonStates();
        }
    }

    redrawFromHistory() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = this.history[this.currentStep];
    }

    updateButtonStates() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        undoBtn.disabled = this.currentStep <= 0;
        redoBtn.disabled = this.currentStep >= this.history.length - 1;
        
        undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
        undoBtn.style.cursor = undoBtn.disabled ? 'not-allowed' : 'pointer';
        redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
        redoBtn.style.cursor = redoBtn.disabled ? 'not-allowed' : 'pointer';
    }

    clearCanvas() {
        this.saveState();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.history = [this.canvas.toDataURL()];
        this.currentStep = 0;
        this.updateButtonStates();
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'whiteboard-drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    new Whiteboard('drawing-canvas');
});

// Prevent scrolling on touch devices
document.addEventListener('touchmove', function(e) {
    if (e.target.id === 'drawing-canvas') {
        e.preventDefault();
    }
}, { passive: false });

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    const whiteboard = window.whiteboardInstance;
    if (!whiteboard) return;
    
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        whiteboard.undo();
    }
    
    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        whiteboard.redo();
    }
});

// Make whiteboard instance globally available
window.whiteboardInstance = null;
window.addEventListener('load', () => {
    window.whiteboardInstance = new Whiteboard('drawing-canvas');
});