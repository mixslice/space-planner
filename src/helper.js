import SunCalc from 'suncalc';

export const calcShadow = (date, lat, lng, height) => {
  const { altitude, azimuth } = SunCalc.getPosition(date, lat, lng);
  const length = Math.abs(height / Math.tan(altitude));
  const shiftX = length * Math.sin(azimuth);
  const shiftY = -length * Math.cos(azimuth);
  return {
    shiftX,
    shiftY,
    degree: (azimuth * 180) / Math.PI
  };
};

export const between1d = (a, b, x) => !((a > x) ^ (b < x));
export const between2d = (x1, y1, x2, y2, x, y) => {
  return x1 === x2 ? between1d(y1, y2, y) : between1d(x1, x2, x);
};

export const pointToSeg = (x1, y1, x2, y2, x, y) => {
  /**
   * a = (x, y) -> (x1, y1)
   * b = (x, y) -> (x2, y2)
   * c = (x1, y1) -> (x2, y2)
   */
  const aSqr = (x - x1) * (x - x1) + (y - y1) * (y - y1);
  const bSqr = (x - x2) * (x - x2) + (y - y2) * (y - y2);
  const cSqr = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  const a = Math.sqrt(aSqr);
  const b = Math.sqrt(bSqr);
  const c = Math.sqrt(cSqr);

  let intersection;
  let distance;

  if (aSqr + cSqr - bSqr <= 0) {
    // const cosX1 = (aSqr + cSqr - bSqr) / (2 * a * c);
    intersection = { x: x1, y: y1 };
    distance = a;
  } else if (bSqr + cSqr - aSqr <= 0) {
    // const cosX2 = (bSqr + cSqr - aSqr) / (2 * b * c);
    intersection = { x: x2, y: y2 };
    distance = b;
  } else {
    const cosB = (aSqr + cSqr - bSqr) / (2 * a * c);
    intersection = {
      x: x1 + ((cosB * a) / c) * (x2 - x1),
      y: y1 + ((cosB * a) / c) * (y2 - y1)
    };
    distance = Math.sqrt(1 - cosB * cosB) * a;
  }
  return intersection;
};
export const segToSeg = (x1, y1, x2, y2, x3, y3, x4, y4) => {};
export const unitToUnit = (x1, y1, x2, y2, x3, y3, x4, y4) => {};
