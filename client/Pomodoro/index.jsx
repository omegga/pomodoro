import React, { Component } from 'react';
import { secondsToHumanReadableTime } from './helpers';
import { LengthControl } from './LengthControl';
import { TimerControl } from './TimerControl';
import beep from './success.wav';

const DEFAULT_BREAK_LENGTH_MN = 5;
const DEFAULT_SESSION_LENGTH_MN = 25;
const DEFAULT_TIME_LEFT_SEC = DEFAULT_SESSION_LENGTH_MN * 60;
const MIN_TIME_MN = 1;
const MAX_TIME_MN = 60;
const INTERVAL_MS = 1000;

class Pomodoro extends Component {
  state = {
    breakLengthInMinutes: DEFAULT_BREAK_LENGTH_MN,
    sessionLengthInMinutes: DEFAULT_SESSION_LENGTH_MN,
    timeLeftInSeconds: DEFAULT_TIME_LEFT_SEC,
    phase: 'off',
    timer: null
  };

  audioPlayer = React.createRef();

  beep = () => {
    const { current } = this.audioPlayer;
    this.resetBeep();
    current.play().catch(e => console.log(e.message)); // eslint-disable-line no-console
  };

  resetBeep = () => {
    const { current } = this.audioPlayer;
    current.pause();
    current.currentTime = 0;
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

  reset = () => {
    const { timer } = this.state;
    if (timer) {
      clearInterval(timer);
    }
    this.resetBeep();
    this.setState({
      timer: null,
      breakLengthInMinutes: DEFAULT_BREAK_LENGTH_MN,
      sessionLengthInMinutes: DEFAULT_SESSION_LENGTH_MN,
      timeLeftInSeconds: DEFAULT_TIME_LEFT_SEC,
      phase: 'off'
    });
  };

  startStop = () => {
    const {
      sessionLengthInMinutes,
      phase,
      timeLeftInSeconds,
      timer
    } = this.state;
    if (phase === 'off') {
      this.setState({
        phase: 'work',
        timer: this.startTimer(sessionLengthInMinutes * 60)
      });
      return;
    }
    if (!timer) {
      this.setState(
        {
          timeLeftInSeconds
        },
        () => {
          this.setState({
            timer: this.startTimer(timeLeftInSeconds)
          });
        }
      );
      return;
    }
    clearInterval(this.state.timer);
    this.setState({ timer: null, timeLeftInSeconds });
    return;
  };

  startTimer = timeLeftInSeconds => {
    return setInterval(() => {
      const {
        sessionLengthInMinutes,
        breakLengthInMinutes,
        phase,
        timer
      } = this.state;
      if (timeLeftInSeconds === 0) {
        clearInterval(timer);
        this.beep();
        if (phase === 'work') {
          const timeLeftInSeconds = breakLengthInMinutes * 60;
          this.setState({
            timer: this.startTimer(timeLeftInSeconds),
            phase: 'break',
            timeLeftInSeconds
          });
          return;
        }
        if (phase === 'break') {
          const timeLeftInSeconds = sessionLengthInMinutes * 60;
          this.setState({
            timer: this.startTimer(timeLeftInSeconds),
            phase: 'work',
            timeLeftInSeconds
          });
          return;
        }
      }
      timeLeftInSeconds--;
      this.setState({
        timeLeftInSeconds
      });
    }, INTERVAL_MS);
  };

  render() {
    const {
      breakLengthInMinutes,
      sessionLengthInMinutes,
      timeLeftInSeconds,
      phase
    } = this.state;

    return (
      <div className="pomodoro">
        <LengthControl
          name="session"
          length={sessionLengthInMinutes}
          increment={this.incrementSession}
          decrement={this.decrementSession}
        />
        <LengthControl
          name="break"
          length={breakLengthInMinutes}
          increment={this.incrementBreak}
          decrement={this.decrementBreak}
        />
        <div
          id="time-left"
          className={`circle center ${
            phase === 'work'
              ? 'working'
              : phase === 'break'
              ? 'breaking'
              : 'off'
          }`}
        >
          {secondsToHumanReadableTime(timeLeftInSeconds)}
        </div>
        <div id="timer-label">
          {phase === 'work' ? 'Work' : phase === 'break' ? 'Break' : 'Off'}
        </div>
        <TimerControl startStop={this.startStop} reset={this.reset} />
        <audio ref={this.audioPlayer} src={beep} id="beep" />
      </div>
    );
  }
}

export default Pomodoro;
