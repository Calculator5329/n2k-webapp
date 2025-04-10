// Helper function to generate the random board values
export function generateRandomBoard(max) {
  const boardSize = 36; // Always a 6x6 board
  const numbers = [];

  // If max is less than 36, just return 1 to max in order
  if (max < boardSize) {
    for (let i = 1; i <= max; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  // Create a set to ensure uniqueness.
  const uniqueNumbers = new Set();

  // Generate unique random numbers until we have enough for the board.
  while (uniqueNumbers.size < boardSize) {
    const randomNumber = Math.floor(Math.random() * max) + 1;
    uniqueNumbers.add(randomNumber);
  }

  // Convert the set to an array and sort it.
  const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
  return sortedNumbers;
}

export function generatePatternBoard(pattern) {
  const boardSize = 36; // Always a 6x6 board
  const numbers = [];
  for (let i = 1; i <= boardSize; i++) {
    numbers.push(i * pattern);
  }
  return numbers;
}
