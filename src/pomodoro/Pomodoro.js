import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import Control from "./Controls";
import Duration from "./DurationTimer";
import DisplayStatus from "./DisplayStatus";

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const handleFocusDecrease = () =>
    setFocusDuration(Math.max(5, focusDuration - 5));
  const handleFocusIncrease = () =>
    setFocusDuration(Math.min(60, focusDuration + 5));

  const handleBreakDecrease = () =>
    setBreakDuration(Math.max(1, breakDuration - 1));
  const handleBreakIncrease = () =>
    setBreakDuration(Math.min(15, breakDuration + 1));

  const handleStop = () => {
    setFocusDuration(25);
    setBreakDuration(5);
    setSession(null);
    setIsTimerRunning(false);
  };

  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  return (
    <div className="pomodoro">
      <Duration
        session={session}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        handleFocusDecrease={handleFocusDecrease}
        handleFocusIncrease={handleFocusIncrease}
        handleBreakDecrease={handleBreakDecrease}
        handleBreakIncrease={handleBreakIncrease}
      />

      <Control
        session={session}
        isTimerRunning={isTimerRunning}
        handleStop={handleStop}
        playPause={playPause}
      />

      <DisplayStatus
        session={session}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        isTimerRunning={isTimerRunning}
      />
    </div>
  );
}

export default Pomodoro;
