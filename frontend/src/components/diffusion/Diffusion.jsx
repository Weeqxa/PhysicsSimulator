// src/components/diffusion/Diffusion.jsx
export default class Diffusion {
    constructor(
        canvas,
        redCount = 75,
        blueCount = 75,
        radius = 4,
        mass = 1,
        temperature = 1
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.redCount = redCount;
        this.blueCount = blueCount;

        this.radius = radius;
        this.mass = mass;
        this.temperature = temperature;

        this.gamma = 2;
        this.k = 1;
        this.visualScale = 80;

        this.particles = [];

        this.barrierX = this.canvas.width / 2;
        this.barrierActive = true;

        this.isPaused = false;
        this.animationId = null;
        this.lastTime = null;

        this.createParticles();
        this.draw = this.draw.bind(this);
        this.start();
    }

    setBarrier(active) {
        this.barrierActive = active;
    }

    createParticles() {
        this.particles = [];

        // 🔴 ЧЕРВОНІ (зліва)
        for (let i = 0; i < this.redCount; i++) {
            this.particles.push({
                x: Math.random() * (this.barrierX - 2 * this.radius) + this.radius,
                y: Math.random() * (this.canvas.height - 2 * this.radius) + this.radius,
                vx: 0,
                vy: 0,
                color: "red",
                radius: this.radius,
            });
        }

        // 🔵 СИНІ (справа)
        for (let i = 0; i < this.blueCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas.width - this.barrierX - 2 * this.radius) + this.barrierX + this.radius,
                y: Math.random() * (this.canvas.height - 2 * this.radius) + this.radius,
                vx: 0,
                vy: 0,
                color: "blue",
                radius: this.radius,
            });
        }
    }

    updateParameters({redCount, blueCount, radius, mass, temperature}) {
        if (redCount !== undefined) this.redCount = redCount;
        if (blueCount !== undefined) this.blueCount = blueCount;
        if (radius !== undefined) this.radius = radius;
        if (mass !== undefined) this.mass = mass;
        if (temperature !== undefined) this.temperature = temperature;

        this.createParticles();
    }

    resetParticles() {
        this.createParticles();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }

    draw(timestamp) {
        if (!this.lastTime) {
            this.lastTime = timestamp;
            this.animationId = requestAnimationFrame(this.draw);
            return;
        }

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.02);
        this.lastTime = timestamp;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.barrierActive) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.barrierX, 0);
            ctx.lineTo(this.barrierX, this.canvas.height);
            ctx.stroke();
        }

        for (let p of this.particles) {

            if (!this.isPaused) {

                const ax = -this.gamma * p.vx / this.mass;
                const ay = -this.gamma * p.vy / this.mass;

                const noiseAmplitude = Math.sqrt(
                    2 * this.gamma * this.k * this.temperature / this.mass
                );

                const randomX = noiseAmplitude * Math.sqrt(dt) * (Math.random() - 0.5);
                const randomY = noiseAmplitude * Math.sqrt(dt) * (Math.random() - 0.5);

                p.vx += ax * dt + randomX;
                p.vy += ay * dt + randomY;

                p.x += p.vx * dt * this.visualScale;
                p.y += p.vy * dt * this.visualScale;

                // стіни
                if (p.x < p.radius) { p.x = p.radius; p.vx *= -1; }
                if (p.x > this.canvas.width - p.radius) { p.x = this.canvas.width - p.radius; p.vx *= -1; }
                if (p.y < p.radius) { p.y = p.radius; p.vy *= -1; }
                if (p.y > this.canvas.height - p.radius) { p.y = this.canvas.height - p.radius; p.vy *= -1; }

                // перегородка
                if (this.barrierActive) {
                    if (p.x + p.radius > this.barrierX && p.x - p.radius < this.barrierX) {
                        if (p.vx > 0) {
                            p.x = this.barrierX - p.radius;
                        } else {
                            p.x = this.barrierX + p.radius;
                        }
                        p.vx *= -1;
                    }
                }
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        this.animationId = requestAnimationFrame(this.draw);
    }

    start() {
        this.animationId = requestAnimationFrame(this.draw);
    }
}