function formatTime(time) {
  return time < 10 && time >= 0 ? `0${time}` : time;
}

export function millisecondsToHumanReadableTime(ms) {
  const roundToSeconds = (ms - (ms % 1000)) / 1000;
  const secondsLeft = roundToSeconds % 60;
  const minutesLeft = (roundToSeconds - secondsLeft) / 60;
  return `${formatTime(minutesLeft)}:${formatTime(secondsLeft)}`;
}
