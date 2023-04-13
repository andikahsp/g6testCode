function getUTCDateObject(logsourceTime) {
    const actualTime = new Date(0);
    actualTime.setUTCSeconds(logsourceTime);
    return actualTime;
  }
  
  
  function toUTCTimeString(logsourceTime) {
    const dateObjUTC = getUTCDateObject(logsourceTime);
   return dateObjUTC.toUTCString();
  }
  
  function toTimeString(number) {
    return number < 10 ? `0${number.toString()}` : `${number.toString()}`;
  }
  
  
  export function getUTCHrMinSec(logsourceTime) {
    const dateObjUTC = getUTCDateObject(logsourceTime);
    const hours = dateObjUTC.getUTCHours();
    const minutes = dateObjUTC.getUTCMinutes();
    const seconds = dateObjUTC.getUTCSeconds();
  
    const hoursString = toTimeString(hours);
    const minutesString = toTimeString(minutes);
    const secondsString = toTimeString(seconds); 
  
    return hoursString + `:` + minutesString + `.` + secondsString;
  }
  