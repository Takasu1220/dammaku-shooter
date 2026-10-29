class Player {
    constructor(canvasWidth, canvasHeight) {
        self.canvasWidth = canvasWidth;
        self.canvasHeight = canvasHeight;
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 80;
        this.radius = 5; // 当たり判定は小さめ
        this.visualRadius = 15;
        this.speed = 4;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;
    }

    update(keys) {
        let dx = 0;
        let dy = 0;

        if (keys['ArrowUp'] || keys['w']) dy -= 1;
        if (keys['ArrowDown'] || keys['s']) dy += 1;
        if (keys['ArrowLeft'] || keys['a']) dx -= 1;
        if (keys['ArrowRight'] || keys['d']) dx += 1;

        // 斜め移動の速度補正
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        // 低速移動 (Shiftキー)
        const currentSpeed = keys['Shift'] ? this.speed * 0.5 : this.speed;

        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;

        // 画面外はみ出し防止
        if (this.x < this.visualRadius) this.x = this.visualRadius;
        if (this.x > this.canvasWidth - this.visualRadius) this.x = this.canvasWidth - this.visualRadius;
        if (this.y < this.visualRadius) this.y = this.visualRadius;
        if (this.y > this.canvasHeight - this.visualRadius) this.y = this.canvasHeight - this.visualRadius;

        // 無敵時間の更新
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }
    }

    draw(ctx, frameCount) {
        // 無敵時の点滅
        if (this.isInvincible && Math.floor(frameCount / 4) % 2 === 0) {
            return;
        }

        // 自機の描画
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.visualRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
        ctx.closePath();

        // コア（当たり判定）の描画
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.closePath();
    }

    hit() {
        if (this.isInvincible) return false;
        this.lives--;
        this.isInvincible = true;
        this.invincibleTimer = 90; // 約1.5秒の無敵
        return true;
    }
}
