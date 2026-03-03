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
        this.temperature = temperature;

        // Фізика
        this.gamma = 2;        // тертя
        this.k = 1;            // умовна стала Больцмана
        this.visualScale = 80; // масштаб для пікселів

        this.particles = [];

        this.isPaused = false;
        this.animationId = null;
        this.lastTime = null;

        this.createParticles();
        this.draw = this.draw.bind(this);
        this.start();
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas.width - 2 * this.radius) + this.radius,
                y: Math.random() * (this.canvas.height - 2 * this.radius) + this.radius,
                vx: 0,
                vy: 0,
                color: i < this.particleCount / 2 ? "red" : "blue",
                radius: this.radius,
            });
        }
    }

    updateParameters({particleCount, radius, mass, temperature}) {
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

    draw(timestamp) {
        if (!this.lastTime) {
            this.lastTime = timestamp;
            this.animationId = requestAnimationFrame(this.draw);
            return;
        }

        // стабільний часовий крок
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.02);
        this.lastTime = timestamp;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {

            if (!this.isPaused) {

                // === Langevin dynamics ===

                // тертя
                const ax = -this.gamma * p.vx / this.mass;
                const ay = -this.gamma * p.vy / this.mass;

                // шум
                const noiseAmplitude = Math.sqrt(
                    2 * this.gamma * this.k * this.temperature / this.mass
                );

                const randomX = noiseAmplitude * Math.sqrt(dt) * (Math.random() - 0.5);
                const randomY = noiseAmplitude * Math.sqrt(dt) * (Math.random() - 0.5);

                // оновлення швидкості
                p.vx += ax * dt + randomX;
                p.vy += ay * dt + randomY;

                // оновлення координат (з масштабуванням)
                p.x += p.vx * dt * this.visualScale;
                p.y += p.vy * dt * this.visualScale;

                // === відбиття від стін ===
                if (p.x < p.radius) {
                    p.x = p.radius;
                    p.vx *= -1;
                }
                if (p.x > this.canvas.width - p.radius) {
                    p.x = this.canvas.width - p.radius;
                    p.vx *= -1;
                }
                if (p.y < p.radius) {
                    p.y = p.radius;
                    p.vy *= -1;
                }
                if (p.y > this.canvas.height - p.radius) {
                    p.y = this.canvas.height - p.radius;
                    p.vy *= -1;
                }
            }

            // малювання
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