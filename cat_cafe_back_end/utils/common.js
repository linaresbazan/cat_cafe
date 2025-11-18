export function addMinutes(date, minutesToAdd) {
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date;
}