document.addEventListener("DOMContentLoaded", function () {
    let row = 8;
    let column = 8;
    let board = document.getElementById("board");

    function createGrid() {
        // clearChildren();
        for (let j = 0; j < row; j++) {
            const row1 = document.createElement("div");
            row1.setAttribute("class", "row");
            for (let i = 0; i < column; i++) {
                const square = document.createElement("div");
                square.setAttribute("class", "square");
                square.setAttribute("tabindex", "-1");
                row1.appendChild(square);
            }
            board.appendChild(row1);
        }
        let squares = document.getElementsByClassName("square");
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("keydown", function (e) {
                e.target.setAttribute("class", "square-clicked");
            })
        }
    }

    createGrid();
}); // end of dom