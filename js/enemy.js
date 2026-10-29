class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.radius = 20;
        this.frameCount = 0;

        if (type === 'boss') {
            this.hp = 200;
            this.maxHp = 200;
            this.radius = 35;
            this.targetX = 240;
            this.targetY = 150;
        } else {
            this.hp = 5;
            this.targetX = x;
            this.targetY = y + 100;
        }
    }

    update(playerX, playerY, bullets) {
        this.frameCount++;

        // 移動ロジック
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;

        // 弾幕攻撃
        if (this.type === 'normal') {
            if (this.frameCount % 45 === 0) {
                // プレイヤー方向への3Way弾
                const angleToPlayer = Math.atan2(playerY - this.y, playerX - this.x);
                const spread = 0.2;
                for (let i = -1; i <= 1; i++) {
                    bullets.push(new Bullet(this.x, this.y, angleToPlayer + i * spread, 3, 5, '#ff4444'));
                }
            }
        } else if (this.type === 'boss') {
            // ボスの複雑な弾幕パターン
            if (this.frameCount % 200 < 100) {
                // パターン1: 渦巻き弾幕
                if (this.frameCount % 4 === 0) {
                    const baseAngle = (this.frameCount * 0.08);
                    const arms = 4;
                    for (let i = 0; i < arms; i++) {
                        const angle = baseAngle + (i * Math.PI * 2 / arms);
                        bullets.push(new Bullet(this.x, this.y, angle, 2.5, 6, '#ff00ff'));
                    }
                }
            } else {
                // パターン2: 全方位リング弾幕
                if (this.frameCount % 30 === 0) {
                    const count = 16;
                    const offset = Math.random() * Math.PI;
                    for (let i = 0; i < count; i++) {
                        const angle = offset + (i * Math.PI * 2 / count);
                        bullets.push(new Bullet(this.x, this.y, angle, 3.5, 5, '#ffcc00'));
                    }
                }
            }

            // 定期的に移動先を変更
            if (this.frameCount % 120 === 0) {
                this.targetX = 100 + Math.random() * 280;
                this.targetY = 80 + Math.random() * 120;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.type === 'boss') {
            ctx.fillStyle = '#ff3333';
            ctx.fill();
            // ボスHPバーの描画
            ctx.closePath();
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(40, 10, (400) * (this.hp / this.maxHp), 8);
            return;
        } else {
            ctx.fillStyle = '#cc33ff';
            ctx.fill();
        }
        ctx.closePath();
    }

    hit(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.active = false;
            return true;
        }
        return false;
    }
}
