import React, { Component } from 'react';
import TimerEventEmitter from './timerEventEmitter';
import { millisecondsToHumanReadableTime } from '../helpers';
import beep from './success.wav';

const DEFAULT_BREAK_LENGTH_MN = 5;
const DEFAULT_SESSION_LENGTH_MN = 25;
const DEFAULT_TIME_LEFT_MS = DEFAULT_SESSION_LENGTH_MN * 60 * 1000;
const MIN_TIME_MN = 1;
const MAX_TIME_MN = 60;
const INTERVAL_MS = 1000 / 60;

class Pomodoro extends Component {
  state = {
    breakLengthInMinutes: DEFAULT_BREAK_LENGTH_MN,
    sessionLengthInMinutes: DEFAULT_SESSION_LENGTH_MN,
    timeLeftInMilliseconds: DEFAULT_TIME_LEFT_MS,
    timerIsRunning: false,
    phase: 'off'
  };

  ee = null;
  timer = null;
  audioPlayer = React.createRef();
  playPromise = null;

  componentDidMount() {
    this.ee = new TimerEventEmitter();
    this.ee.addEventListener('runTime', () => {
      const { sessionLengthInMinutes } = this.state;
      this.setState(
        {
          timerIsRunning: true,
          phase: 'work',
          timeLeftInMilliseconds: sessionLengthInMinutes * 60 * 1000
        },
        () => {
          const { timeLeftInMilliseconds } = this.state;
          this.startTimer(timeLeftInMilliseconds);
        }
      );
    });

    this.ee.addEventListener('breakTime', () => {
      const { breakLengthInMinutes } = this.state;
      this.setState(
        {
          timerIsRunning: true,
          phase: 'break',
          timeLeftInMilliseconds: breakLengthInMinutes * 60 * 1000
        },
        () => {
          const { timeLeftInMilliseconds } = this.state;
          this.startTimer(timeLeftInMilliseconds);
        }
      );
    });
  }

  beep = () => {
    const { current } = this.audioPlayer;
    this.playPromise = current.play().catch(e => console.log(e.message)); // eslint-disable-line no-console
  };

  resetBeep = () => {
    const { current } = this.audioPlayer;
    if (current.ended) {
      current.currentTime = 0;
      return;
    }

    if (current.currentTime > 0) {
      current.pause();
      current.currentTime = 0;
      return;
    }

    if (this.playPromise) {
      this.playPromise.then(() => {
        current.pause();
        current.currentTime = 0;
      });
    }
  };

  reset = () => {
    const { timerIsRunning } = this.state;
    if (timerIsRunning) {
      clearInterval(this.timer);
    }
    this.resetBeep();
    this.setState({
      breakLengthInMinutes: DEFAULT_BREAK_LENGTH_MN,
      sessionLengthInMinutes: DEFAULT_SESSION_LENGTH_MN,
      timeLeftInMilliseconds: 0,
      timerIsRunning: false,
      phase: 'off'
    });
  };

  decrementBreak = () => {
    const { breakLengthInMinutes } = this.state;
    this.setState({
      breakLengthInMinutes:
        breakLengthInMinutes === MIN_TIME_MN
          ? MIN_TIME_MN
          : breakLengthInMinutes - 1
    });
  };

  incrementBreak = () => {
    const { breakLengthInMinutes } = this.state;
    this.setState({
      breakLengthInMinutes:
        breakLengthInMinutes === MAX_TIME_MN
          ? MAX_TIME_MN
          : breakLengthInMinutes + 1
    });
  };

  decrementSession = () => {
    const { sessionLengthInMinutes } = this.state;
    this.setState({
      sessionLengthInMinutes:
        sessionLengthInMinutes === MIN_TIME_MN
          ? MIN_TIME_MN
          : sessionLengthInMinutes - 1
    });
  };

  incrementSession = () => {
    const { sessionLengthInMinutes } = this.state;
    this.setState({
      sessionLengthInMinutes:
        sessionLengthInMinutes === MAX_TIME_MN
          ? MAX_TIME_MN
          : sessionLengthInMinutes + 1
    });
  };

  startStop = () => {
    const { phase, timerIsRunning, timeLeftInMilliseconds } = this.state;
    if (phase === 'off') {
      this.ee.startRun();
      return;
    }
    if (!timerIsRunning) {
      this.startTimer(timeLeftInMilliseconds);
      return;
    }
    clearInterval(this.timer);
    this.setState({ timerIsRunning: false });
    return;
  };

  toggleTime = () => {
    const { phase } = this.state;
    clearInterval(this.timer);
    this.beep();
    this.setState(
      {
        timerIsRunning: false
      },
      () => {
        if (phase === 'work') {
          this.ee.startBreak();
          return;
        }
        if (phase === 'break') {
          this.ee.startRun();
          return;
        }
      }
    );
  };

  startTimer = timeLeftInMilliseconds => {
    this.setState(
      {
        timerIsRunning: true
      },
      () => {
        const end = Date.now() + timeLeftInMilliseconds;
        this.timer = setInterval(() => {
          const remainingTimeInMilliseconds = end - Date.now();
          this.setState(
            {
              timeLeftInMilliseconds:
                remainingTimeInMilliseconds < 0
                  ? 0
                  : remainingTimeInMilliseconds
            },
            () => {
              if (remainingTimeInMilliseconds < 0) {
                this.toggleTime();
              }
            }
          );
        }, INTERVAL_MS);
      }
    );
  };

  render() {
    const {
      breakLengthInMinutes,
      sessionLengthInMinutes,
      timeLeftInMilliseconds,
      phase
    } = this.state;

    return (
      <div>
        <div id="break-label">Break Length</div>
        <div id="break-length">{breakLengthInMinutes}</div>
        <div id="session-label">Session Length</div>
        <div id="session-length">{sessionLengthInMinutes}</div>
        {phase === 'work' ? (
          <div id="timer-label">Work Time!</div>
        ) : phase === 'break' ? (
          <div id="timer-label">Break Time!</div>
        ) : (
          <div id="timer-label">Off</div>
        )}
        <button id="break-decrement" onClick={this.decrementBreak}>
          Break Decrement
        </button>
        <button id="session-decrement" onClick={this.decrementSession}>
          Sessions Decrement
        </button>
        <button id="break-increment" onClick={this.incrementBreak}>
          Break Increment
        </button>
        <button id="session-increment" onClick={this.incrementSession}>
          Session Increment
        </button>
        <div id="time-left">
          {millisecondsToHumanReadableTime(timeLeftInMilliseconds)}
        </div>
        <button id="start_stop" onClick={this.startStop}>
          Start/Stop
        </button>
        <button id="reset" onClick={this.reset}>
          Reset
        </button>
        <audio ref={this.audioPlayer} src={beep} id="beep" />
      </div>
    );
  }
}

export default Pomodoro;
