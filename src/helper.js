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

export const getRad = rotation => (rotation * Math.PI) / 180;

export const transformCoodinate = (point, zero = { x: 0, y: 0 }, rad = 0) => {
  const cosT = Math.cos(rad);
  const sinT = Math.sin(rad);
  const x = (point.x - zero.x) * cosT + (point.y - zero.y) * sinT;
  const y = -(point.x - zero.x) * sinT + (point.y - zero.y) * cosT;
  return { x, y };
};

/**
 *
 * @param {{x, y}} anchor rotation anchor
 * @param {Number} radian rotation radian
 * @param {{x, y}} offset offset to anchor
 * @returns {{x, y}}
 */
export const getCoordsWithAnchor = (anchor, radian, offset) => {
  const x =
    anchor.x + offset.x * Math.cos(radian) - offset.y * Math.sin(radian);
  const y =
    anchor.y + offset.x * Math.sin(radian) + offset.y * Math.cos(radian);
  return { x, y };
};

export const getCoords = unit => {
  const { x, y, width, height, rotation } = unit;
  const rad = getRad(rotation);

  const anchor = { x, y };
  const p2 = getCoordsWithAnchor(anchor, rad, { x: width, y: 0 });
  const p3 = getCoordsWithAnchor(anchor, rad, { x: width, y: height });
  const p4 = getCoordsWithAnchor(anchor, rad, { x: 0, y: height });

  return [anchor, p2, p3, p4];
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

export const isRayIntersectWithSeg = (ray, seg) => {
  const [p1, p2] = ray;
  const [p3, p4] = seg;
  const getAng = (a, b) => {
    let ang;
    if (a.y === b.y) {
      ang = a.x > b.x ? 0 : Math.PI;
    } else {
      ang = -Math.atan((a.x - b.x) / (a.y - b.y));
      if (a.y < b.y) {
        ang += a.x < b.x ? Math.PI : -Math.PI;
      }
    }
    if (ang < 0) {
      ang += Math.PI * 2;
    }
    return ang;
  };

  const ang1 = getAng(p1, p4);
  const ang2 = getAng(p1, p3);
  const ang3 = getAng(p1, p2);
  const inRange = ang3 > Math.min(ang1, ang2) && ang3 < Math.max(ang1, ang2);
  if (Math.abs(ang1 - ang2) < Math.PI) {
    return inRange;
  } else {
    return !inRange;
  }
};

export function checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  // const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (denom === 0) {
    return false;
  }

  const uA = numeA / denom;

  return {
    x: x1 + uA * (x2 - x1),
    y: y1 + uA * (y2 - y1)
  };
}

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
    isGable,
    coords1,
    coords2
  };
};
/**
 * get bounding box
 * @param {*} unit
 */
export const getBBox = unit => {
  const c = getCoords(unit);
  return {
    xmin: Math.min(c[0].x, c[1].x, c[2].x, c[3].x),
    xmax: Math.max(c[0].x, c[1].x, c[2].x, c[3].x),
    ymin: Math.min(c[0].y, c[1].y, c[2].y, c[3].y),
    ymax: Math.max(c[0].y, c[1].y, c[2].y, c[3].y)
  };
};

export const checkRangeIntersection = (range1, range2) => {
  if (range1[1] < range2[0] || range1[0] > range2[1]) {
    return false;
  }
  return true;
};

export const getRoughDistance = (unit1, unit2) => {
  const bbox1 = getBBox(unit1);
  const bbox2 = getBBox(unit2);
  let distanceX = 0;
  let distanceY = 0;
  if (bbox1.xmax < bbox2.xmin) {
    distanceX = bbox2.xmin - bbox1.xmax;
  }
  if (bbox2.xmax < bbox1.xmin) {
    distanceX = bbox1.xmin - bbox2.xmax;
  }
  if (bbox1.ymax < bbox2.ymin) {
    distanceY = bbox2.ymin - bbox1.ymax;
  }
  if (bbox2.ymax < bbox1.ymin) {
    distanceY = bbox1.ymin - bbox2.ymax;
  }
  return {
    distanceX,
    distanceY
  };
};

export const checkFacing = (unit1, unit2) => {
  const { x: x1, y: y1 } = transformCoodinate(
    { x: unit2.x, y: unit2.y },
    { x: unit1.x, y: unit1.y },
    getRad(unit1.rotation)
  );
  if (y1 < 0) return false;

  const rotation = unit2.rotation - unit1.rotation;
  const rad = getRad(rotation);
  const anchor = { x: x1, y: y1 };
  const { x: x2 } = getCoordsWithAnchor(anchor, rad, {
    x: unit2.width,
    y: 0
  });
  const { x: x3 } = getCoordsWithAnchor(anchor, rad, {
    x: unit2.width,
    y: unit2.height
  });
  const { x: x4 } = getCoordsWithAnchor(anchor, rad, {
    x: 0,
    y: unit2.height
  });

  const range1 = [Math.min(x1, x2, x3, x4), Math.max(x1, x2, x3, x4)];
  const range2 = [0, unit2.width];
  return checkRangeIntersection(range1, range2);
};

export const checkShadowFacing = (unit1, unit2, bbox2) => {
  if (!bbox2) bbox2 = getBBox(unit2);
  const {
    0: { x: x1, y: y1 },
    3: { x: x4, y: y4 }
  } = getCoords(unit1);
  const intersection = checkIntersection(
    x1,
    y1,
    x4,
    y4,
    bbox2.xmin,
    bbox2.ymax,
    bbox2.xmin,
    bbox2.ymax + 1
  );
  if (intersection) {
    return intersection.y < bbox2.ymax && between1d(intersection.y, y1, y4);
  }
  return false;
};

export const checkRuleFacing = (unit1, unit2, bbox2) => {
  return checkFacing(unit1, unit2) || checkShadowFacing(unit1, unit2, bbox2);
};

export const calcLimit = (unit1, unit2, isGable) => {
  let limit = 0;
  const unitType1 = getUnitType(unit1.depth);
  const unitType2 = getUnitType(unit2.depth);
  const bbox1 = getBBox(unit1);
  const bbox2 = getBBox(unit2);
  const range1 = [bbox1.xmin, bbox1.xmax];
  const range2 = [bbox2.xmin, bbox2.xmax];
  const isIntersected = checkRangeIntersection(range1, range2);
  let isFacing = false;

  if (isIntersected) {
    let topUnit;
    let topUnitType;
    let belowUnit;
    let belowUnitType;
    let belowBBox;
    if (unit1.y < unit2.y) {
      topUnit = unit1;
      topUnitType = unitType1;
      belowUnit = unit2;
      belowUnitType = unitType2;
      belowBBox = bbox1;
    } else {
      topUnit = unit2;
      topUnitType = unitType2;
      belowUnit = unit1;
      belowUnitType = unitType1;
      belowBBox = bbox1;
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
        (belowUnit.depth - 24) * 0.3 + belowBBox.xmax - belowBBox.xmin;
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
  } else {
    // rule 20.2(1)
    if (unitType2 === UNIT_TYPE.HIGH && checkRuleFacing(unit1, unit2, bbox2)) {
      isFacing = true;
      limit = Math.max(limit, 24 * getQValue(unit2.depth));
    }
    if (unitType1 === UNIT_TYPE.HIGH && checkRuleFacing(unit2, unit1, bbox2)) {
      isFacing = true;
      limit = Math.max(limit, 24 * getQValue(unit1.depth));
    }
    if (!isFacing) {
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
      limit = Math.max(limit, isGable ? 8 : 13);
    }
  }
  return { limit, isIntersected, isFacing };
};
