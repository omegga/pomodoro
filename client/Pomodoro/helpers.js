function formatTime(time) {
  return time < 10 && time >= 0 ? `0${time}` : time;
}

export function secondsToHumanReadableTime(s) {
  const secondsLeft = s % 60;
  const minutesLeft = (s - secondsLeft) / 60;
  return `${formatTime(minutesLeft)}:${formatTime(secondsLeft)}`;
}
