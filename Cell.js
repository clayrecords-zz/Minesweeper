
function Cell(gx, gy, size) {
    this.gx = gx;
    this.gy = gy;
    this.size = size;
    this.lx = this.gx * this.size;
    this.ly = this.gy * this.size

    this.revealed = false;
    this.flagged = false;
    this.isHeld = false;
    this.isMine = false;
    this.exploded = false;
    this.neighborMineCount = 0;
    this.neighborCells = [];
}

Cell.prototype.countNeighborMines = function () {
    this.neighborMineCount = 0;
    this.neighborCells = [];
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var neighborgx = this.gx + x;
            var neighborgy = this.gy + y;
            if (neighborgx >= 0 && neighborgx < cols && neighborgy >= 0 && neighborgy < rows) {
                var neighborCell = grid[[neighborgx, neighborgy]];
                this.neighborCells.push(neighborCell);
                if (neighborCell.isMine) {
                    this.neighborMineCount++;
                }
            }
        }
    }
    return;
}

Cell.prototype.show = function () {
    stroke(0);
    noFill();
    rect(this.lx, this.ly, this.size, this.size);
    if (this.revealed) {
        this.showRevealedBackground();
        if (this.isMine) {
            var mineFillColor = this.exploded ? 'red' : 100;
            fill(mineFillColor);
            ellipse(this.lx + (this.size / 2), this.ly + (this.size / 2), this.size / 2, this.size / 2);
            if (this.flagged) {
                this.showFlag();
            }
        } else {
            if (this.neighborMineCount > 0) {
                textAlign(CENTER);
                fill(0);
                text(this.neighborMineCount, this.lx + this.size * 0.5, this.ly + this.size - 5.5);
            }
            if (this.flagged) {
                this.showX()
            }
        }
    } else if (this.flagged) {
        this.showFlag();
    } else if (this.isHeld) {
        this.showRevealedBackground();
    }
}

Cell.prototype.showRevealedBackground = function () {
    fill(225);
    rect(this.lx, this.ly, this.size, this.size);
}

Cell.prototype.showFlag = function () {
    fill('red');
    var p1x = this.lx + (this.size / 4);
    var p1y = this.ly + (this.size * 3 / 4);
    var p2x = this.lx + (this.size / 2);
    var p2y = this.ly + (this.size / 4);
    var p3x = this.lx + (this.size * 3 / 4);
    var p3y = this.ly + (this.size * 3 / 4);
    triangle(p1x, p1y, p2x, p2y, p3x, p3y)
}

Cell.prototype.showX = function () {
    stroke('red');
    line(this.lx + (this.size / 4), this.ly + (this.size / 4), this.lx + (this.size * 3 / 4), this.ly + (this.size * 3 / 4));
    line(this.lx + (this.size * 3 / 4), this.ly + (this.size / 4), this.lx + (this.size / 4), this.ly + (this.size * 3 / 4));
}

Cell.prototype.reveal = function (explodable = false) {
    this.revealed = true;
    if (explodable && this.isMine) {
        this.exploded = true;
    }

    if (this.neighborMineCount == 0) {
        for (var i = 0; i < this.neighborCells.length; i++) {
            var neighborCell = this.neighborCells[i];
            if (!neighborCell.revealed && !neighborCell.isMine) {
                neighborCell.flag(false);
                neighborCell.reveal();
            }
        }
    }
}

Cell.prototype.flag = function (setFlag = null) {
    if (setFlag != null) {
        this.flagged = setFlag;
    } else {
        this.flagged = !this.flagged;
    }
}

Cell.prototype.wasTarget = function () {
    return (mouseX > this.lx && mouseX < this.lx + this.size && mouseY > this.ly && mouseY < this.ly + this.size);
}

Cell.prototype.hold = function () {
    this.isHeld = true;
}
Cell.prototype.release = function () {
    this.isHeld = false;
}

Cell.prototype.click = function () {
    var rightClicked = mouseButton == RIGHT;
    if (!this.revealed && rightClicked) {
        this.flag();
    } else if (!this.flagged && !this.revealed) {
        this.reveal(true);

        if (this.isMine) {
            endGame();
        } else {
            checkEndState();
        }
    }
}