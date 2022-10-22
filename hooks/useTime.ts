import { useEffect, useState } from 'react';

export const getFormattedTime = (date: Date, showSeconds = false) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}${
    showSeconds ? `:${date.getSeconds().toString().padStart(2, '0')}` : ''
  }`;

const useTime = (date: Date, showSeconds = false) => {
  const [curDate, setCurDate] = useState('');

  useEffect(() => setCurDate(getFormattedTime(date, showSeconds)), []);

  return curDate;
};

export default useTime;
