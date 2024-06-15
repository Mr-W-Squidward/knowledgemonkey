// This function calculates the greatest common divisor of two numbers using the recursive algorithm we learned in class
export function gcd(a: number, b: number): number {
  if (b === 0) return Math.abs(a);
  return gcd(b, a % b);
}

// Gets a random integer - Used for our fake options
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Randomized point and ratio generation for each question
export function generatePointsAndRatio() {
  const x1 = getRandomInt(-10, 10);
  const y1 = getRandomInt(-10, 10);
  const x2 = getRandomInt(-10, 10);
  const y2 = getRandomInt(-10, 10);
  
  let r1 = getRandomInt(1, 10);
  let r2 = getRandomInt(1, 10);
  
  const divisor = gcd(r1, r2);
  r1 /= divisor;
  r2 /= divisor;
  
  return { x1, y1, x2, y2, r1, r2 };
}

// Simplifying fractions before we display to the user using the GCD function
function simplifyFraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

// Calculating point C using the division point algorithm we learned, steps are also displayed to the user
export function calculatePointC(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
  const numeratorX = r1 * x2 + r2 * x1;
  const denominatorX = r1 + r2;
  const numeratorY = r1 * y2 + r2 * y1;
  const denominatorY = r1 + r2;

  const [simplifiedXNumerator, simplifiedXDenominator] = simplifyFraction(numeratorX, denominatorX);
  const [simplifiedYNumerator, simplifiedYDenominator] = simplifyFraction(numeratorY, denominatorY);

  const xc = simplifiedXNumerator / simplifiedXDenominator;
  const yc = simplifiedYNumerator / simplifiedYDenominator;

  // Formatting the explanation on different lines with simplification steps
  const explanationX = 
  `(r1*x2) + (r2 * x1) = Xn\n` + `X = Xn/denominator\n` + `denominatorX = r1 + r2 = ${r1} + ${r2} = ${denominatorX}\n` +
  `${r1} * ${x2} + ${r2} * ${x1} = ${numeratorX}\n` + `DIVIDED BY ${denominatorX}\n` +
  `= ${numeratorX}/${denominatorX}\n` +
  `= ${simplifiedXNumerator}/${simplifiedXDenominator}\n`;
  
const explanationY = 
  `(r1*y2) + (r2 * y1) = Yn\n` + `Y = Yn/denominator\n` + `denominatorY = r1 + r2 = ${r1} + ${r2} = ${denominatorY}\n` +
  `${r1} * ${y2} + ${r2} * ${y1} = ${numeratorY}\n` + `DIVIDED BY ${denominatorY}\n` +
  `= ${numeratorY}/${denominatorY}\n` +
  `= ${simplifiedYNumerator}/${simplifiedYDenominator}\n`;

  return { 
    xc, 
    yc, 
    explanationX, 
    explanationY, 
    simplifiedXNumerator, 
    simplifiedXDenominator, 
    simplifiedYNumerator, 
    simplifiedYDenominator, 
    fractionalX: `${simplifiedXNumerator}/${simplifiedXDenominator}`, 
    fractionalY: `${simplifiedYNumerator}/${simplifiedYDenominator}` 
  };
}

// Generating the fake options with our randomInt function/simplifying them
export function generateFakeOptions(correctX: string, correctY: string) {
  const fakeOptions: { xc: string; yc: string; }[] = [];
  const [correctXNum, correctXDen] = correctX.split('/').map(Number);
  const [correctYNum, correctYDen] = correctY.split('/').map(Number);

  while (fakeOptions.length < 3) {
    const fakeXNum = correctXNum + getRandomInt(-5, 5);
    const fakeXDen = correctXDen + getRandomInt(1, 10);
    const fakeYNum = correctYNum + getRandomInt(-5, 5);
    const fakeYDen = correctYDen + getRandomInt(1, 10);

    const [simplifiedFakeXNum, simplifiedFakeXDen] = simplifyFraction(fakeXNum, fakeXDen);
    const [simplifiedFakeYNum, simplifiedFakeYDen] = simplifyFraction(fakeYNum, fakeYDen);

    const fakeOption = {
      xc: `${simplifiedFakeXNum}/${simplifiedFakeXDen}`,
      yc: `${simplifiedFakeYNum}/${simplifiedFakeYDen}`
    };

    if (
      !fakeOptions.some(option => option.xc === fakeOption.xc && option.yc === fakeOption.yc) &&
      fakeOption.xc !== correctX &&
      fakeOption.yc !== correctY
    ) {
      fakeOptions.push(fakeOption);
    }
  }

  return fakeOptions;
}