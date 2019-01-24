document.addEventListener("DOMContentLoaded", function () {

    class MineSweeper {

        constructor() {
            this.row = 8;
            this.column = 8;
            this.bombs = 10;
            this.countOfClear = 54;
            this.board = document.getElementById("board");
            this.boardBombs1 = [];
            this.boardBombs2 = [];
            this.boardFlags = [];
            this.flagCount = 0;
            this.firstTurn = true;
            this.time = 0;
            this.timer;
            this.score;
            this.clearedSquares = document.getElementsByClassName("square-clicked");
            this.resetBtn = document.getElementById("reset");
            console.log("created");
        }
        // difficulty level selection
        difficulty(level) {
            if (level == "Easy") {
                this.row = 8;
                this.column = 8;
                this.bombs = 10;
                this.countOfClear = 54;
            } else if (level == "Intermediate") {
                this.row = 16;
                this.column = 16;
                this.bombs = 40;
                this.countOfClear = 216;
            } else {
                this.row = 16;
                this.column = 30;
                this.bombs = 99;
                this.countOfClear = 381;
            }
        }
        //reset function
        reset() {
            while (this.board.firstChild) {
                board.removeChild(board.firstChild);
            }
            this.boardBombs1 = [];
            this.boardBombs2 = [];
            this.firstTurn = true;
            this.flagCount = 0;
            this.boardFlags = [];
            this.time = 0;
            clearInterval(this.timer);
            document.getElementById("timer").innerHTML = ("000" + this.time).slice(-3);
            this.createBottomLayer();
            this.bombCount();
            this.createGrid();
            this.resetBtn.removeChild(this.resetBtn.firstChild)
            let smile = new Image();
            smile.src = "../img/4-reset-1.png";
            smile.style.maxWidth = "100%";
            this.resetBtn.appendChild(smile);
        }
        //reset button
        resetButton() {
            this.resetBtn.addEventListener("click", e => {
                this.reset();
            });
        }
        // level selector
        selectLevel() {
            let levels = document.getElementsByClassName("level");
            for (let i = 0; i < levels.length; i++) {
                levels[i].addEventListener("click", e => {
                    this.difficulty(e.target.innerText);
                    this.reset();
                });
            }
        }
        // main function for interacting with the board
        createGrid() {
            let boardBombs = this.boardBombs1;
            for (let i = 0; i < this.row; i++) {
                const row1 = document.createElement("div");
                row1.setAttribute("class", "row");
                row1.setAttribute("id", `${i}`)
                for (let j = 0; j < this.column; j++) {
                    const square = document.createElement("div");
                    square.setAttribute("class", "square");
                    square.setAttribute("tabindex", "-1");
                    square.setAttribute("id", `${j}`);
                    row1.appendChild(square);
                }
                board.appendChild(row1);
            }
            let squares = document.getElementsByClassName("square");
            let squaresClicked = document.getElementsByClassName("square-clicked");
            for (let i = 0; i < squares.length; i++) {
                squares[i].addEventListener("click", e => {
                    // stops clicking on flagged squares
                    if (e.target.parentNode.classList.contains("flag"))
                        return;
                    if (e.target.classList.contains("square-clicked"))
                        return;
                    // makes sure you don't lose on the first click
                    if (this.firstTurn && this.boardBombs1[e.target.parentNode.id][e.target.id] == 1) {
                        boardBombs = this.boardBombs2;
                        this.timer = setInterval(e => {
                            this.time++;
                            document.getElementById("timer").innerHTML = ("000" + this.time).slice(-3);
                        }, 1000);
                        this.firstTurn = false;
                    } else if (this.firstTurn == true) {
                        this.timer = setInterval(e => {
                            this.time++;
                            document.getElementById("timer").innerHTML = ("000" + this.time).slice(-3);
                        }, 1000);
                        this.firstTurn = false;
                    }
                    // lose condition, and carry on condition, need to add board reset sort of function
                    if (boardBombs[e.target.parentNode.id][e.target.id] == 1) {
                        this.loser(e.target);
                    } else {
                        this.clearSurrounding(parseInt(e.target.parentNode.id), parseInt(e.target.id), board, boardBombs, false);
                        this.winner(squaresClicked);
                    }

                });
                // flag and unflag squares
                squares[i].addEventListener("contextmenu", e => {
                    e.preventDefault();
                    if (e.target.parentNode.classList.contains("flag")) {
                        this.boardFlags[e.target.parentNode.parentNode.id][e.target.parentNode.id] = 0;
                        this.flagCount--;
                        e.target.parentNode.setAttribute("class", "square");
                        e.target.parentNode.removeChild(e.target.parentNode.firstChild);
                        e.target.setAttribute("class", "square");
                        this.bombCount();
                    } else if (e.target.classList.contains("square")) {
                        this.boardFlags[e.target.parentNode.id][e.target.id] = 1;
                        this.flagCount++;
                        e.target.setAttribute("class", "flag");
                        let flag = new Image();
                        flag.src = "../img/flag.png";
                        flag.style.maxWidth = "100%";
                        e.target.appendChild(flag);
                        this.bombCount();
                    }

                });
                // double click to clear if flagged is the same as the number of bombs surrounding it
                squares[i].addEventListener("dblclick", e => {
                    if (e.target.classList.contains("square-clicked")) {
                        if (e.target.innerText == this.numberOfBombs(parseInt(e.target.parentNode.id), parseInt(e.target.id), this.boardFlags)) {
                            this.clearSurrounding(parseInt(e.target.parentNode.id), parseInt(e.target.id), board, boardBombs, true);
                            this.winner(squaresClicked);
                        }
                    }
                });
                // face change on mousedown
                squares[i].addEventListener("mousedown", e => {
                    if (e.target) {
                        this.resetBtn.removeChild(this.resetBtn.firstChild)
                        let smile = new Image();
                        smile.src = "../img/4-reset-2.png";
                        smile.style.maxWidth = "100%";
                        this.resetBtn.appendChild(smile);
                    }

                });
                squares[i].addEventListener("mouseup", e => {
                    if (e.target) {
                        this.resetBtn.removeChild(this.resetBtn.firstChild)
                        let smile = new Image();
                        smile.src = "../img/4-reset-1.png";
                        smile.style.maxWidth = "100%";
                        this.resetBtn.appendChild(smile);
                    }

                });

            }
            let instructionBtn = document.getElementById("instructions");
            let instructions = document.getElementById("instructions-box")
            let returnBtn = document.getElementById("return-to-game");
            let mainContainer = document.getElementById("main-container");
            instructionBtn.addEventListener("click", e => {
                mainContainer.style.display = "none";
                instructions.style.display = "flex";
            });
            returnBtn.addEventListener("click", e => {
                mainContainer.style.display = "flex";
                instructions.style.display = "none";
            });
        }
        // gets the surroundings
        getSurroundings(row, col) {
            let inCells = [
                [row - 1, col - 1],
                [row - 1, col],
                [row - 1, col + 1],
                [row, col - 1],
                [row, col + 1],
                [row + 1, col - 1],
                [row + 1, col],
                [row + 1, col + 1],
            ];
            let outCells = [];
            inCells.forEach(cell => {
                if (cell[0] >= 0 && cell[0] < this.row && cell[1] >= 0 && cell[1] < this.column) {
                    outCells.push(cell);
                }
            });
            return outCells;
        }
        // number of bombs surrounding a square and flags
        numberOfBombs(row, col, board) {
            let count = 0;
            let cells = this.getSurroundings(row, col);
            cells.forEach(cell => {
                count += board[cell[0]][cell[1]];
            });

            return count;
        }
        // bombcount
        bombCount() {
            let counter = document.getElementById("num-bombs");
            let num = this.bombs - this.flagCount;
            counter.innerText = ("000" + num).slice(-3);
        }
        // clears surround area if the square has no bombs surounding it
        clearSurrounding(row, col, board, boardBombs, bool) {
            if (row < 0 || row >= this.row || col < 0 || col >= this.column) {
                return;
            }

            if (board.childNodes[row].childNodes[col].classList.contains("square-clicked") && !bool) {
                return;
            }
            if (board.childNodes[row].childNodes[col].classList.contains("flag") && !bool) {
                return;
            }
            if (boardBombs[row][col] == 1) {
                this.loser(board.childNodes[row].childNodes[col]);
                return;
            }
            board.childNodes[row].childNodes[col].setAttribute("class", "square-clicked");
            let bombs = this.numberOfBombs(row, col, boardBombs);
            if (bombs > 0 && !bool) {
                board.childNodes[row].childNodes[col].innerText = "" + bombs;
                board.childNodes[row].childNodes[col].style.color = this.numColor(bombs);
                return;
            }
            let cells = this.getSurroundings(row, col);
            // console.log(cells);
            cells.forEach(cell => {
                this.clearSurrounding(cell[0], cell[1], board, boardBombs, false);
            });


        }
        //color of number
        numColor(num) {
            switch (num) {
                case 1:
                    return "blue";
                case 2:
                    return "green";
                case 3:
                    return "red";
                case 4:
                    return "darkblue";
                case 5:
                    return "maroon";
                case 6:
                    return "#006768";
                case 7:
                    return "purple";
                case 8:
                    return "black";
                default:
                    break;
            }
        }

        //random bomb locations
        randomBombLocations(lengths) {
            return Math.floor(Math.random() * lengths);
        }
        // makes sure no repeating bombs and creates backup board for not losing on first click
        createBottomLayer() {
            let count = this.bombs;
            let count1 = this.bombs;
            for (let i = 0; i < this.row; i++) {
                this.boardBombs1.push([]);
                this.boardBombs2.push([]);
                this.boardFlags.push([]);
                for (let j = 0; j < this.column; j++) {
                    this.boardBombs1[i].push(0);
                    this.boardBombs2[i].push(0);
                    this.boardFlags[i].push(0);
                }
            }
            while (count > 0) {
                let rowBomb = this.randomBombLocations(this.row);
                let columnBomb = this.randomBombLocations(this.column);

                if (this.boardBombs1[rowBomb][columnBomb] === 0) {
                    this.boardBombs1[rowBomb][columnBomb] = 1;
                    count--;
                }
            }
            while (count1 > 0) {
                let rowBomb = this.randomBombLocations(this.row);
                let columnBomb = this.randomBombLocations(this.column);

                if (this.boardBombs2[rowBomb][columnBomb] === 0 && this.boardBombs1[rowBomb][columnBomb] === 0) {
                    this.boardBombs2[rowBomb][columnBomb] = 1;
                    count1--;
                }
            }
        }
        // win condition
        winner(board) {
            if (board.length == this.countOfClear) {
                let winning = document.getElementById("winning");
                let timeText = document.getElementById("time-text");
                let mainContainer = document.getElementById("main-container");
                let newGame = document.getElementById("new-game");
                winning.style.display = "flex";
                mainContainer.style.display = "none";
                timeText.innerText = `Your time was: ${this.time} seconds`;
                this.resetBtn.removeChild(this.resetBtn.firstChild)
                let smile = new Image();
                smile.src = "../img/4-reset-3.png";
                smile.style.maxWidth = "100%";
                this.resetBtn.appendChild(smile);
                clearInterval(this.timer);
                this.score = this.time;
                newGame.addEventListener("click", e => {
                    winning.style.display = "none";
                    mainContainer.style.display = "flex";
                    this.reset;
                });
            }
        }
        // lose condition
        loser(cell) {
            let losing = document.getElementById("losing");
            let mainContainer = document.getElementById("main-container");
            let newGame = document.getElementById("new-game-lose");
            clearInterval(this.timer);
            cell.setAttribute("class", "bomb");
            let mine = new Image();
            let audio = new Audio("../audio/bomb.mp3");
            audio.play();
            mine.src = "../img/bomb.png";
            mine.style.maxWidth = "100%";
            cell.appendChild(mine);
            losing.style.display = "flex";
            mainContainer.style.display = "none";
            newGame.addEventListener("click", e => {
                losing.style.display = "none";
                mainContainer.style.display = "flex";
                this.reset;
            });
        }
    }

    //initialise game
    let mines = new MineSweeper();
    easy = document.getElementById("easy");
    medium = document.getElementById("medium");
    hard = document.getElementById("hard");
    buttons = [easy, medium, hard]

    mines.selectLevel();
    mines.createBottomLayer();
    mines.createGrid();
    mines.resetButton();
}); // end of dom