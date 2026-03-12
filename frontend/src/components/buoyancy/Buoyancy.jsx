export default class Buoyancy {
    constructor(canvas, objectDensity = 0.5, fluidDensity = 1, size = 40, objectData = {}, fluidColor = "rgba(0,150,255,0.5)", shape = "circle") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.objectDensity = objectDensity;
        this.fluidDensity = fluidDensity;

        this.size = Math.max(20, Math.min(size, 80));
        this.shape = shape;
        this.objectColor = objectData.color || "#b19cd9";

        this.objectImage = null;
        if (objectData.image) {
            this.objectImage = new Image();
            this.objectImage.src = objectData.image;
        }

        this.woodHeight = this.size;
        this.woodWidth = this.size * 2.5;
        this.baseWoodOffsets = [];
        this.woodOffsets = [];
        if (this.shape === "wood") {
            this.generateWoodOffsets();
            this.scaleWoodOffsets();
        }

        this.fluidColor = fluidColor;
        this.gravity = 9.8;
        this.dt = 0.016;

        this.x = canvas.width / 2;
        this.fluidSurface = canvas.height / 2;
        this.objectHeight = this.shape === "wood" ? this.woodHeight : 2 * this.size;
        this.y = this.fluidSurface - this.objectHeight / 2 + this.objectHeight * (this.fluidDensity - this.objectDensity) / this.fluidDensity;
        this.vy = 0;

        this.animationId = null;

        this.draw = this.draw.bind(this);
        this.start();
    }

    generateWoodOffsets() {
        const variation = 0.2;
        this.baseWoodOffsets = Array.from({ length: 6 }, () => Math.random() * variation);
    }

    scaleWoodOffsets() {
        const factor = this.size;
        this.woodOffsets = this.baseWoodOffsets.map(o => o * factor);
    }

    updateParameters({ objectDensity, fluidDensity, size, objectColor, fluidColor, shape }) {
        if (objectDensity !== undefined) this.objectDensity = objectDensity;
        if (fluidDensity !== undefined) this.fluidDensity = fluidDensity;

        if (size !== undefined) {
            this.size = Math.max(20, Math.min(size, 80));
            if (this.shape === "wood") {
                this.woodHeight = this.size;
                this.woodWidth = this.size * 2.5;
                this.scaleWoodOffsets();
            }
            this.objectHeight = this.shape === "wood" ? this.woodHeight : 2 * this.size;
        }

        if (objectColor !== undefined) {
            this.objectColor = objectColor.color || objectColor;
            this.shape = objectColor.shape || this.shape;
            if (objectColor.image) {
                this.objectImage = new Image();
                this.objectImage.src = objectColor.image;
            }
        }

        if (fluidColor !== undefined) this.fluidColor = fluidColor;
        if (shape !== undefined) this.shape = shape;
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const fluidSurface = this.canvas.height / 2;

        // ===== НЕБО =====
        const sky = ctx.createLinearGradient(0, 0, 0, fluidSurface);
        sky.addColorStop(0, "#87CEEB");
        sky.addColorStop(1, "#eaf6ff");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, this.canvas.width, fluidSurface);

        // ===== ПАГОРБИ =====
        ctx.beginPath();
        ctx.moveTo(0, fluidSurface - 20);
        ctx.quadraticCurveTo(100, fluidSurface - 60, 200, fluidSurface - 20);
        ctx.quadraticCurveTo(300, fluidSurface - 50, 400, fluidSurface - 20);
        ctx.quadraticCurveTo(500, fluidSurface - 70, 600, fluidSurface - 20);
        ctx.quadraticCurveTo(700, fluidSurface - 40, this.canvas.width, fluidSurface - 20);
        ctx.lineTo(this.canvas.width, fluidSurface);
        ctx.lineTo(0, fluidSurface);
        ctx.closePath();
        ctx.fillStyle = "#6ab04c";
        ctx.fill();

        // ===== ФІЗИКА =====
        let h = this.shape === "wood" ? this.woodHeight : 2 * this.size;
        const bottom = this.y + h / 2;
        const submerged = Math.max(Math.min(bottom - fluidSurface, h), 0);

        const weight = this.objectDensity * h * this.gravity;
        const buoyantForce = this.fluidDensity * submerged * this.gravity;

        const ay = (weight - buoyantForce) / h;
        this.vy += ay * this.dt;
        this.vy *= 0.99;
        this.y += this.vy;

        if (this.y + h / 2 > this.canvas.height) {
            this.y = this.canvas.height - h / 2;
            this.vy = 0;
        }
        if (this.y - h / 2 < 0) {
            this.y = h / 2;
            this.vy = 0;
        }

        // ===== МАЛЮЄМО ПРЕДМЕТ =====
        ctx.beginPath();
        switch (this.shape) {
            case "circle":
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                break;
            case "wood":
                const w = this.woodWidth, o = this.woodOffsets;
                ctx.moveTo(this.x - w / 2, this.y - this.woodHeight / 2 + o[0]);
                ctx.quadraticCurveTo(this.x - w / 4, this.y - this.woodHeight / 2 - o[1], this.x + w / 4, this.y - this.woodHeight / 2 + o[2]);
                ctx.quadraticCurveTo(this.x + w / 2, this.y - this.woodHeight / 2 + o[2], this.x + w / 2, this.y - this.woodHeight / 2 + o[2]);
                ctx.lineTo(this.x + w / 2, this.y + this.woodHeight / 2 - o[5]);
                ctx.quadraticCurveTo(this.x + w / 4, this.y + this.woodHeight / 2 + o[4], this.x - w / 4, this.y + this.woodHeight / 2 - o[3]);
                ctx.quadraticCurveTo(this.x - w / 2, this.y + this.woodHeight / 2 - o[3], this.x - w / 2, this.y + this.woodHeight / 2 - o[3]);
                ctx.closePath();
                break;
            case "stone":
                const stoneW = this.size * 2;
                const stoneH = this.size * 2.5;
                const variation = this.size * 0.15;
                ctx.moveTo(this.x - stoneW/2 + variation/2, this.y + stoneH/2 - variation/2);
                ctx.quadraticCurveTo(this.x - stoneW/2, this.y + stoneH/2, this.x - stoneW/4, this.y + stoneH/2 - variation/2);
                ctx.quadraticCurveTo(this.x + stoneW/4, this.y + stoneH/2 - variation/2, this.x + stoneW/2 - variation/2, this.y + stoneH/2 - variation/2);
                ctx.quadraticCurveTo(this.x + stoneW/2 - variation, this.y + stoneH/4, this.x + stoneW/4, this.y);
                ctx.quadraticCurveTo(this.x + variation, this.y - stoneH/4, this.x, this.y - stoneH/2 + variation/2);
                ctx.quadraticCurveTo(this.x - variation, this.y - stoneH/2 + variation/2, this.x - stoneW/4, this.y - stoneH/4);
                ctx.quadraticCurveTo(this.x - stoneW/2 + variation/2, this.y, this.x - stoneW/2 + variation/2, this.y + stoneH/2 - variation/2);
                ctx.closePath();
                break;
            default:
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }

        if (this.objectImage && this.objectImage.complete) {
            ctx.save();
            ctx.clip();
            ctx.drawImage(
                this.objectImage,
                this.x - (this.shape === "wood" ? this.woodWidth / 2 : this.size),
                this.y - (this.shape === "wood" ? this.woodHeight / 2 : this.size),
                this.shape === "wood" ? this.woodWidth : this.size * 2,
                this.shape === "wood" ? this.woodHeight : this.size * 2
            );
            ctx.restore();
        } else {
            ctx.fillStyle = this.objectColor;
            ctx.fill();
        }

        // ===== РІДИНА =====
        ctx.save();
        ctx.fillStyle = this.fluidColor;
        ctx.fillRect(0, fluidSurface, this.canvas.width, this.canvas.height - fluidSurface);
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, fluidSurface, this.canvas.width, this.canvas.height - fluidSurface);
        ctx.restore();

        this.animationId = requestAnimationFrame(this.draw);
    }

    start() {
        this.animationId = requestAnimationFrame(this.draw);
    }
}