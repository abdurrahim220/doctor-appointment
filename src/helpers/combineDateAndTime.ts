function combineDateAndTime(date: string, time: string, timezoneOffset = "+06:00"): Date {
  return new Date(`${date}T${time}:00.000${timezoneOffset}`);
}
export default combineDateAndTime;
