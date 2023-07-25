import {
  bg,
  platform,
  platformWidth,
  platformHeight,
  hills,
  smallTall,
  smallTallWidth,
  jackG,
  spriteRunLeft,
  spriteRunRight,
  spriteStandLeft,
  spriteStandRight,
  spriteFireFlower,
  coin,
} from "./constants.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 526;

const gravity = 0.5;

// Rest of your code...

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

      if (this.position.x < 0) {
        this.position.x = 0;
      }

      if (!onPlatform) {
        console.log("Player fell off");
        localStorage.setItem("playerScore", points);
        window.location.href = "gameover.html";
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
      console.log("coin collected" + points);
    }
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
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

  platforms = [
    new Platform({ x: platformWidth * 4 - 3 + 585, y: 270, image: smallTall }),
    new Platform({ x: -1, y: 470, image: platform }),
    new Platform({ x: platformWidth - 3, y: 470, image: platform }),
    new Platform({ x: platformWidth * 2 + 100, y: 470, image: platform }),
    new Platform({ x: platformWidth * 3 + 300, y: 470, image: platform }),
    new Platform({ x: platformWidth * 4 - 3 + 300, y: 470, image: platform }),
    new Platform({ x: platformWidth * 5 - 3 + 750, y: 470, image: platform }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: bg,
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: hills,
    }),
  ];

  coins = [
    new Collectible({ x: 500, y: 300, image: coin }),
    new Collectible({ x: 700, y: 200, image: coin }),
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  coins.forEach((coin) => {
    coin.draw();
    coin.checkCollision(player);
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
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

      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });

      coins.forEach((coin) => {
        coin.position.x -= player.speed;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
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
  if (player.position.x >= lastPlatform.position.x) {
    console.log("You Win!");
  }

  if (player.position.y > canvas.height) {
    console.log("Player fell off");
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
});

rightButton.addEventListener("touchstart", function () {
  keys.right.pressed = true;
  lastKey = "right";
});

rightButton.addEventListener("touchend", function () {
  keys.right.pressed = false;
});

upButton.addEventListener("touchstart", function () {
  player.velocity.y -= 15;
});
