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
