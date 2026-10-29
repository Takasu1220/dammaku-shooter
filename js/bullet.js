class Bullet {
    constructor(x, y, angle, speed, radius, color, isPlayerBullet = false) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = radius;
        this.color = color;
        this.isPlayerBullet = isPlayerBullet;
        this.active = true;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // 画面外に出たら無効化
        if (this.x < -20 || this.x > canvasWidth + 20 || this.y < -20 || this.y > canvasHeight + 20) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
