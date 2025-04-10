export function splitStringNumber(s) {
  if (!/^\d+$/.test(s)) {
    throw new Error("Input must be digits only.");
  }

  if (s.length === 1) {
    return [parseInt(s), 1];
  }

  return [parseInt(s.slice(0, -1)), parseInt(s.slice(-1))];
}

export function checkNums(n1, n2, n3, final) {
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 ? a / b : null),
  };

  for (const [op1Sym, op1] of Object.entries(ops)) {
    for (const [op2Sym, op2] of Object.entries(ops)) {
      try {
        const result = op2(op1(n1, n2), n3);
        if (Math.abs(result - final) < 1e-6) {
          console.log(`(${n1} ${op1Sym} ${n2}) ${op2Sym} ${n3} = ${result}`);
          return true;
        }
      } catch {
        continue;
      }
    }
  }

  return false;
}

export function evaluateInput(n1s, n2s, n3s, num, dice, board) {
  try {
    const n1 = splitStringNumber(n1s);
    const n2 = splitStringNumber(n2s);
    const n3 = splitStringNumber(n3s);
    const currentNum = parseInt(num, 10);

    if (!board.includes(currentNum)) return false;

    const baseDice = [n1[0], n2[0], n3[0]].sort((a, b) => a - b);
    const sortedDice = [...dice].sort((a, b) => a - b);
    if (JSON.stringify(baseDice) !== JSON.stringify(sortedDice)) return false;

    const numberOne = Math.pow(n1[0], n1[1]);
    const numberTwo = Math.pow(n2[0], n2[1]);
    const numberThree = Math.pow(n3[0], n3[1]);

    if (checkNums(numberOne, numberTwo, numberThree, currentNum)) {
      return currentNum;
    }
  } catch (err) {
    console.error("Error parsing inputs:", err);
  }

  return false;
}
