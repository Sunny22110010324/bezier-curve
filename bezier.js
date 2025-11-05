class BezierCurveWithMathDisplay {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Control points - FIXED POSITIONS FOR BETTER VISIBILITY
        this.controlPoints = [
            { x: 100, y: 300 },  // P0 - fixed left
            { x: 250, y: 100 },  // P1 - dynamic (more left)
            { x: 550, y: 100 },  // P2 - dynamic (more right)  
            { x: 700, y: 300 }   // P3 - fixed right
        ];
        
        // Physics parameters
        this.springConstant = 0.1;
        this.damping = 0.85;
        this.velocity = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        this.acceleration = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
        
        // Mouse and display
        this.mouse = { x: 400, y: 250, down: false };
        this.currentT = 0.5;
        this.frameCount = 0;
        this.fps = 60;
        this.lastTime = performance.now();
        
        this.setupEventListeners();
        this.animate();
    }
    
    // Bézier curve calculation
    calculatePoint(t) {
        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];
        
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;
        
        const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
        const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
        
        return { x, y };
    }
    
    // Tangent calculation - CORRECT FORMULA
    calculateTangent(t) {
        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];
        
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;
        
        // CORRECT TANGENT FORMULA:
        const dx = 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
        const dy = 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);
        
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        const normalized = magnitude > 0 ? { x: dx / magnitude, y: dy / magnitude } : { x: 0, y: 0 };
        
        return { dx, dy, magnitude, normalized };
    }
    
    // Physics update
    updatePhysics() {
        for (let i = 1; i <= 2; i++) {
            const pointIndex = i - 1;
            const target = this.mouse.down ? this.mouse : { 
                x: this.canvas.width / 2, 
                y: this.canvas.height / 2 
            };
            
            // Spring physics: F = -k*x - damping*v
            const displacement = {
                x: this.controlPoints[i].x - target.x,
                y: this.controlPoints[i].y - target.y
            };
            
            this.acceleration[pointIndex] = {
                x: -this.springConstant * displacement.x - this.damping * this.velocity[pointIndex].x,
                y: -this.springConstant * displacement.y - this.damping * this.velocity[pointIndex].y
            };
            
            this.velocity[pointIndex].x += this.acceleration[pointIndex].x;
            this.velocity[pointIndex].y += this.acceleration[pointIndex].y;
            
            this.controlPoints[i].x += this.velocity[pointIndex].x;
            this.controlPoints[i].y += this.velocity[pointIndex].y;
        }
    }
    
    // Update math display
    updateMathDisplay() {
        // Mouse position and state
        document.getElementById('mousePos').textContent = `(${Math.round(this.mouse.x)}, ${Math.round(this.mouse.y)})`;
        document.getElementById('mouseState').textContent = this.mouse.down ? "Clicking (Strong Physics)" : "No Click (Weak Physics)";
        
        // FPS
        document.getElementById('fps').textContent = `${Math.round(this.fps)} FPS`;
        
        // Control points - ALL VISIBLE NOW
        document.getElementById('p0').textContent = `(${Math.round(this.controlPoints[0].x)}, ${Math.round(this.controlPoints[0].y)})`;
        document.getElementById('p1').textContent = `(${Math.round(this.controlPoints[1].x)}, ${Math.round(this.controlPoints[1].y)})`;
        document.getElementById('p2').textContent = `(${Math.round(this.controlPoints[2].x)}, ${Math.round(this.controlPoints[2].y)})`;
        document.getElementById('p3').textContent = `(${Math.round(this.controlPoints[3].x)}, ${Math.round(this.controlPoints[3].y)})`;
        
        // Bézier point at current t
        const bezierPoint = this.calculatePoint(this.currentT);
        document.getElementById('bezierPoint').textContent = `(${bezierPoint.x.toFixed(1)}, ${bezierPoint.y.toFixed(1)})`;
        document.getElementById('paramT').textContent = this.currentT.toFixed(2);
        document.getElementById('currentT').textContent = this.currentT.toFixed(2);
        
        // Tangent information
        const tangent = this.calculateTangent(this.currentT);
        document.getElementById('tangent').textContent = `(${tangent.dx.toFixed(2)}, ${tangent.dy.toFixed(2)})`;
        document.getElementById('tangentMag').textContent = tangent.magnitude.toFixed(2);
        document.getElementById('normalizedTangent').textContent = `(${tangent.normalized.x.toFixed(2)}, ${tangent.normalized.y.toFixed(2)})`;
        
        // Physics values
        document.getElementById('springK').textContent = this.springConstant;
        document.getElementById('damping').textContent = this.damping;
        document.getElementById('velocity1').textContent = `(${this.velocity[0].x.toFixed(2)}, ${this.velocity[0].y.toFixed(2)})`;
        document.getElementById('velocity2').textContent = `(${this.velocity[1].x.toFixed(2)}, ${this.velocity[1].y.toFixed(2)})`;
        document.getElementById('accel1').textContent = `(${this.acceleration[0].x.toFixed(2)}, ${this.acceleration[0].y.toFixed(2)})`;
        document.getElementById('accel2').textContent = `(${this.acceleration[1].x.toFixed(2)}, ${this.acceleration[1].y.toFixed(2)})`;
        
        // Update tangent formula display with correct values
        this.updateTangentFormulaDisplay(tangent);
        
        // Cycle t for demonstration
        this.currentT = (this.currentT + 0.005) % 1;
    }
    
    // Show the actual tangent calculation with numbers
    updateTangentFormulaDisplay(tangent) {
        const p0 = this.controlPoints[0];
        const p1 = this.controlPoints[1];
        const p2 = this.controlPoints[2];
        const p3 = this.controlPoints[3];
        const t = this.currentT;
        const mt = 1 - t;
        
        // Calculate each term for display
        const term1_x = (3 * mt * mt * (p1.x - p0.x)).toFixed(1);
        const term1_y = (3 * mt * mt * (p1.y - p0.y)).toFixed(1);
        
        const term2_x = (6 * mt * t * (p2.x - p1.x)).toFixed(1);
        const term2_y = (6 * mt * t * (p2.y - p1.y)).toFixed(1);
        
        const term3_x = (3 * t * t * (p3.x - p2.x)).toFixed(1);
        const term3_y = (3 * t * t * (p3.y - p2.y)).toFixed(1);
        
        // Create formula display
        const formulaElement = document.getElementById('tangentFormula');
        if (formulaElement) {
            formulaElement.innerHTML = `
                <strong>Live Calculation at t=${t.toFixed(2)}:</strong><br>
                B'(t) = 3(1-${t.toFixed(2)})²((${p1.x.toFixed(0)},${p1.y.toFixed(0)})-(${p0.x.toFixed(0)},${p0.y.toFixed(0)}))<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 6(1-${t.toFixed(2)})${t.toFixed(2)}((${p2.x.toFixed(0)},${p2.y.toFixed(0)})-(${p1.x.toFixed(0)},${p1.y.toFixed(0)}))<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 3${t.toFixed(2)}²((${p3.x.toFixed(0)},${p3.y.toFixed(0)})-(${p2.x.toFixed(0)},${p2.y.toFixed(0)}))<br>
                <strong>Components:</strong> (${term1_x}+${term2_x}+${term3_x}, ${term1_y}+${term2_y}+${term3_y})<br>
                <strong>Final Tangent:</strong> (${tangent.dx.toFixed(1)}, ${tangent.dy.toFixed(1)})
            `;
        }
    }
    
    // Rendering
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw control lines (gray)
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);
        this.ctx.lineTo(this.controlPoints[1].x, this.controlPoints[1].y);
        this.ctx.lineTo(this.controlPoints[2].x, this.controlPoints[2].y);
        this.ctx.lineTo(this.controlPoints[3].x, this.controlPoints[3].y);
        this.ctx.stroke();
        
        // Draw Bézier curve (blue)
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);
        
        for (let t = 0; t <= 1; t += 0.01) {
            const point = this.calculatePoint(t);
            this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.stroke();
        
        // Draw tangents at multiple points (red)
        for (let t = 0.1; t < 1; t += 0.2) {
            const point = this.calculatePoint(t);
            const tangent = this.calculateTangent(t);
            
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(point.x + tangent.normalized.x * 50, point.y + tangent.normalized.y * 50);
            this.ctx.stroke();
            
            // Tangent points (small red dots)
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw control points - MAKE THEM LARGER AND CLEARER
        const colors = ['#2ecc71', '#e67e22', '#e67e22', '#2ecc71'];
        this.controlPoints.forEach((point, index) => {
            // Draw larger circles
            this.ctx.fillStyle = colors[index];
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add white border for visibility
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Labels - make them more visible
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Courier New';
            this.ctx.fillText(`P${index}`, point.x + 15, point.y - 12);
        });
        
        // 🟡 YELLOW POINT: Moving point along curve
        const demoPoint = this.calculatePoint(this.currentT);
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.beginPath();
        this.ctx.arc(demoPoint.x, demoPoint.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add border to yellow point
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Label for yellow point
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.font = 'bold 14px Courier New';
        this.ctx.fillText(`B(t=${this.currentT.toFixed(2)})`, demoPoint.x + 12, demoPoint.y - 14);
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', () => {
            this.mouse.down = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }
    
    animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= 1000) {
            this.fps = (this.frameCount * 1000) / deltaTime;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        this.updatePhysics();
        this.updateMathDisplay();
        this.draw();
        
        this.frameCount++;
        requestAnimationFrame(() => this.animate());
    }
}

// Start the application
new BezierCurveWithMathDisplay();