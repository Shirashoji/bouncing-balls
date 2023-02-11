// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// function to generate random color

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.exists = true;
    }
}

class Ball extends Shape {
    constructor(x, y, dx, dy, color, size) {
        super(x, y, dx, dy);
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if ((this.x + this.size) >= width) {
            this.x = width - this.size;
            this.dx = -(this.dx);
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
            this.dx = -(this.dx);
        }

        if ((this.y + this.size) >= height) {
            this.y = height - this.size;
            this.dy = -(this.dy);
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
            this.dy = -(this.dy);
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball) && ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }
}

class Player extends Shape {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.color = 'white';
        this.size = 10;
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                case 'a':
                    this.x -= this.dx;
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                case 'd':
                    this.x += this.dx;
                    break;
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                case 'w':
                    this.y -= this.dy;
                    break;
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                case 's':
                    this.y += this.dy;
                    break;
            }
        });
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x = width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y = height - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }
    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                }
            }
        }
    }
}

let balls = [];

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
    );

    balls.push(ball);
}

let playerBall = new Player(random(0, width), random(0, height));

function loop() {
    width = window.innerWidth;
    height = window.innerHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    let count = 0;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
            count++;
        }
    }
    document.getElementsByTagName('p')[0].innerHTML = `Ball count: ${count}`;
    playerBall.draw();
    playerBall.checkBounds();
    playerBall.collisionDetect();
    requestAnimationFrame(loop);
}


loop();