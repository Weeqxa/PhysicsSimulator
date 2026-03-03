export default class Spring {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // =========================
        // Фізичні параметри
        // =========================
        this.mass = options.mass ?? 1;
        this.k = options.k ?? 20;
        this.c = options.c ?? 0.5;
        this.nonlinear = options.nonlinear ?? false;
        this.restY = options.restY ?? 120;
        this.y = options.y0 ?? this.restY + 80;
        this.v = 0;

        // =========================
        // Візуальні параметри
        // =========================
        this.coils = options.coils ?? 20;
        this.width = options.width ?? 20;
        this.massColor = options.massColor ?? "#9c81e1";

        // =========================
        // Стан анімації
        // =========================
        this.running = true;
        this.isPaused = false;

        // =========================
        // Drag & Drop
        // =========================
        this.isDragging = false;
        this.offsetY = 0;

        this.handleMouseDown = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            const radius = 10 + Math.sqrt(this.mass) * 5;
            const grabPadding = 25; // новий параметр — додатковий простір для захоплення
            if (Math.abs(mouseY - this.y) < radius + grabPadding) {
                this.isDragging = true;
                this.offsetY = mouseY - this.y;
            }
        };

        this.handleMouseMove = (e) => {
            if (!this.isDragging) return;
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            this.y = mouseY - this.offsetY;
            this.v = 0;
        };

        this.handleMouseUp = () => {
            this.isDragging = false;
        };

        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);

        // =========================
        // Основний цикл
        // =========================
        this.draw = this.draw.bind(this);
        this.start();
    }

    start() {
        this.running = true;
        this.isPaused = false;
        if (!this.animationId) this.animationId = requestAnimationFrame(this.draw);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
    }

    reset() {
        this.y = this.restY + 80;
        this.v = 0;
        this.isPaused = false;
    }

    updateParameters({ mass, k, c, nonlinear, restY, y0, massColor }) {
        if (mass !== undefined) this.mass = mass;
        if (k !== undefined) this.k = k;
        if (c !== undefined) this.c = c;
        if (nonlinear !== undefined) this.nonlinear = nonlinear;
        if (restY !== undefined) this.restY = restY;
        if (y0 !== undefined) this.y = y0;
        if (massColor !== undefined) this.massColor = massColor;
    }

    physics(dt) {
        if (this.isDragging) return; // поки тягнемо, фізика не працює
        const stretch = this.y - this.restY;
        let forceSpring = -this.k * stretch;
        if (this.nonlinear) forceSpring -= 0.02 * stretch ** 3;
        const forceDamping = -this.c * this.v;
        const gravity = 9.81 * this.mass;
        const a = (forceSpring + forceDamping + gravity) / this.mass;
        this.v += a * dt;
        this.y += this.v * dt;
    }

    drawSpring(x1, y1, x2, y2, coils = 20, amplitude = 20) {
        const ctx = this.ctx;
        ctx.beginPath();
        const dy = y2 - y1;
        const steps = 60;
        ctx.moveTo(x1, y1);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = x1 + Math.sin(t * coils * Math.PI * 2) * amplitude;
            const py = y1 + t * dy;
            ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.running && !this.isPaused) this.physics(0.016);

        this.drawSpring(200, 20, 200, this.y - 20);

        const radius = 10 + Math.sqrt(this.mass) * 5;
        ctx.fillStyle = this.massColor;
        ctx.beginPath();
        ctx.arc(200, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        this.animationId = requestAnimationFrame(this.draw);
    }

    destroy() {
        this.stop();
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }
}