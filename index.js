import {
  bg,
  platform,
  platformWidth,
  platformHeight,
  hills,
  smallTall,
  spriteRunLeft,
  spriteRunRight,
  spriteStandLeft,
  spriteStandRight,
  coin,
  coinSound,
  youWin,
  newPlatform,
  curvedLrgPlatform,
  balloon,
  pig1,
  pig2,
} from "./images.js";

import {
  createPlatforms,
  createGenericObjects,
  createCoins,
  createProps,
} from "./levelCreation.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

function resizeCanvas() {
  // Get the new window size
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;

  // Adjust the canvas size
  newWidth = newWidth - 2 * 10;
  newHeight = newHeight * 0.7;

  canvas.width = newWidth;
  canvas.height = newHeight;

  // Log the new size to the console
  console.log(`Screen Size: ${window.innerWidth} x ${window.innerHeight}`);
  console.log(`New canvas size: ${canvas.width} x ${canvas.height}`);
}

// Call the resize function initially when the script loads
resizeCanvas();

window.addEventListener("resize", function () {
  // Then call it again whenever the window size changes
  resizeCanvas();
});

const gravity = 0.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: canvas.width / 2 - 180,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.hasWon = false;
    this.width = 66;
    this.height = 150;
    this.image = spriteStandRight;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // Check if player is off screen to the left
    if (this.position.x < 0) {
      this.position.x = 0;
    }

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      let onPlatform = false;
      platforms.forEach((platform) => {
        if (
          this.position.y + this.height <= platform.position.y &&
          this.position.y + this.height + this.velocity.y >=
            platform.position.y &&
          this.position.x + this.width >= platform.position.x &&
          this.position.x <= platform.position.x + platform.width
        ) {
          onPlatform = true;
          this.velocity.y = 0;
        }
      });

      if (!onPlatform) {
        localStorage.setItem("playerScore", points);
        localStorage.setItem("playerFell", "true");

        // window.location.href = "gameover.html";
      }
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    image.addEventListener("load", () => {
      this.width = image.width;
      this.height = image.height;
    });
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Props {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    image.addEventListener("load", () => {
      this.width = image.width;
      this.height = image.height;
    });
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Collectible {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = 50;
    this.height = 50;
    // image.addEventListener("load", () => {
    //   this.width = image.width;
    //   this.height = image.height;
    // });

    this.collected = false;
  }

  draw() {
    if (!this.collected) {
      c.drawImage(this.image, this.position.x, this.position.y);
      // c.fillStyle = "blue";
      // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  checkCollision(player) {
    if (!this.collected && checkCollision(player, this)) {
      this.collected = true;
      points++;
      coinSound.play();
      console.log("coin collected" + points);
    }
  }
}

function checkCollision(a, b) {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
}

let player = new Player();

let platforms = [];
let props = [];

let genericObjects = [];
let points = 0;
let lastKey;
let coins = [];

const keys = {
  right: {
    pressed: false,
  },

  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

let leftButton = document.getElementById("left-button");
let rightButton = document.getElementById("right-button");
let upButton = document.getElementById("up-button");

function init() {
  player = new Player();

  platforms = createPlatforms(
    Platform,
    platformWidth,
    smallTall,
    newPlatform,
    platform,
    curvedLrgPlatform,
    balloon,
    pig1,
    pig2
  );
  genericObjects = createGenericObjects(
    GenericObject,
    bg,
    hills,

    platformWidth
  );
  coins = createCoins(Collectible, platformWidth, coin);

  props = createProps(Props, platformWidth, pig1, pig2, balloon);

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  props.forEach((prop) => {
    prop.draw();
  });

  coins.forEach((coin) => {
    coin.draw();
    coin.checkCollision(player);
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 50) {
    // change this line to
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 50) || // change this based on window width
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        scrollOffset += player.speed;
        platform.position.x -= player.speed;
      });

      props.forEach((prop) => {
        prop.position.x -= player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });

      coins.forEach((coin) => {
        coin.position.x -= player.speed;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      platforms.forEach((platform) => {
        scrollOffset -= player.speed;
        platform.position.x += player.speed;
      });

      props.forEach((prop) => {
        prop.position.x += player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });

      coins.forEach((coin) => {
        coin.position.x += player.speed;
      });
    }
  }
  // platform collision detection conditionals
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // sprite switching

  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // you win scenario
  const lastPlatform = platforms[platforms.length - 1];
  if (player.position.x >= lastPlatform.position.x && !player.hasWon) {
    console.log("You Win!");
    youWin.play();
    player.hasWon = true;
    localStorage.setItem("playerScore", points);
    window.location.href = "gameWin.html";
  }

  if (player.position.y > canvas.height) {
    localStorage.setItem("playerScore", points);
    window.location.href = "gameover.html";
  }
}

init();
animate();

window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    // left
    case 65:
    case 37:
      keys.left.pressed = true;
      lastKey = "left";
      break;

    // right
    case 68:
    case 39:
      keys.right.pressed = true;
      lastKey = "right";

      break;

    // up
    case 87:
    case 38:
    case 32:
      player.velocity.y -= 20;
      break;

    case 83:
    case 40:
      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
    case 37:
      keys.left.pressed = false;
      break;

    case 68:
    case 39:
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;

      break;

    case 87:
    case 38:
    case 32:
      player.velocity.y += 20;
      break;

    case 83:
    case 40:
      break;
  }
});

leftButton.addEventListener("touchstart", function () {
  keys.left.pressed = true;
  lastKey = "left";
});

leftButton.addEventListener("touchend", function () {
  keys.left.pressed = false;
  player.currentSprite = player.sprites.stand.left;
  player.currentCropWidth = player.sprites.stand.cropWidth;
  player.width = player.sprites.stand.width;
});

rightButton.addEventListener("touchstart", function () {
  keys.right.pressed = true;
  lastKey = "right";
});

rightButton.addEventListener("touchend", function () {
  keys.right.pressed = false;
  player.currentSprite = player.sprites.stand.right;
  player.currentCropWidth = player.sprites.stand.cropWidth;
  player.width = player.sprites.stand.width;
});

upButton.addEventListener("touchstart", function () {
  player.velocity.y -= 15;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth - 2 * 10;
  canvas.height = 0.7 * window.innerHeight;
});
