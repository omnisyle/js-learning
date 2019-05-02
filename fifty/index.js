function Timer(elementID) {
  this.state = "stopped";
  this.element = document.getElementById(elementID);
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
    this.element.innerHTML = this.formattedTime;
  };

  this.padLeft = function(string, pad, length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

  this.start = function() {
    if (this.state === "stopped") {
      this.state = "started";
      this.timer = setInterval(this.update.bind(this), 1000);
    }
  };

  this.stop = function() {
    if (this.state === "started") {
      clearInterval(this.timer);
      this.state = "stopped";
    }
  };

  this.reset = function() {
    clearInterval(this.timer);
    this.time = 0;
    this.timer = null;
    this.formattedTime = "0";
    this.element.innerHTML = this.formattedTime;
  };
}

function Tile() {
  this.state = "empty";
  this.value = null;
  this.element = null;
  this.eventRegistry = {
    "click": []
  };

  this.on = function(eventName, handler) {
    if (this.eventRegistry.hasOwnProperty(eventName)) {
      var handlers = this.eventRegistry[eventName];
      handlers.push(handler);
      this.eventRegistry[eventName] = handlers;
    }
  };

  this.onClick = function() {
    var handlers = this.eventRegistry["click"];
    for (let index = 0; index < handlers.length; index++) {
      var handler = handlers[index];
      handler(this);
    }
  };

  this.render = function() {
    var ele = document.createElement("div");
    ele.id = this.id;
    ele.className = `tile ${ this.state }`;
    ele.textContent = this.value;
    ele.onclick = this.onClick.bind(this);
    this.element = ele;
    return ele;
  };

  this.update = function() {
    if (this.element) {
      this.element.textContent = this.value;
      this.element.className = `tile ${this.state}`;
    }
  };

  this.setValue = function(val) {
    if (val) {
      this.value = val;
      this.state = "filled";
    } else {
      this.value = null;
      this.state = "empty";
    }

    this.update();
  };
}

function Fifty(container, timer) {
  this.container = document.getElementById(container);
  this.timer = timer;
  this.limit = 50;
  this.numbers = [];
  this.clickedNum = [];
  this.tiles = [];
  this.completed = false;

  this.takeNum = function() {
    if (this.numbers.length === 0) {
      return null;
    }

    var randIndex = Math.floor(Math.random() * this.numbers.length);
    var number = this.numbers.splice(randIndex, 1)[0];
    return number;
  }

  this.init = function() {
    // initialize numbers
    for (var i = 0; i < this.limit; i++) {
      this.numbers.push(i + 1);
    }

    // use 25 hard coded because there are 5 rows and 5 columns
    var firstHalf = this.numbers.splice(0, 25);
    for (var i = 0; i < 5; i++) {
      var tileRow = [];

      for (var j = 0; j < 5; j++) {
        var tile = new Tile(`tile-${i}-${j}`);
        var randIndex = Math.floor(Math.random() * firstHalf.length);
        var number = firstHalf.splice(randIndex, 1)[0];
        tile.setValue(number);
        tile.on("click", this.onTileClicked.bind(this));
        tileRow.push(tile);
      }

      this.tiles.push(tileRow);
    }

    var resetBtn = document.getElementById("reset-btn");
    resetBtn.onclick = this.reset.bind(this);
  }

  this.isDone = function() {
    return this.numbers.length === 0 && this.clickedNum.length === this.limit;
  };

  this.complete = function() {
    if (this.isDone()) {
      this.completed = true;
      this.timer.stop();
      alert("Congratulations! You've won");
      return true;
    }

    return false;
  };

  this.onTileClicked = function(tile) {
    if (!this.completed) {
      this.timer.start();

      if (this.clickedNum.length < 1) {
        if (tile.value === 1) {
          this.clickedNum.push(tile.value);
          var newNum = this.takeNum();
          tile.setValue(newNum);
        }
      } else {
        var prevNumber = this.clickedNum[this.clickedNum.length - 1];
        var clickedNumber = tile.value;

        if (clickedNumber - prevNumber === 1) {
          this.clickedNum.push(tile.value);
          var newNum = this.takeNum();
          tile.setValue(newNum);
        }
      }
    }
    this.complete();
  }

  this.reset = function() {
    this.timer.reset();
    this.tiles = [];
    this.container.innerHTML = '';
    this.completed = false;
    this.clickedNum = [];
    this.numbers = [];
    this.init();
    this.render();
  };

  this.render = function() {
    for(var i = 0; i < this.tiles.length; i++) {
      var rowEle = document.createElement("div");
      rowEle.className = "row";

      var tileRow = this.tiles[i];
      for(var j = 0; j < tileRow.length; j++) {
        var tile = tileRow[j];
        rowEle.appendChild(tile.render());
      }

      this.container.appendChild(rowEle);
    }
  };
}

var gameContainer = document.getElementById("fifty-container");
var game = new Fifty(
  "fifty-container",
  new Timer("timer-value")
);

game.init();
game.render();