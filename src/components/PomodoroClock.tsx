import { useState, useEffect, useRef } from "react";
import "../styles/PomodoroClock.css";

// Default durations (in seconds)
const DEFAULT_WORK = 25 * 60;
const DEFAULT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const CYCLE_THRESHOLD = 10;

const PomodoroClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Duration states (user-configurable)
  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK);
  const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK);
  const [cycleThreshold, setCycleThreshold] = useState(CYCLE_THRESHOLD);
  const [longbreak, setLongBreak] = useState(LONG_BREAK);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(workDuration);
  const [totalSessionTime, setTotalSessionTime] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Clock and theme toggles
  const [clockStyle, setClockStyle] = useState("analog");
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  type Timer = ReturnType<typeof setTimeout>; // or setInterval
  const intervalRef = useRef<Timer | null>(null);

  // Real-time clock for analog/digital header display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist and apply theme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Main countdown effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 0) {
            handleSessionEnd();
            return 0;
          } else if (prev < 1) { // Prevent negative seconds
            handleSessionEnd(); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, mode]);

  // Reset timer when switching durations or mode
  useEffect(() => {
    if (!isRunning) {
      if (mode === "work") {
        setSecondsLeft(workDuration);
        setTotalSessionTime(workDuration);
      } else {
        const isLongBreak =
          cyclesCompleted !== 0 && cyclesCompleted % cycleThreshold <= 0;
        const breakTime = isLongBreak ? longbreak : breakDuration;
        setSecondsLeft(breakTime);
        setTotalSessionTime(breakTime);
      }
    }
  }, [workDuration, breakDuration, mode, cyclesCompleted, isRunning]);

  // Handle end of a session (switch mode, play sound, notify)
  const handleSessionEnd = () => {
    setIsRunning(false);

    if (mode === "work") {
      setCyclesCompleted(cyclesCompleted + 1);
      showNotification("Work session complete! Time for a break.");
      playSound("alarm-work-end.mp3");
      setMode("break");
    } else {
      showNotification("Break over! Time to focus again.");
      playSound("alarm-break-end.mp3");
      setMode("work");
    }
  };

  // Start or pause timer
  const toggleTimer = () => setIsRunning((prev) => !prev);

  // Reset timer and session state
  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(workDuration);
    setCyclesCompleted(0);
    clearInterval(intervalRef.current!);
  };

  // Apply new duration settings and reset session
  const applyDurations = () => {
    setIsRunning(false);
    setCyclesCompleted(0);
    clearInterval(intervalRef.current!);

    if (mode === "work") {
      setSecondsLeft(workDuration);
      setTotalSessionTime(workDuration);
    } else {
      const isLongBreak =
        cyclesCompleted !== 0 && cyclesCompleted % cycleThreshold <= 0;
      const breakTime = isLongBreak ? longbreak : breakDuration;
      setSecondsLeft(breakTime);
      setTotalSessionTime(breakTime);
    }

    // Re-assign just in case values are updated by form
    setLongBreak(longbreak);
    setCycleThreshold(cycleThreshold);
  };

  // Format seconds to MM:SS
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0").slice(0, 3);
    return `${m}:${sec}`;
  };

  // Play alert sound from /public directory
  const playSound = (file: string) => {
    const audio = new Audio(`/${file}`);
    audio.play();
  };

  // Show desktop notification if permission is granted
  const showNotification = (msg: string) => {
    if (Notification.permission === "granted") {
      new Notification(msg);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(msg);
        }
      });
    }
  };

  // Progress bar percentage (0 to 100)
  const progressPercent = 100 * (1 - secondsLeft / totalSessionTime);

  return (
    <div className="pomodoro">
      {/* Header with date, title, clock, and toggles */}
      <div className={`header ${theme}`}>
        <div>{currentTime.toDateString()}</div>
        <div>Pomodoro Clock</div>

        <div className="right-section">
          <div className="clock-display">
            {clockStyle === "analog" ? (
              <div className="analog-clock">
                {/* Analog clock hands */}
                <div
                  className="hand hour"
                  style={{
                    transform: `rotate(${
                      (currentTime.getHours() % 12) * 30 +
                      currentTime.getMinutes() * 0.5 -
                      90
                    }deg)`,
                  }}
                />
                <div
                  className="hand minute"
                  style={{
                    transform: `rotate(${
                      currentTime.getMinutes() * 6 +
                      currentTime.getSeconds() * 0.1 -
                      90
                    }deg)`,
                  }}
                />
                <div
                  className="hand second"
                  style={{
                    transform: `rotate(${
                      currentTime.getSeconds() * 6 - 90
                    }deg)`,
                  }}
                />
              </div>
            ) : (
              <div className="digital-clock">
                {currentTime.toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="header-buttons">
            {/* Toggle between analog/digital */}
            <button
              onClick={() =>
                setClockStyle((prev) =>
                  prev === "analog" ? "digital" : "analog"
                )
              }
            >
              {clockStyle === "analog" ? "📟" : "🕒"}
            </button>

            {/* Toggle between light/dark theme */}
            <button
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>

      {/* Duration Settings */}
      <div className="settings">
        <label>
          Work (min)
          <input
            type="number"
            style={{ margin: "auto" }}
            value={workDuration / 60}
            onChange={(e) => setWorkDuration(Number(e.target.value) * 60)}
          />
        </label>
        <label>
          Break (min)
          <input
            type="number"
            style={{ margin: "auto" }}
            value={breakDuration / 60}
            onChange={(e) => setBreakDuration(Number(e.target.value) * 60)}
          />
        </label>
        <label>
          Long break cycles
          <input
            type="number"
            style={{ margin: "auto" }}
            value={cycleThreshold}
            onChange={(e) => setCycleThreshold(Number(e.target.value))}
          />
        </label>
        <label>
          Long break (min)
          <input
            style={{ margin: "auto" }}
            type="number"
            value={longbreak / 60}
            onChange={(e) => setLongBreak(Number(e.target.value) * 60)}
          />
        </label>
      </div>

      {/* Apply new durations */}
      <button className="apply-btn" onClick={applyDurations}>
        Apply
      </button>

      {/* Main timer area */}
      <div className="layout">
        <div className="main">
          <h2 className="mode">
            {mode === "work" ? "Work Time" : "Break Time"}
          </h2>
          <div className="timer">{formatTime(secondsLeft)}</div>

          {/* Visual progress bar */}
          <div className="progress-bar">
            <div
              className="fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Timer controls */}
          <div className="buttons">
            <button onClick={toggleTimer}>
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={resetTimer}>Reset</button>
          </div>
        </div>
      </div>

      {/* Footer showing completed cycles */}
      <div className={`footer ${theme}`}>✅ Cycles: {cyclesCompleted}</div>
    </div>
  );
};

export default PomodoroClock;
