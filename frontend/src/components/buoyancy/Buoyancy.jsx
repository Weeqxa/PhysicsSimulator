export default class Buoyancy {
    constructor(canvas, objectDensity = 0.5, fluidDensity = 1, size = 40, objectData = {}, fluidColor = "rgba(0,150,255,0.5)", shape = "circle") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.objectDensity = objectDensity;
        this.fluidDensity = fluidDensity;

        // обмеження розміру
        this.size = Math.max(20, Math.min(size, 80));

        this.shape = shape;
        this.objectColor = objectData.color || "#b19cd9";

        this.objectImage = null;
        if (objectData.image) {
            this.objectImage = new Image();
            this.objectImage.src = objectData.image;
        }

        // =====================
        // Параметри для дерева
        // =====================
        this.woodHeight = this.size;
        this.woodWidth = this.size * 2.5;

        // offsets зберігаємо як **базові значення**, щоб масштабувати
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
        this.y = this.size;
        this.vy = 0;

        this.isPaused = false;
        this.animationId = null;

        this.draw = this.draw.bind(this);
        this.start();
    }

    // =====================
    // Генеруємо **базові offsets дерева**
    // =====================
    generateWoodOffsets() {
        const variation = 0.2; // відносно базового розміру
        this.baseWoodOffsets = [
            Math.random() * variation,
            Math.random() * variation,
            Math.random() * variation,
            Math.random() * variation,
            Math.random() * variation,
            Math.random() * variation
        ];
    }

    // =====================
    // Масштабуємо offsets дерева при зміні size
    // =====================
    scaleWoodOffsets() {
        const factor = this.size; // масштабування від current size
        this.woodOffsets = this.baseWoodOffsets.map(o => o * factor);
    }

    // =====================
    // Оновлення параметрів
    // =====================
    updateParameters({objectDensity, fluidDensity, size, objectColor, fluidColor, shape}) {
        if (objectDensity !== undefined) this.objectDensity = objectDensity;
        if (fluidDensity !== undefined) this.fluidDensity = fluidDensity;

        if (size !== undefined) {
            this.size = Math.max(20, Math.min(size, 80));
            if (this.shape === "wood") {
                this.woodHeight = this.size;
                this.woodWidth = this.size * 2.5;
                this.scaleWoodOffsets(); // масштабуємо offsets, не генеруємо заново
            }
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

    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
    stop() { cancelAnimationFrame(this.animationId); }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const fluidSurface = this.canvas.height / 2;

        // ======================
        // малюємо рідину
        // ======================
        ctx.fillStyle = this.fluidColor;
        ctx.fillRect(0, fluidSurface, this.canvas.width, this.canvas.height / 2);

        // ======================
        // фізика занурення
        // ======================
        if (!this.isPaused) {
            let h = this.shape === "wood" ? this.woodHeight : 2 * this.size;
            const bottom = this.y + h / 2;
            const submerged = Math.max(Math.min(bottom - fluidSurface, h), 0);

            const weight = this.objectDensity * h * this.gravity;
            const buoyantForce = this.fluidDensity * submerged * this.gravity;

            const ay = (weight - buoyantForce) / h;
            this.vy += ay * this.dt;
            this.vy *= 0.99;
            this.y += this.vy;

            if (this.y + h / 2 > this.canvas.height) { this.y = this.canvas.height - h / 2; this.vy = 0; }
            if (this.y - h / 2 < 0) { this.y = h / 2; this.vy = 0; }
        }

        // ======================
        // малюємо предмет
        // ======================
        ctx.beginPath();
        switch (this.shape) {
            case "circle":
                ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
                break;

            case "wood":
                const w = this.woodWidth;
                const h = this.woodHeight;
                const o = this.woodOffsets;

                ctx.moveTo(this.x - w / 2, this.y - h / 2 + o[0]);
                ctx.quadraticCurveTo(this.x - w / 4, this.y - h / 2 - o[1], this.x + w / 4, this.y - h / 2 + o[2]);
                ctx.quadraticCurveTo(this.x + w / 2, this.y - h / 2 + o[2], this.x + w / 2, this.y - h / 2 + o[2]);
                ctx.lineTo(this.x + w / 2, this.y + h / 2 - o[5]);
                ctx.quadraticCurveTo(this.x + w / 4, this.y + h / 2 + o[4], this.x - w / 4, this.y + h / 2 - o[3]);
                ctx.quadraticCurveTo(this.x - w / 2, this.y + h / 2 - o[3], this.x - w / 2, this.y + h / 2 - o[3]);
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
                ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        }

        if (this.objectImage && this.objectImage.complete) {
            ctx.save();
            ctx.clip();
            ctx.drawImage(
                this.objectImage,
                this.x - (this.shape==="wood"? this.woodWidth/2 : this.size),
                this.y - (this.shape==="wood"? this.woodHeight/2 : this.size),
                this.shape==="wood"? this.woodWidth : this.size*2,
                this.shape==="wood"? this.woodHeight : this.size*2
            );
            ctx.restore();
        } else {
            ctx.fillStyle = this.objectColor;
            ctx.fill();
        }

        this.animationId = requestAnimationFrame(this.draw);
    }

    start() { this.animationId = requestAnimationFrame(this.draw); }
}