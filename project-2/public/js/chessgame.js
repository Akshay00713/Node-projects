const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement('div');
      squareElement.classList.add("square", (rowindex + squareindex) %2 ===0 ? "light" : "dark");
    });

    squareElement.dataset.row = rowindex;
    squareElement.dataset.column = squareindex;

    if(square) {
      const pieceElement = document.createElement("div");
      pieceElement.classList,add("piece", square.color === "w" ? "white" : "black");
    };
    pieceElement.innerText = "";
    pieceElement.draggable = playerRole === square.color;

    pieceElement.addEventListener("dragstart", (e) => {
      if(pieceElement.draggable){
        draggedPiece = pieceElement;
        sourceSquare = { row :rowindex, col: squareindex };
        e.dataTransfer.setData("text/plain", "");
      };
    });

    pieceElement.addEventListener("dragend", (e) => {
      draggedPiece = null;
      sourceSquare = null;
    });

    squareElement.appendChild(pieceElement)
  });
};

const handlemove = () => {};

const getPieceUniCode = () => {};

renderBoard();



//1:31:10 time