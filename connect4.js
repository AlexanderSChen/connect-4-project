/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // using a for loop, create an array from an object containing length: WIDTH pushed onto the board array.
  for(let y = 0; y < HEIGHT; y++) {
    // This will iterate 6 times creating the 6 x 7 board with 42 cells.
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // Use document.querySelector('#board') to select board id element from html and assign it to htmlBoard
  const board = document.querySelector('#board');

  // set top equal to a newly created tr element in html to house the top row of the board, which will take the user input.
  const top = document.createElement("tr");
  // set attribute for top id = "column-top"
  top.setAttribute("id", "column-top");
  // add an event listener if the top column is clicked, it should drop a red or blue piece down the column depending on the player.
  top.addEventListener("click", handleClick);

  // use a for loop to create a cell 7 units wide
  for (let x = 0; x < WIDTH; x++) {
    // create a td element for headCell.
    const headCell = document.createElement("td");
    // set headCell attribute's id to be x
    headCell.setAttribute("id", x);
    // add a unit onto the row, which will act as the head for each column that will be clicked to drop a game piece.
    top.append(headCell);
  }
  // 
  board.append(top);

  // use a for loop to create the rows for the game board.
  for (let y = 0; y < HEIGHT; y++) {
    // set row to a new element, tr. This creates the first unit of the row
    const row = document.createElement("tr");
    // use a nested for loop to create the rest of the row.
    for (let x = 0; x < WIDTH; x++) {
      // create td element named cell to house the rest of the units within the row.
      const cell = document.createElement("td");
      // set the cell id attribute to be equal to it's position within the grid.
      cell.setAttribute("id", `${y}-${x}`);
      // append each newly created cell onto the end of the row.
      row.append(cell);
    }
    // after each row is created, append it to the board and create the next row until it reaches HEIGHT number of rows
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: create a for loop to check each space from top to bottom
  for(let y = HEIGHT -1; y >= 0; y--) {
    // if statement checking if the space is not filled, then return i
    if(!board[y][x]) {
      //returns i, which is the top empty spot
      return y;
    }
  }
  // return null if all the spots are filled.
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // create piece with div element
  const piece = document.createElement('div');
  // add piece to class list
  piece.classList.add('piece');
  // add current player to class list to differentiate the pieces
  piece.classList.add(`p${currPlayer}`);
  // set the top style of piece equal to -50 * (y + 2), which is the height of the piece in the column and should be equal to the lowest, unoccupied spot.
  piece.style.top = -50 * (y + 2);
  // set spot equal to x and y position of the piece in the grid.
  const spot = document.getElementById(`${y}-${x}`);
  // append piece into the spot.
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // browser will display "Winner! Player `${currPlayer}"
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  // if statement checking if y is populated using findSpotForCol(x) which was created earlier.
  if (y === null) {
    // return nothing for the click event if y is null, meaning the column is fully populated.
    return;
  }

  // place piece in board and add to HTML table
  // updates the board with the position filled as the currPlayer
  board[y][x] = currPlayer;
  // if y did not return null earlier, then run placeInTable with the click inputs and switch to the other player.
  placeInTable(y, x);

  // if true, return end game message.
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.every(row => row.every(cell => cell))) {
    return endGame("TIE!");
  }

  // switch players
  // Use turnary operator to check if currPlayer === 1 return 2, otherwise return 1
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  // a nested function, _win will be used only in checkForWin
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // use callback function every to check all cells.
    return cells.every(
      // check array [y,x]
      ([y, x]) =>
      // if y is greater than 0
        y >= 0 &&
        // and less than height of the board
        y < HEIGHT &&
        // and x is greater than 0
        x >= 0 &&
        //and less than the width of the board
        x < WIDTH &&
        // then the board at the y and x position is equal to the current player
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // create for loop starting from the y axis bottom going up
  for (let y = 0; y < HEIGHT; y++) {
    // use a nested for loop to check each row left to right
    for (let x = 0; x < WIDTH; x++) {
      // set horizontal equal to an array containing y and x 0 - 3, if they belong to one player, that player wins.
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // set vertical equal to an array containing y 0 - 3 and x.
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // set diagonal down right = an array containing 4 cells checking x 0 y 0 - x 3 y 3
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // set diagonal down left = an array containing 4 cells checking y 0 x 0 - y 3 x -3
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // these cover all 4 directions and win conditions.
      // run _win function on all 4 values and if any of them return true, then checkForWin() returns true and the game will display the winner message and end.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
// run makeBoard and makeHtmlBoard so the board is displayed when the page is loaded or refreshed.
makeBoard();
makeHtmlBoard();
