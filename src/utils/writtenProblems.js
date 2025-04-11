export function calculateEquation(n1, n2, n3, o1, o2) {
  switch (o1) {
    case 1:
      switch (o2) {
        case 1:
          return n1 + n2 + n3;
        case 2:
          return n1 + n2 - n3;
        case 3:
          return n1 + n2 * n3;
        case 4:
          return n1 + n2 / n3;
      }
      break;
    case 2:
      switch (o2) {
        case 1:
          return n1 - n2 + n3;
        case 2:
          return n1 - n2 - n3;
        case 3:
          return n1 - n2 * n3;
        case 4:
          return n1 - n2 / n3;
      }
      break;
    case 3:
      switch (o2) {
        case 1:
          return n1 * n2 + n3;
        case 2:
          return n1 * n2 - n3;
        case 3:
          return n1 * n2 * n3;
        case 4:
          return (n1 * n2) / n3;
      }
      break;
    case 4:
      switch (o2) {
        case 1:
          return n1 / n2 + n3;
        case 2:
          return n1 / n2 - n3;
        case 3:
          return (n1 / n2) * n3;
        case 4:
          return n1 / n2 / n3;
      }
      break;
  }
}

export function generateEquationByDifficulty(targetDifficulty) {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function difficultyOfEquation(master) {
    const [d1, d2, d3, p1, p2, p3, o1, o2, total] = master;
    const diceList = [d1, d2, d3];
    let basesList = [];
    const maxExponents = [
      1, 1, 13, 10, 6, 6, 10, 6, 6, 6, 10, 3, 10, 3, 3, 3, 3, 3, 10, 3, 3,
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < maxExponents[diceList[i]]; j++) {
        basesList.push(Math.pow(diceList[i], j));
      }
    }
    const listOfDistances = basesList.map((b) => Math.abs(b - total));

    let smallestMultiplier = 0;
    let tenFlag = false;
    let largestNum = 0;

    if (o1 === 3) {
      if (d1 === 10 || d2 === 10) tenFlag = true;
      smallestMultiplier =
        Math.pow(d1, p1) >= Math.pow(d2, p2)
          ? Math.pow(d2, p2)
          : Math.pow(d1, p1);
    }
    if (o2 === 3) {
      if (d2 === 10 || d3 === 10) tenFlag = true;
      smallestMultiplier =
        Math.pow(d2, p2) >= Math.pow(d3, p3)
          ? Math.pow(d3, p3)
          : Math.pow(d2, p2);
    }
    if (smallestMultiplier <= 1) smallestMultiplier = 0;

    const shortestDistance = Math.min(...listOfDistances);
    const zeros = [p1, p2, p3].filter((x) => x === 0).length;
    const ones = [p1, p2, p3].filter((x) => x === 1).length;

    if (o1 !== 3 && o2 !== 3) {
      largestNum = Math.max(
        Math.pow(d1, p1),
        Math.pow(d2, p2),
        Math.pow(d3, p3)
      );
    } else if (o1 === 3) {
      largestNum = Math.max(
        Math.pow(d3, p3),
        Math.pow(d1, p1) * Math.pow(d2, p2)
      );
    } else if (o2 === 3) {
      largestNum = Math.max(
        Math.pow(d1, p1),
        Math.pow(d2, p2) * Math.pow(d3, p3)
      );
    }
    const largestNumDistance = Math.abs(largestNum - total);
    let diff =
      Math.pow(total, 0.5) +
      shortestDistance / 12 +
      (-1 * zeros) / 0.45 +
      (-1 * ones) / 0.7 +
      Math.pow(largestNum, 0.5) / 16 +
      largestNumDistance / 7 +
      Math.pow(smallestMultiplier, 0.75) / 2;

    if (tenFlag) {
      diff = (diff - 5) / 1.75;
    }
    if (diff > 90) {
      diff = 99 + diff / 5000;
    }
    if (diff > 100) {
      diff = 100;
    }
    return Math.round(diff * 100) / 100;
  }

  const opSymbols = { 1: "+", 2: "-", 3: "*", 4: "/" };
  const ops = [1, 2, 3, 4];

  const difficultyRanges = {
    easy: { min: 0, max: 10 },
    medium: { min: 10, max: 25 },
    hard: { min: 25, max: 40 },
    "very hard": { min: 40, max: 90 },
    impossible: { min: 90, max: Infinity },
  };

  const range = difficultyRanges[targetDifficulty.toLowerCase()];
  if (!range) throw new Error("Invalid difficulty level.");

  while (true) {
    const dice = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
    const exponents = [randInt(0, 3), randInt(0, 3), randInt(0, 3)];

    for (let i = 0; i < 3; i++) {
      if (dice[i] === 1 && exponents[i] !== 1) continue;
    }

    const nums = [
      Math.pow(dice[0], exponents[0]),
      Math.pow(dice[1], exponents[1]),
      Math.pow(dice[2], exponents[2]),
    ];

    const o1 = ops[randInt(0, ops.length - 1)];
    const o2 = ops[randInt(0, ops.length - 1)];

    let answer;
    try {
      answer = calculateEquation(nums[0], nums[1], nums[2], o1, o2);
    } catch {
      continue;
    }

    if (answer !== Math.floor(answer)) continue;
    answer = Math.floor(answer);
    if (answer < 0 || answer > 999) continue;

    const master = [...dice, ...exponents, o1, o2, answer];
    const diff = difficultyOfEquation(master);
    if (diff > range.min && diff < range.max) {
      return {
        dice: dice,
        exponents: exponents,
        operators: { codes: [o1, o2], symbols: [opSymbols[o1], opSymbols[o2]] },
        answer: answer,
        difficulty: diff,
      };
    }
  }
}

export function checkAnswer(equation, x, y, z) {
  if (
    x === 0 ||
    y === 0 ||
    z === 0 ||
    (x === 1 && equation.exponents[0] !== 1) ||
    (y === 1 && equation.exponents[1] !== 1) ||
    (z === 1 && equation.exponents[2] !== 1)
  )
    return false;

  const n1 = Math.pow(x, equation.exponents[0]);
  const n2 = Math.pow(y, equation.exponents[1]);
  const n3 = Math.pow(z, equation.exponents[2]);

  let result = calculateEquation(
    n1,
    n2,
    n3,
    equation.operators.codes[0],
    equation.operators.codes[1]
  );

  result = Math.floor(result);
  return result === equation.answer;
}
