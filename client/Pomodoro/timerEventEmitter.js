export default class TimerEventEmitter extends EventTarget {
  startBreak() {
    this.dispatchEvent(new Event('breakTime'));
  }

  startRun() {
    this.dispatchEvent(new Event('runTime'));
  }
}
