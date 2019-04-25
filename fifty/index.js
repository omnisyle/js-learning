function Tile() {
  this.value = null;
  this.render = function() {};
}

function Timer() {
  this.time = 0;
  this.start = function() {};
  this.stop = function() {};
  this.reset = function() {};
}

function Fifty() {
  this.numbers = [];
  this.render = function(element) {};
  this.isDone = function() {};
  this.completeGame = function() {};
}

var gameContainer = document.getElementById("fifty-container");
