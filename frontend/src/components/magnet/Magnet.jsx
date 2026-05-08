export default class Magnet {

    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // THEME
        this.theme = options.theme ?? "dark";

        // =========================
        // Вертикальний магніт
        // =========================
        this.magnet = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 40,
            height: 120
        };

        this.fieldStrength = options.fieldStrength ?? 3000;
        this.damping = options.damping ?? 0.9;
        this.inertia = options.inertia ?? 0.15;

        // =========================
        // Компаси
        // =========================
        this.compasses = [];
        const rows = 3;
        const cols = 3;
        const paddingX = 120;
        const paddingY = 120;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = paddingX + i * ((canvas.width - 2 * paddingX) / (cols - 1));
                const y = paddingY + j * ((canvas.height - 2 * paddingY) / (rows - 1));

                this.compasses.push({
                    x,
                    y,
                    angle: 0,
                    angularVelocity: 0
                });
            }
        }

        // drag
        this.dragging = false;

        this.handleMouseDown = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            if (
                x > this.magnet.x - this.magnet.width / 2 &&
                x < this.magnet.x + this.magnet.width / 2 &&
                y > this.magnet.y - this.magnet.height / 2 &&
                y < this.magnet.y + this.magnet.height / 2
            ) {
                this.dragging = true;
            }
        };

        this.handleMouseMove = (e) => {
            if (!this.dragging) return;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            this.magnet.x = (e.clientX - rect.left) * scaleX;
            this.magnet.y = (e.clientY - rect.top) * scaleY;
        };

        this.handleMouseUp = () => {
            this.dragging = false;
        };

        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);

        this.draw = this.draw.bind(this);
        this.start();
    }

    // =========================
    // THEME COLORS
    // =========================
    getColors() {
        const isLight = this.theme === "light";

        return {
            magnetN: isLight ? "#d83a3a" : "#ff4444",
            magnetS: isLight ? "#3b66ff" : "#4444ff",

            fieldTop: isLight ? "#444" : "#555",
            fieldBottom: isLight ? "#777" : "#888",

            compassStroke: isLight ? "#444444" : "#fff",
            text: isLight ? "#111" : "#fff"
        };
    }

    // =========================
    magneticField(px, py) {
        const dx = px - this.magnet.x;
        const dy = py - this.magnet.y;
        let r2 = dx * dx + dy * dy;
        let r = Math.sqrt(r2);
        if (r < 30) r = 30;

        const factor = this.fieldStrength / (r * r * r);
        return { bx: dx * factor, by: dy * factor };
    }

    physics(dt) {
        this.compasses.forEach(c => {
            const B = this.magneticField(c.x, c.y);
            const targetAngle = Math.atan2(B.by, B.bx) + Math.PI;

            let diff = targetAngle - c.angle;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));

            c.angularVelocity += diff * this.inertia;
            c.angularVelocity *= this.damping;
            c.angle += c.angularVelocity * dt * 60;
        });
    }

    drawFieldVectors() {
        const ctx = this.ctx;
        const colors = this.getColors();
        const spacing = 60;

        for (let x = spacing; x < this.canvas.width; x += spacing) {
            for (let y = spacing; y < this.canvas.height; y += spacing) {

                const B = this.magneticField(x, y);
                const angle = Math.atan2(B.by, B.bx);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(4, 0);
                ctx.lineTo(-4, 0);
                ctx.closePath();
                ctx.fillStyle = colors.fieldTop;
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(0, 8);
                ctx.lineTo(4, 0);
                ctx.lineTo(-4, 0);
                ctx.closePath();
                ctx.fillStyle = colors.fieldBottom;
                ctx.fill();

                ctx.restore();
            }
        }
    }

    drawMagnet() {
        const ctx = this.ctx;
        const colors = this.getColors();

        const { x, y, width, height } = this.magnet;
        const radius = 10;

        // N
        ctx.fillStyle = colors.magnetN;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height / 2, radius);
        ctx.fill();

        // S
        ctx.fillStyle = colors.magnetS;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y, width, height / 2, radius);
        ctx.fill();

        ctx.fillStyle = colors.text;
        ctx.font = "16px Arial";
        ctx.fillText("N", x - 6, y - 30);
        ctx.fillText("S", x - 6, y + 40);
    }

    drawCompasses() {
        const ctx = this.ctx;
        const colors = this.getColors();

        this.compasses.forEach(c => {
            const radius = 25;

            ctx.save();
            ctx.translate(c.x, c.y);

            // =========================
            // BACKGROUND CIRCLE (НОВЕ)
            // =========================
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);

            ctx.fillStyle =
                this.theme === "light"
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(30, 30, 30, 0.6)";

            ctx.fill();

            ctx.strokeStyle = colors.compassStroke;
            ctx.lineWidth = 2;
            ctx.stroke();

            // =========================
            // NEEDLE
            // =========================
            ctx.rotate(c.angle);

            // TOP (N)
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(7, 0);
            ctx.lineTo(-7, 0);
            ctx.closePath();
            ctx.fillStyle = "#ff4444";
            ctx.fill();

            // BOTTOM (S)
            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.lineTo(7, 0);
            ctx.lineTo(-7, 0);
            ctx.closePath();
            ctx.fillStyle = "#4444ff";
            ctx.fill();

            ctx.restore();

            // =========================
            // CENTER DOT
            // =========================
            ctx.beginPath();
            ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = colors.compassStroke;
            ctx.fill();
        });
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.physics(0.016);

        this.drawFieldVectors();
        this.drawMagnet();
        this.drawCompasses();

        this.animationId = requestAnimationFrame(this.draw);
    }

    start() {
        if (!this.animationId) this.animationId = requestAnimationFrame(this.draw);
    }

    updateParameters({ fieldStrength, damping, inertia, theme }) {
        if (fieldStrength !== undefined) this.fieldStrength = fieldStrength;
        if (damping !== undefined) this.damping = damping;
        if (inertia !== undefined) this.inertia = inertia;
        if (theme !== undefined) this.theme = theme;
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }
}