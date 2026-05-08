export default class Pendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.angle = Math.PI / 4;
        this.velocity = 0;
        this.acceleration = 0;

        this.length = 150;
        this.g = 0.5;
        this.damping = 0.01;

        this.isPaused = false;
        this.animationId = null;

        this.draw = this.draw.bind(this);
        this.start();
    }

    // =========================
    // THEME COLORS
    // =========================
    getColors() {
        const theme = document.documentElement.getAttribute("data-theme");

        return {
            bob: theme === "dark" ? "#9c81e1" : "#3b82f6",
            string: theme === "dark"
                ? "rgba(255,255,255,0.8)"
                : "rgba(0,0,0,0.7)"
        };
    }

    start() {
        this.animationId = requestAnimationFrame(this.draw);
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }

    updateParameters({ length, g, damping }) {
        if (length !== undefined) this.length = length;
        if (g !== undefined) this.g = g;
        if (damping !== undefined) this.damping = damping;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    reset() {
        this.angle = Math.PI / 4;
        this.velocity = 0;
        this.isPaused = false;
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const colors = this.getColors();

        const originX = this.canvas.width / 2;
        const originY = 50;

        const x = originX + this.length * Math.sin(this.angle);
        const y = originY + this.length * Math.cos(this.angle);

        // Стрижень
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x, y);

        ctx.strokeStyle = colors.string;
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        ctx.shadowBlur = 10;
        ctx.stroke();

        // ГРУША (🎯 ТЕПЕР ЗМІННА)
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = colors.bob;
        ctx.fill();

        // Фізика
        if (!this.isPaused) {
            this.acceleration =
                -(this.g / this.length) * Math.sin(this.angle) -
                this.damping * this.velocity;

            this.velocity += this.acceleration;
            this.angle += this.velocity;
        }

        this.animationId = requestAnimationFrame(this.draw);
    }
}