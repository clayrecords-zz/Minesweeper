var rows = 10;
var cols = 10;
var cellSize = 20;
var totalMineCount = 10;
var grid;


function setup() {
    var canvas = createCanvas(cols * cellSize, rows * cellSize);
    canvas.parent('canvasContainer');
    $('.p5Canvas').on('contextmenu', event => event.preventDefault());
    resetSketch();
}

function resetSketch() {
    grid = makeGrid(cols, rows);
    makeMines();
}

function makeGrid(cols, rows) {
    var grid = {};
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[[x, y]] = new Cell(x, y, cellSize);
        }
    }
    return grid;
}

function makeMines() {
    var options = [];
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        options.push(Object.keys(grid)[xy]);
    }
    for (var n = 0; n < totalMineCount; n++) {
        var index = floor(random(options.length));
        var choice = options[index];

        // Deletes that spot so it's no longer an option
        options.splice(index, 1);
        grid[choice].isMine = true;
    }

    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        cell.countNeighborMines();
    }
}

function draw() {
    background(255);
    stroke(0);
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        cell.show();
    }
}

function mousePressed() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        if (!foundTarget && cell.wasTarget()) {
            foundTarget = true;
            cell.hold();
            break;
        }
    }
}

function mouseDragged() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        if (!foundTarget && cell.wasTarget()) {
            foundTarget = true;
            cell.hold();
        } else {
            cell.release();
        }
    }
}

function mouseReleased() {
    var foundTarget = false;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        cell.release();
        if (!foundTarget && cell.wasTarget()) {
            foundTarget = true;
            cell.click();
        }
    }
}

function checkEndState() {
    var foundAllNonMines = true;
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        if (!cell.isMine && !cell.revealed) {
            foundAllNonMines = false;
        }
    }

    if (foundAllNonMines) {
        for (var xy = 0; xy < Object.keys(grid).length; xy++) {
            var cell = grid[Object.keys(grid)[xy]];
            if (cell.isMine) {
                cell.flag(true);
            }
        }
        endGame();
    }
}

function endGame() {
    for (var xy = 0; xy < Object.keys(grid).length; xy++) {
        var cell = grid[Object.keys(grid)[xy]];
        cell.reveal();
    }
}