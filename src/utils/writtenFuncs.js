export function splitStringNumber(s, dice) {
  if (!/^\d+$/.test(s)) {
    throw new Error("Input must be digits only.");
  }

  if (s.length === 1) {
    const base = parseInt(s);
    if (!dice.includes(base)) throw new Error("Base not in dice");
    return [base, 1];
  }

  // Try double-digit base first
  if (s.length >= 2) {
    const base2 = parseInt(s.slice(0, 2));
    const exp2 = parseInt(s.slice(2) || "1");

    if (dice.includes(base2)) {
      if (s.length === 2 || s.length === 3) {
        return [base2, exp2];
      } else {
        throw new Error("Exponent must be 1 digit");
      }
    }
  }

  // Fallback to single-digit base
  const base1 = parseInt(s[0]);
  const exp1 = parseInt(s.slice(1));
  if (dice.includes(base1)) {
    return [base1, exp1];
  }

  throw new Error("Base not found in dice");
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
    const n1 = splitStringNumber(n1s, dice);
    const n2 = splitStringNumber(n2s, dice);
    const n3 = splitStringNumber(n3s, dice);
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
