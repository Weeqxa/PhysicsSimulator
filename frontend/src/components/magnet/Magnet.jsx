export default class Magnet {

    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

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
        // Великі компаси (3x3)
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

        // =========================
        // Drag магніта
        // =========================
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
    // Магнітне поле
    // =========================
    magneticField(px, py) {
        const dx = px - this.magnet.x;
        const dy = py - this.magnet.y;
        let r2 = dx * dx + dy * dy;
        let r = Math.sqrt(r2);
        if (r < 30) r = 30;
        const factor = this.fieldStrength / (r * r * r);
        return {bx: dx * factor, by: dy * factor};
    }

    // =========================
    // Фізика компасів
    // =========================
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

    // =========================
// Маленькі, але збільшені стрілочки для силових ліній
// =========================
    drawFieldVectors() {
        const ctx = this.ctx;
        const spacing = 60;

        for (let x = spacing; x < this.canvas.width; x += spacing) {
            for (let y = spacing; y < this.canvas.height; y += spacing) {

                const B = this.magneticField(x, y);
                const angle = Math.atan2(B.by, B.bx);

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);

                // верхня половина (темно-сіра)
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(4, 0);
                ctx.lineTo(-4, 0);
                ctx.closePath();
                ctx.fillStyle = "#555";
                ctx.fill();

                // нижня половина (світліший сірий)
                ctx.beginPath();
                ctx.moveTo(0, 8);
                ctx.lineTo(4, 0);
                ctx.lineTo(-4, 0);
                ctx.closePath();
                ctx.fillStyle = "#888";
                ctx.fill();

                ctx.restore();
            }
        }
    }

    // =========================
    // Вертикальний магніт (заокруглений)
    // =========================
    drawMagnet() {
        const ctx = this.ctx;
        const {x, y, width, height} = this.magnet;
        const radius = 10; // радіус заокруглення

        // Північний полюс (червоний)
        ctx.fillStyle = "#ff4444";
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x - width / 2, y - height / 2, width, height / 2, radius);
            ctx.fill();
        } else {
            // fallback для браузерів без roundRect
            ctx.beginPath();
            ctx.moveTo(x - width / 2 + radius, y - height / 2);
            ctx.lineTo(x + width / 2 - radius, y - height / 2);
            ctx.quadraticCurveTo(x + width / 2, y - height / 2, x + width / 2, y - height / 2 + radius);
            ctx.lineTo(x + width / 2, y - height / 2 + height / 2 - radius);
            ctx.quadraticCurveTo(x + width / 2, y - height / 2 + height / 2, x + width / 2 - radius, y - height / 2 + height / 2);
            ctx.lineTo(x - width / 2 + radius, y - height / 2 + height / 2);
            ctx.quadraticCurveTo(x - width / 2, y - height / 2 + height / 2, x - width / 2, y - height / 2 + height / 2 - radius);
            ctx.lineTo(x - width / 2, y - height / 2 + radius);
            ctx.quadraticCurveTo(x - width / 2, y - height / 2, x - width / 2 + radius, y - height / 2);
            ctx.closePath();
            ctx.fill();
        }

        // Південний полюс (синій)
        ctx.fillStyle = "#4444ff";
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x - width / 2, y, width, height / 2, radius);
            ctx.fill();
        } else {
            // можна зробити аналогічно вручну через криві
            ctx.beginPath();
            ctx.moveTo(x - width / 2 + radius, y);
            ctx.lineTo(x + width / 2 - radius, y);
            ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + height / 2 - radius);
            ctx.lineTo(x + width / 2, y + height / 2 - radius);
            ctx.quadraticCurveTo(x + width / 2, y + height / 2, x + width / 2 - radius, y + height / 2);
            ctx.lineTo(x - width / 2 + radius, y + height / 2);
            ctx.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height / 2 - radius);
            ctx.lineTo(x - width / 2, y + radius);
            ctx.quadraticCurveTo(x - width / 2, y, x - width / 2 + radius, y);
            ctx.closePath();
            ctx.fill();
        }

        // Маркування полюсів
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("N", x - 6, y - 30);
        ctx.fillText("S", x - 6, y + 40);
    }

    // =========================
    // Великі компаси
    // =========================
    drawCompasses() {
        this.compasses.forEach(c => {
            const ctx = this.ctx;
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angle);

            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(8, 0);
            ctx.lineTo(-8, 0);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, 20);
            ctx.lineTo(8, 0);
            ctx.lineTo(-8, 0);
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.fill();

            ctx.restore();

            ctx.beginPath();
            ctx.arc(c.x, c.y, 25, 0, Math.PI * 2);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });
    }

    // =========================
    // Основний малюнок
    // =========================
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.physics(0.016);

        this.drawFieldVectors(); // силові лінії
        this.drawMagnet();
        this.drawCompasses();    // великі компаси

        this.animationId = requestAnimationFrame(this.draw);
    }

    start() {
        if (!this.animationId) this.animationId = requestAnimationFrame(this.draw);
    }

    updateParameters({fieldStrength, damping, inertia}) {
        if (fieldStrength !== undefined) this.fieldStrength = fieldStrength;
        if (damping !== undefined) this.damping = damping;
        if (inertia !== undefined) this.inertia = inertia;
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }
}