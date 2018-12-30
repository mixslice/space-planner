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

export const UNIT_TYPE = {
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high'
};

export const getUnitType = depth => {
  if (depth <= 10) {
    return UNIT_TYPE.LOW;
  } else if (depth <= 24) {
    return UNIT_TYPE.MIDDLE;
  } else {
    return UNIT_TYPE.HIGH;
  }
};

export const getKValue = rotation => {
  const r = Math.abs(rotation);
  let k;
  if (r <= 15) {
    k = 1;
  } else if (r <= 30) {
    k = 0.9;
  } else if (r <= 45) {
    k = 0.8;
  } else {
    k = 0.9;
  }
  return k;
};

export const getQValue = depth => {
  if (depth <= 50) {
    return 1;
  } else if (depth <= 75) {
    return 1.2;
  } else if (depth <= 100) {
    return 1.4;
  } else if (depth <= 200) {
    return 1.6;
  } else {
    return 1.8;
  }
};

export const getCoords = unit => {
  const { x: x1, y: y1, width, height, rotation } = unit;
  const rot = (rotation * Math.PI) / 180;

  const x2 = x1 + width * Math.cos(rot);
  const x4 = x1 - height * Math.sin(rot);
  const x3 = x4 + x2 - x1;

  const y2 = y1 + width * Math.sin(rot);
  const y4 = y1 + height * Math.cos(rot);
  const y3 = y4 + y2 - y1;

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
    { x: x4, y: y4 }
  ];
};

export const between1d = (a, b, x) =>
  !((x < Math.min(a, b)) ^ (x > Math.max(a, b)));
export const between2d = (point, seg) => {
  const { x, y } = point;
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = seg;
  const isSlopEqual = (y1 - y2) * (x - x2) - (y - y2) * (x1 - x2) < 1e-5;
  return x1 === x2 ? between1d(y1, y2, y) : between1d(x1, x2, x) && isSlopEqual;
};

export const pointToSeg = (point, seg) => {
  const { x, y } = point;
  const {
    0: { x: x1, y: y1 },
    1: { x: x2, y: y2 }
  } = seg;
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
  let isVertex = false;

  if (aSqr + cSqr - bSqr <= 0) {
    // const cosX1 = (aSqr + cSqr - bSqr) / (2 * a * c);
    intersection = { x: x1, y: y1 };
    distance = a;
    isVertex = true;
  } else if (bSqr + cSqr - aSqr <= 0) {
    // const cosX2 = (bSqr + cSqr - aSqr) / (2 * b * c);
    intersection = { x: x2, y: y2 };
    distance = b;
    isVertex = true;
  } else {
    const cosB = (aSqr + cSqr - bSqr) / (2 * a * c);
    intersection = {
      x: x1 + ((cosB * a) / c) * (x2 - x1),
      y: y1 + ((cosB * a) / c) * (y2 - y1)
    };
    distance = Math.sqrt(1 - cosB * cosB) * a;
  }
  return { intersection, distance, isVertex };
};

export const rayIntersect = (ray, seg) => {};

export const distanceBetweenUnits = (unit1, unit2) => {
  const coords1 = getCoords(unit1);
  const coords2 = getCoords(unit2);
  let point1;
  let point2;
  let isGable;
  let minDistance = Number.MAX_VALUE;
  for (let i = 0; i < coords1.length; i++) {
    for (let j = 0; j < coords2.length; j++) {
      const intersection1 = pointToSeg(coords1[i], [
        coords2[j],
        coords2[(j + 1) % coords2.length]
      ]);
      if (intersection1.distance < minDistance) {
        minDistance = intersection1.distance;
        point1 = coords1[i];
        point2 = intersection1.intersection;
        isGable = j === 1 || j === 3 || intersection1.isVertex;
      }
      const intersection2 = pointToSeg(coords2[i], [
        coords1[j],
        coords1[(j + 1) % coords1.length]
      ]);
      if (intersection2.distance < minDistance) {
        minDistance = intersection2.distance;
        point1 = intersection2.intersection;
        point2 = coords2[i];
        isGable = j === 1 || j === 3 || intersection2.isVertex;
      }
    }
  }
  return {
    points: [point1, point2],
    distance: minDistance,
    isGable
  };
};

export const getShadowRange = unit => {
  const coords = getCoords(unit);
  return [
    Math.min(coords[0].x, coords[1].x, coords[2].x, coords[3].x),
    Math.max(coords[0].x, coords[1].x, coords[2].x, coords[3].x)
  ];
};

export const checkRangeIntersection = (range1, range2) => {
  if (range1[1] < range2[0] || range1[0] > range2[1]) {
    return false;
  }
  return true;
};

export const calcLimit = (unit1, unit2, isGable) => {
  let limit = 0;
  const unitType1 = getUnitType(unit1.depth);
  const unitType2 = getUnitType(unit2.depth);
  const range1 = getShadowRange(unit1);
  const range2 = getShadowRange(unit2);
  const isIntersection = checkRangeIntersection(range1, range2);

  if (isIntersection) {
    let topUnit;
    let topUnitType;
    let belowUnit;
    let belowUnitType;
    let shadowRange;
    if (unit1.y < unit2.y) {
      topUnit = unit1;
      topUnitType = unitType1;
      belowUnit = unit2;
      belowUnitType = unitType2;
      shadowRange = range2;
    } else {
      topUnit = unit2;
      topUnitType = unitType2;
      belowUnit = unit1;
      belowUnitType = unitType1;
      shadowRange = range1;
    }
    const kValue = getKValue(belowUnit.rotation);
    const isParallel = Math.abs(unit1.rotation - unit2.rotation) <= 30;
    // rule 11.2, 11.3
    limit = isParallel ? 1.2 * kValue * belowUnit.depth : belowUnit.depth;

    // north control
    if (belowUnitType === UNIT_TYPE.LOW) {
      // rule 11
      limit = Math.max(limit, 10);
    } else if (belowUnitType === UNIT_TYPE.MIDDLE) {
      // rule 11
      limit = Math.max(limit, 13);
    } else if (belowUnitType === UNIT_TYPE.HIGH) {
      // rule 20.1
      const limitHigh =
        (belowUnit.depth - 24) * 0.3 + shadowRange[1] - shadowRange[0];
      if (limitHigh > 1.2 * belowUnit.depth) {
        // rule 20.1(1)
        limit = 1.2 * kValue * belowUnit.depth;
      }
      // rule 20.1
      limit = Math.max(limit, 29);
    }
    // south control
    if (topUnitType === UNIT_TYPE.HIGH) {
      // rule 21
      limit = Math.max(limit, 18 * getQValue(topUnit.depth));
    }
    // } else if (isFacing) {
    // TODO: rule 20.2(1)
  } else {
    if (unitType1 === UNIT_TYPE.HIGH) {
      const qValue = getQValue(unit1.depth);
      // rule 20.2(2), 20.2(3)
      limit = isGable ? 13 * qValue : 18 * qValue;
    }
    if (unitType2 === UNIT_TYPE.HIGH) {
      const qValue = getQValue(unit2.depth);
      // rule 20.2(2), 20.2(3)
      limit = Math.max(limit, isGable ? 13 * qValue : 18 * qValue);
    }
    // rule 15
    limit = Math.max(limit, 8);
  }
  return limit;
};
