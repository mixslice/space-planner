import SunCalc from 'suncalc';

const generateInitalState = () => {
  const lat = 31.2304;
  const lng = 121.4737;
  const date = new Date('2018-01-20');

  const { sunriseEnd, sunsetStart } = SunCalc.getTimes(date, lat, lng);

  return {
    lat,
    lng,
    dateStartValue: sunriseEnd.valueOf(),
    dateEndValue: sunsetStart.valueOf(),
    dateValue: sunriseEnd.valueOf()
  };
};

export default (state = generateInitalState(), action) => {
  switch (action.type) {
    case 'UPDATE_DATETIME':
      return {
        ...state,
        dateValue: action.payload.value
      };
    default:
      return state;
  }
};

export const updateDatetime = value => ({
  type: 'UPDATE_DATETIME',
  payload: { value: Number(value) }
});
