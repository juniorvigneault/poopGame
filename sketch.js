// Declare variables for cards, game state, etc.
let card1, card2, card3, card4, card5, card6, card7, card8, card9, card10;
let startgame;
let backgroundImage;
let flipSide;
let gameState = 'start';
let wonGame = false;
let NUM_COLS = 5; // Adjusted to 5 columns
let NUM_ROWS = 4; // Adjusted to 4 rows
let tiles = [];
let numTries = 0;
let numMatches = 0;
let flippedTiles = [];
let delayStartFC = null;

function preload() {
    flipSide = loadImage("back.png");
    card1 = loadImage("1.png");
    card2 = loadImage("2.png");
    card3 = loadImage("3.png");
    card4 = loadImage("4.png");
    card5 = loadImage("5.png");
    card6 = loadImage("6.png");
    card7 = loadImage("7.png");
    card8 = loadImage("8.png");
    card9 = loadImage("9.png");
    card10 = loadImage("10.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    restartGame();
}

function restartGame() {
    wonGame = false;
    gameState = 'start';
    createTiles();
}

function createTiles() {
    tiles = [];
    let possibleFaces = [card1, card2, card3, card4, card5, card6, card7, card8, card9, card10];
    let selected = [];

    for (let i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
        let randomInd = floor(random(possibleFaces.length));
        let face = possibleFaces[randomInd];
        selected.push(face);
        selected.push(face);
        possibleFaces.splice(randomInd, 1);
    }

    shuffleArray(selected);

    let tileWidth = 150 // Calculate width of each tile
    let tileHeight = 200 // Calculate height of each tile
    let spacingX = 20; // Adjust the horizontal spacing
    let spacingY = 20; // Adjust the vertical spacing

    // Calculate the total width and height of the grid including spacing
    let gridWidth = (NUM_COLS * tileWidth) + ((NUM_COLS - 1) * spacingX);
    let gridHeight = (NUM_ROWS * tileHeight) + ((NUM_ROWS - 1) * spacingY);

    // Calculate the xOffset and yOffset to center the grid
    let xOffset = (width - gridWidth) / 2;
    let yOffset = (height - gridHeight) / 2;

    for (let i = 0; i < NUM_COLS; i++) {
        for (let j = 0; j < NUM_ROWS; j++) {
            let tileX = xOffset + (i * (tileWidth + spacingX));
            let tileY = yOffset + (j * (tileHeight + spacingY));
            let tileFace = selected.pop();
            tiles.push(new Tile(tileX, tileY, tileWidth, tileHeight, tileFace));
        }
    }
}


function draw() {
    background(63, 127, 209);

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].draw();
    }

    if (delayStartFC && (frameCount - delayStartFC) > 60) { // Changed delay to 1 second
        for (let i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].isFaceUp = false;
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }

    if (numMatches === tiles.length / 2) {
        fill(0);
        textSize(20);
        text("You found them all in " + numTries + " tries!", 20, 375);
    }
}

function mouseClicked() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].isFaceUp = true;
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                        flippedTiles.length = 0;
                        numMatches++;
                    } else {
                        delayStartFC = frameCount;
                    }
                }
            }
            loop();
        }
    }
}

function shuffleArray(array) {
    let counter = array.length;

    while (counter > 0) {
        let ind = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[ind];
        array[ind] = temp;
    }
}

function Tile(x, y, w, h, face) {
    this.x = x;
    this.y = y;
    this.width = w; // Width of the tile
    this.height = h; // Height of the tile
    this.face = face;
    this.isFaceUp = false;
    this.isMatch = false;
}

Tile.prototype.draw = function () {
    // strokeWeight(2);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 10);
    if (this.isFaceUp) {
        image(this.face, this.x, this.y, this.width, this.height);
    } else {
        image(flipSide, this.x, this.y, this.width, this.height);
    }
};

Tile.prototype.isUnderMouse = function (x, y) {
    return x >= this.x && x <= this.x + this.width &&
        y >= this.y && y <= this.y + this.height;
};