// src/components/diffusion/Diffusion.jsx
export default class Diffusion {
    constructor(
        canvas,
        particleCount = 150,
        radius = 4,
        mass = 1,
        temperature = 1
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.particleCount = particleCount;
        this.radius = radius;
        this.mass = mass;
        this.temperature = temperature; // впливає на початкову швидкість
        this.particles = [];

        this.isPaused = false;
        this.animationId = null;

        this.createParticles();
        this.draw = this.draw.bind(this);
        this.start();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const speedFactor = this.temperature / this.mass; // маса впливає на ефективну швидкість
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * speedFactor,
                vy: (Math.random() - 0.5) * speedFactor,
                color: i < this.particleCount / 2 ? "red" : "blue",
                radius: this.radius,
            });
        }
    }

    updateParameters({ particleCount, radius, mass, temperature }) {
        if (particleCount !== undefined) this.particleCount = particleCount;
        if (radius !== undefined) this.radius = radius;
        if (mass !== undefined) this.mass = mass;
        if (temperature !== undefined) this.temperature = temperature;
        this.resetParticles();
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

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            if (!this.isPaused) {
                p.x += p.vx;
                p.y += p.vy;

                // Brownian motion
                p.vx += (Math.random() - 0.5) * 0.1;
                p.vy += (Math.random() - 0.5) * 0.1;

                // Стінки
                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            }

            // Малюємо завжди
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