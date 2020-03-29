import datesAndTaxes from './dates-and-taxes.json';

export const indexOfDate = (date) => {
  let startIndex = 0;
  let endIndex = datesAndTaxes.length - 1;
  let loops = 0;
  while(startIndex <= endIndex) {
    loops++;
    if (loops > 20) {
      throw new Error('indexOfDate failed for ' + date);
    }
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
    if(date.getTime() === new Date(datesAndTaxes[middleIndex].date).getTime()) {
      return middleIndex;
    } else if(date.getTime() > new Date(datesAndTaxes[middleIndex].date).getTime()) {
      startIndex = middleIndex + 1;
    } else if(date.getTime() < new Date(datesAndTaxes[middleIndex].date).getTime()) {
      endIndex = middleIndex - 1;
    } 
  }

  return -1;
}

export const findDate = (date) => {
  const idx = indexOfDate(date);
  return idx > -1 ? datesAndTaxes[idx] : null;
}
