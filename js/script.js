document.addEventListener("DOMContentLoaded", function () {

    let level = prompt("What difficulty would you like?\n'easy', 'intermediate' or 'advanced'");

    class MineSweeper {

        constructor() {
            this.row = 8;
            this.column = 8;
            this.bombs = 10;
            this.board = document.getElementById("board");
            this.boardBombs1 = [];
            this.boardBombs2 = [];
            this.firstTurn = true;
            console.log("created");
        }

        difficulty(level) {
            if (level == "easy") {
                this.row = 8;
                this.column = 8;
                this.bombs = 10;
            } else if (level == "intermediate") {
                this.row = 16;
                this.column = 16;
                this.bombs = 40;
            } else {
                this.row = 16;
                this.column = 30;
                this.bombs = 99;
            }
        }

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
            for (let i = 0; i < squares.length; i++) {
                squares[i].addEventListener("click", e => {
                    if (this.firstTurn && this.boardBombs1[e.target.parentNode.id][e.target.id] == 1) {
                        boardBombs = this.boardBombs2;
                        this.firstTurn = false;
                    }
                    if (boardBombs[e.target.parentNode.id][e.target.id] == 1) {
                        e.target.setAttribute("class", "bomb");
                        let mine = new Image();
                        mine.src = "../img/bomb.png";
                        mine.style.maxWidth = "100%";
                        e.target.appendChild(mine);
                        alert("gameover");
                    } else {
                        e.target.setAttribute("class", "square-clicked");
                        if(this.numberOfBombs(parseInt(e.target.parentNode.id), parseInt(e.target.id), boardBombs)>0){
                            e.target.innerText = this.numberOfBombs(parseInt(e.target.parentNode.id), parseInt(e.target.id), boardBombs);
                        }
                    }
                });

                squares[i].addEventListener("contextmenu", e => {
                    e.preventDefault();
                    if (e.target.parentNode.classList.contains("flag")) {
                        console.log("doing something");
                        e.target.parentNode.removeChild(e.target.parentNode.firstChild);
                        e.target.parentNode.setAttribute("class", "square");

                    } else {
                        e.target.setAttribute("class", "flag");
                        let flag = new Image();
                        flag.src = "../img/flag.png";
                        flag.style.maxWidth = "100%";
                        e.target.appendChild(flag);
                    }

                });

            }
        }

        numberOfBombs(row, col, board) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (row + i < 0 || col + j < 0 || row + i > board.length - 1 || col + j > board[0].length - 1) {
                        // catching out of bounds
                    } else if (board[row + i][col + j] === 1) {
                        count++;
                    }
                }
            }
            return count;
        }

        randomBombLocations(lengths) {
            return Math.floor(Math.random() * lengths);
        }

        createBottomLayer() {
            let count = this.bombs;
            let count1 = this.bombs;
            for (let i = 0; i < this.row; i++) {
                this.boardBombs1.push([]);
                this.boardBombs2.push([]);
                for (let j = 0; j < this.column; j++) {
                    this.boardBombs1[i].push(0);
                    this.boardBombs2[i].push(0);
                }
            }
            while (count >= 0) {
                let rowBomb = this.randomBombLocations(this.row);
                let columnBomb = this.randomBombLocations(this.column);

                if (this.boardBombs1[rowBomb][columnBomb] === 0) {
                    this.boardBombs1[rowBomb][columnBomb] = 1;
                    count--;
                }
            }
            while (count1 >= 0) {
                let rowBomb = this.randomBombLocations(this.row);
                let columnBomb = this.randomBombLocations(this.column);

                if (this.boardBombs2[rowBomb][columnBomb] === 0 && this.boardBombs1[rowBomb][columnBomb] === 0) {
                    this.boardBombs2[rowBomb][columnBomb] = 1;
                    count1--;
                }
            }
            console.log(this.boardBombs1);
            console.log(this.boardBombs2);

        }
    }

    let mines = new MineSweeper();
    mines.difficulty(level);
    mines.createBottomLayer();
    mines.createGrid();
}); // end of dom