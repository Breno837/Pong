var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
  // metodo  requestAnimationFrame
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
// canvas e contexto 2d
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};
//assimilar o canvas a janela
var step = function() {
  update();
  render();
  animate(step);
};
// declarada a função step
var update = function() {
};
var render = function() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
};
//Retangulo Preto
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}
Paddle.prototype.render = function() {
  context.fillStyle = "#FFFAFA";
  context.fillRect(this.x, this.y, this.width, this.height);
};
// Pedais
function Player() {
   this.paddle = new Paddle(175, 580, 50, 10);
}
function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}
//Setamos as posições
Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};
// So pra renderizar
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FFFAFA";
  context.fill();
};
//Bola
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};
// Fim dos objetos
var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};
// Movimento da bola
var update = function() {
  ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // acertando a parede da esquerda
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // acertando a parede da direita
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 600) { //um ponto foi marcado
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // bateu no pedal do player
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // bateu no pedal do comp
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};
// parte de reconhecimento de impacto
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});
// Dando função aos botões
var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // seta pra esquerda
      this.paddle.move(-4, 0);
    } else if (value == 39) { // seta pra direita
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // tudo pra esquerda
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // tudo pra direita
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}
// Movendo o pedal
var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // velocidade max pra esquerda
    diff = -5;
  } else if(diff > 0 && diff > 4) { // velocidade max pra direita
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};
// Movimentação do computador