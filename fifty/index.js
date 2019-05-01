function Tile() {
  this.value = null;
  this.render = function() {};
}

function Timer() {
  this.time = 0;
  this.formattedTime = "0";
  this.timer = null;

  this.update = function() {
    var newSecond = this.time + 1;
    var minutes = Math.floor(newSecond / 60);
    var seconds = newSecond - minutes * 60;

    var formattedMinutes = this.padLeft(minutes, "0", 2);
    var formattedSeconds = this.padLeft(seconds, "0", 2);

    this.time = newSecond;
    this.formattedTime = minutes > 0
      ? formattedMinutes + ":" + formattedSeconds
      : seconds;
    console.log(this.formattedTime);
  };

  this.padLeft = function(string, pad, length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

  this.start = function() {
    this.timer = setInterval(this.update.bind(this), 1000);
  };

  this.stop = function() {
    clearInterval(this.timer);
  };

  this.reset = function() {
    clearInterval(this.timer);
    this.time = 0;
    this.timer = null;
    this.formattedTime = "0";
  };
}

function Fifty() {
  this.numbers = [];
  this.render = function(element) {};
  this.isDone = function() {};
  this.completeGame = function() {};
  this.init = init;
}

function init() {
  var timer = new Timer();
  timer.start();
}

var gameContainer = document.getElementById("fifty-container");
var game = new Fifty();
game.init();