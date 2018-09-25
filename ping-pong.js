const PADDLE_HEIGHT = 90;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 11;
let showingWinScreen = false;
let BALL_X_SPEED = 10;
let BALL_Y_SPEED = 15;
let ballXPosition = 400;
let ballYPosition = 300;
let paddle1Y = 270;
let paddle2Y = paddle1Y;
let canvas = null;
let canvasContext = null;
let player1Score = 0;
let player2Score = 0;

window.onload = function name() {
    canvas = document.getElementById('game');
    canvasContext = canvas.getContext('2d')
    const framePerSecond = 30;

    setInterval(() => {
        draw();
        move();
    }, 1000 / framePerSecond)

    canvas.addEventListener('mousemove', function (evt) {
        let mousePosition = setOffset(evt);
        paddle1Y = mousePosition.y - (PADDLE_HEIGHT / 2);
    });

    canvas.addEventListener('click', function (event) {
        if (showingWinScreen) {
            player1Score = player2Score = 0;
            showingWinScreen = false;
        }
    })
}

function setOffset(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function updateScore() {
    canvasContext.fillText(player1Score, 250, 70);
    canvasContext.fillText(player2Score, 550, 70);
}

function autoPaddle() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballYPosition - 25) {
        paddle2Y += 14;
    } else if (paddle2YCenter > ballYPosition + 25) {
        paddle2Y -= 14;
    }
}

function ballReset() {
    if (player1Score >= WINNING_SCORE ||
        player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballXPosition = canvas.width / 2;
    ballYPosition = canvas.height / 2;
}

function drawNet() {
    for (let i = 10; i < canvas.height; i = i + 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function draw() {
    // draw out the screen with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) { // one of them already won
        canvasContext.fillStyle = "white";
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left player won!", 370, 100);
        } else {
            canvasContext.fillText("Right player won!", 370, 100);
        }
        canvasContext.fillText("Click to continue", 370, 400);
        return;
    }
    drawNet();
    // draw out left paddle for player 1
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // draw out left paddle for player 2
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y,
        PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // draw out the ball 
    colorBall(ballXPosition, ballYPosition, PADDLE_THICKNESS, 'white');
}

function move() {
    if (showingWinScreen) { // one of them already won
        return;
    }

    autoPaddle();
    ballXPosition += BALL_X_SPEED;
    ballYPosition += BALL_Y_SPEED;

    if (ballXPosition < PADDLE_THICKNESS) {
        if (ballYPosition >= paddle1Y &&
            ballYPosition <= paddle1Y + PADDLE_HEIGHT) {
            BALL_X_SPEED = -BALL_X_SPEED;
            let deltaY = ballYPosition -
                (paddle1Y + PADDLE_HEIGHT / 2);
            BALL_Y_SPEED = deltaY * 0.40;
        } else {
            player2Score++;
            ballReset();
        }
    }

    if (ballXPosition > canvas.width - PADDLE_THICKNESS) {
        if (ballYPosition >= paddle2Y &&
            ballYPosition <= paddle2Y + PADDLE_HEIGHT) {
            BALL_X_SPEED = -BALL_X_SPEED;
            let deltaY = ballYPosition -
                (paddle2Y + PADDLE_HEIGHT / 2);
            BALL_Y_SPEED = deltaY * 0.40;
        } else {
            player1Score++;
            ballReset();
        }
    }

    if (ballYPosition > canvas.height) {
        BALL_Y_SPEED = -BALL_Y_SPEED;
    }

    if (ballYPosition < 0) {
        BALL_Y_SPEED = -BALL_Y_SPEED;
    }
    updateScore();
}

function colorRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function colorBall(x, y, radio, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radio - 5, 0, Math.PI * 2, true);
    canvasContext.stroke();
    canvasContext.fill();
}
