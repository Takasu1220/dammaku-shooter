const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let player;
let bullets = [];
let enemies = [];
let score = 0;
let frameCount = 0;
let keys = {};
let gameOver = false;

function init() {
    player = new Player(canvas.width, canvas.height);
    bullets = [];
    enemies = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
    scoreEl.textContent = score;
    livesEl.textContent = player.lives;
    gameOverScreen.classList.add('hidden');
}

window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });
restartBtn.addEventListener('click', () => {
    init();
    animate();
});

function checkCollision(obj1, obj2) {
    const dist = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
    return dist < (obj1.radius + obj2.radius);
}

function spawnEnemies() {
    // 雑魚敵の定期スポーン
    if (frameCount % 100 === 0 && frameCount < 1000) {
        enemies.push(new Enemy(Math.random() * (canvas.width - 40) + 20, -20, 'normal'));
    }
    // ボスのスポーン
    if (frameCount === 1100) {
        enemies.push(new Enemy(canvas.width / 2, -50, 'boss'));
    }
}

function animate() {
    if (gameOver) return;

    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景演出（簡易的な星）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for(let i = 0; i < 5; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    spawnEnemies();

    // 自機のショット
    if ((keys[' '] || keys['z']) && frameCount % 6 === 0) {
        bullets.push(new Bullet(player.x, player.y - 10, -Math.PI / 2, 8, 4, '#00ffff', true));
    }

    // 自機の更新と描画
    player.update(keys);
    player.draw(ctx, frameCount);

    // 敵の更新と描画
    enemies.forEach((enemy, eIndex) => {
        enemy.update(player.x, player.y, bullets);
        enemy.draw(ctx);

        // 自機と敵の直接衝突
        if (checkCollision(player, enemy)) {
            if (player.hit()) {
                livesEl.textContent = player.lives;
                if (player.lives <= 0) {
                    endGame();
                }
            }
        }
    });

    // 弾の更新と描画・衝突判定
    bullets.forEach((bullet, bIndex) => {
        bullet.update(canvas.width, canvas.height);
        bullet.draw(ctx);

        if (!bullet.active) return;

        if (bullet.isPlayerBullet) {
            // 自機の弾が敵に当たるか
            enemies.forEach((enemy, eIndex) => {
                if (checkCollision(bullet, enemy)) {
                    bullet.active = false;
                    if (enemy.hit(1)) {
                        score += enemy.type === 'boss' ? 5000 : 100;
                        scoreEl.textContent = score;
                        enemies.splice(eIndex, 1);
                    }
                }
            });
        } else {
            // 敵の弾が自機に当たるか
            if (checkCollision(bullet, player)) {
                bullet.active = false;
                if (player.hit()) {
                    livesEl.textContent = player.lives;
                    if (player.lives <= 0) {
                        endGame();
                    }
                }
            }
        }
    });

    // アクティブでない弾のクリーンアップ
    bullets = bullets.filter(b => b.active);

    requestAnimationFrame(animate);
}

function endGame() {
    gameOver = true;
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// 開始
init();
animate();
