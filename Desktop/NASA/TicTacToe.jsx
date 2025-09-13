import React, { useState, useEffect } from 'react';

// This is the main App component that contains all the game logic and UI.
const App = () => {
  // State to manage the game board, represented as an array of 9 elements.
  const [board, setBoard] = useState(Array(9).fill(null));
  // State to track whose turn it is. true for 'X', false for 'O'.
  const [isXNext, setIsXNext] = useState(true);
  // State to display the current game status (winner, next player, or tie).
  const [status, setStatus] = useState("Next player: X");

  // A helper function to check for a winner.
  const calculateWinner = (squares) => {
    // Define all possible winning combinations (rows, columns, and diagonals).
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    // Loop through each winning combination.
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      // Check if the squares in the combination have the same non-null value.
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // Return the winner ('X' or 'O').
      }
    }
    return null; // No winner found.
  };

  // useEffect hook to update the game status message.
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (board.every(square => square !== null)) {
      setStatus("It's a tie!");
    } else {
      setStatus(`Next player: ${isXNext ? 'X' : 'O'}`);
    }
  }, [board, isXNext]);

  // Handler function for when a square is clicked.
  const handleClick = (i) => {
    // Create a copy of the board state to modify.
    const newBoard = [...board];
    // If there is a winner or the square is already filled, do nothing.
    if (calculateWinner(newBoard) || newBoard[i]) {
      return;
    }
    // Set the square value to 'X' or 'O' based on whose turn it is.
    newBoard[i] = isXNext ? 'X' : 'O';
    // Update the board state.
    setBoard(newBoard);
    // Toggle the turn.
    setIsXNext(!isXNext);
  };

  // Function to render a single square button.
  const renderSquare = (i) => (
    <button
      className="w-24 h-24 bg-white m-1 rounded-lg text-4xl font-bold transition-all duration-200 ease-in-out transform hover:scale-105"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  // Function to reset the game to its initial state.
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans antialiased text-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900">Tic-Tac-Toe</h1>
        <div className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-700">{status}</div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default App;
