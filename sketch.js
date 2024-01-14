var ballSpeed = 4;
var playerSpeed = 7;
var scores = [0, 0];
var gameStates = ["notStarted", "selecting", "started", "ended"];
var gameStateSelected = "notStarted";

function preload() {
  pixelfont = loadFont("087c5ebf-59ec-4d4c-a05f-8d0781486f05 (2).otf");
}

function setup() {
  new Canvas(800, 400);

  // Players
  players = new Group();
  players.width = 10;
  players.height = 50;
  players.collider = "s";
  player1 = new players.Sprite(
    width / 12,
    height / 2,
    players.width,
    players.height
  );
  player2 = new players.Sprite(
    width - width / 12 - players.width,
    height / 2,
    players.width,
    players.height
  );

  // Ball
  ball = new Sprite(width / 2, height / 2, 10, 10);

  // Boundaries
  boundaries = new Group();
  boundary1 = new boundaries.Sprite(width / 2, -10, width * 2, 20, "s");
  boundary2 = new boundaries.Sprite(width / 2, height + 10, width * 2, 20, "s");

  // Text
  textBoxes = new Group();
  textBoxes.visible = false;
  textBoxes.collider = "s";
  text1 = new textBoxes.Sprite(width / 2, height / 2, 400, 100);
  text2 = new textBoxes.Sprite(width / 2, height / 2, 400, 100);
  
  // Score
  score = new Sprite();
  score.collider = "n";
  score.visible = false;
}

function Ball() {
  if (gameStateSelected == gameStates[2]) {
    ball.visible = "true";
    ball.collider = "d";
    ball.rotationLock = true;
    ball.bounciness = 1;
    ball.friction = 0;
    if (ball.x == 400 && ball.y == 200) {
      ball.velocity.x = random([-ballSpeed, ballSpeed]);
      ball.velocity.y = random([-ballSpeed, ballSpeed]);
    }
    if (ball.collides(players)) {
      ball.velocity.x *= 1.2;
    }
  } else {
    ball.visible = false;
    ball.collider = "n";
    ball.pos = { x: width / 2, y: height / 2 };
  }
}

function Players() {
  if (gameStateSelected == gameStates[2]) {
    players.visible = true;
    players.collider = "s";
    
    if (kb.pressing("w")) {
      player1.y -= playerSpeed;
    } else if (kb.pressing("s")) {
      player1.y += playerSpeed;
    }

    if (kb.pressing("ArrowUp")) {
      player2.y -= playerSpeed;
    } else if (kb.pressing("ArrowDown")) {
      player2.y += playerSpeed;
    }
  } else {
    players.collider = "n";
    players.visible = false;
    player1.pos = { x: width / 12, y: height / 2 };
    player2.pos = { x: width - width / 12 - players.width, y: height / 2 };
    
  }
}

function restart() {
  ball.x = width / 2;
  ball.y = random([0, height]);
  ball.velocity.x = random([ballSpeed, -ballSpeed]);
  
  if (ball.y === 0) {
    ball.velocity.y = ballSpeed;
  } else {
    ball.velocity.y = -ballSpeed;
  }
}

function Bot() {}

function Game() {
  if (gameStateSelected == gameStates[0]) {
    textFont(pixelfont);
    text1.visible = true;
    text1.textSize = 20;
    text1.text = "PONG \n\n Press here to start...";

    text2.collider = "n";

    if (text1.mouse.hovering()) {
      text1.color = "grey";
    } else {
      text1.color = "white";
    }
    if (text1.mouse.pressed()) {
      gameStateSelected = gameStates[1];
    }
  } else if (gameStateSelected == gameStates[1]) {
    textBoxes.width = 200;
    textBoxes.height = 100;
    textBoxes.collider = "d";
    textBoxes.visible = true;

    text1.textSize = 10;
    text1.text = "1 Player (Not Working)";
    text1.pos = { x: width / 4, y: height / 2 };

    text2.pos = { x: width - width / 4, y: height / 2 };
    text2.textSize = 23;
    text2.text = "2 Players";

    if (text1.mouse.hovering()) {
      text1.color = "rgb(192,96,96)";
    }
    if (text2.mouse.hovering()) {
      text2.color = "grey";
    } else {
      text2.color = "white";
    }
    
    if (text2.mouse.pressed()) {
      gameStateSelected = gameStates[2];
      textBoxes.visible = false;
      textBoxes.collider = "n";
    }
  } else if (gameStateSelected == gameStates[2]) {
    score.visible = true;
    score.pos = { x: width / 2, y: score.width / 2 };
    score.width = 100;
    score.textSize = 20;
    score.text = scores[0] + " | " + scores[1];
    ball.overlaps(score);

    if (ball.x < 0) {
      scores[1] += 1;
      restart();
    } else if (ball.x > width) {
      scores[0] += 1;
      restart();
    }
    
    if (scores[0] > 4 || scores[1] > 4) {
      gameStateSelected = gameStates[3];
    }
  } else if (gameStateSelected == gameStates[3]) {
    textBoxes.visible = true;
    textBoxes.collider = "d";

    text1.pos = { x: width / 2, y: height / 2 };
    text1.textSize = 17;
    
    text2.pos = { x: width / 2, y: height / 2 + 70 };
    text2.height = 27;
    text2.textSize = 20;
    text2.text = "Play Again?";


    score.visible = false;
    if (scores[0] > 1) {
      text1.text = "Player 1 wins!";
    } else {
      text1.text = "Player 2 wins!";
    }

    if (text2.mouse.hovering()) {
      text2.color = "grey";
    } else {
      text2.color = "white";
    }
    if (text2.mouse.pressed()) {
      scores[0] = 0;
      scores[1] = 0;
      gameStateSelected = gameStates[2];
      textBoxes.visible = false;
      textBoxes.collider = "n";
    }
  }
  Ball();
  Players();
}

function draw() {
  background("black");
  allSprites.color = "white";
  Game();
}
