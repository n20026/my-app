import React from 'react';

function App() {
	return(
		<h1>ブロック崩し</h1>
	);
}

const canvas = document.createElement('Canvas');
const ctx = canvas.getContext('2d');
	
canvas.width = 550;
canvas.height = 550;
	
canvas.setAttribute('style', 'display:block;margin:auto;background-color: #ddd');

document.body.appendChild(canvas);


const ball = {
	x: null,
	y: null,
	width: 10,
	height: 10,
	speed: 2,
	dx: null,
	dy: null,

	update: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.fillStyle = 'blue';

		if(this.x < 0 || this.x > canvas.width) this.dx *= -1;
		if(this.y < 0) this.dy *= -1;
		else if(this.y > canvas.height) {
			alert('ゲームオーバー！');
			document.location.reload();
		}

		this.x += this.dx;
		this.y += this.dy;
	}
}
const paddle = {
	x: null,
	y: null,
	width: 100,
	height: 15,
	speed: 0,

	update: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.fillStyle = 'green';

		this.x += this.speed;
	}
}
const block = {
	width: null,
	height: 20,
	data: [],

	update: function() {
		this.data.forEach(brick => {
			ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
			ctx.stroke();
			ctx.strokeStyle = 'red';
		})
	}
	
}
const level = [
	[0,0,0,0,0],
	[0,0,0,0,0],
	[1,1,1,1,1],
	[1,1,1,1,1],
	[1,1,1,1,1],
	[1,1,1,1,1],
]


const init = () => {
	paddle.x = canvas.width / 2 - paddle.width / 2;
	paddle.y = canvas.height - paddle.height;

	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2 + 50;
	ball.dx = ball.speed;
	ball.dy = ball.speed;

	block.width = canvas.width / level[0].length;

	for(let i=0; i<level.length; i++) {
		for(let j=0; j<level[i].length; j++) {
			if(level[i][j]) {

				block.data.push({
					x: block.width * j,
					y: block.height * i,
					width: block.width,
					height: block.height,
				})
			}
		}
	}
}
const collide = (obj1, obj2) => {
	return obj1.x < obj2.x + obj2.width &&
	       obj2.x < obj1.x + obj1.width &&
	       obj1.y < obj2.y + obj2.height &&
	       obj2.y < obj1.y + obj1.height;
}
const loop = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);

	paddle.update();
	ball.update();
	block.update();

	if(collide(ball, paddle)) {
		ball.dy *= -1;
		ball.y = paddle.y - ball.height;
	}

	block.data.forEach((brick, index) => {
		if(collide(ball, brick)) {
			ball.dy *= -1.1;
			block.data.splice(index,1);
		}
	})

	if (block.data.length === 0) {
		alert('ゲームクリア！');
		document.location.reload();
	}

	window.requestAnimationFrame(loop);
}

init();
loop();


document.addEventListener('keydown', e => {
	if(e.key === 'ArrowLeft') paddle.speed = -6;
	if(e.key === 'ArrowRight') paddle.speed = 6;
});
document.addEventListener('keyup', () => paddle.speed = 0);


export default App;
