# ⏳ Pomodoro Clock

A sleek, customizable Pomodoro Timer built with **React** and **TypeScript**, featuring analog/digital clocks, light/dark themes, audio alerts, desktop notifications, and flexible session controls.

## 🚀 Live Demo
Try it out on **Netlify**: [[https://pomodoro-clock-by-chinmay.netlify.app](https://pomodoro-clock-by-chinmay.netlify.app)]

## 🧠 What is Pomodoro?
The **Pomodoro Technique** is a time management method that uses 25-minute focused work sessions followed by short breaks to enhance productivity and reduce mental fatigue.

## ✨ Features
- ⏰ Analog & Digital Clock Displays
- 🎨 Light & Dark Theme Toggle (persists via `localStorage`)
- 🔄 Configurable Work & Break Durations
- 🔁 Long Break Support after N Cycles
- 📢 Audio Alerts & Desktop Notifications
- 📊 Visual Progress Bar
- 🧮 Tracks Completed Cycles

🧾 How to Use
- Click Start to begin the timer.
- Use Pause to stop temporarily, or Reset to restart.
- Timer will switch between Work and Break sessions automatically.
- When a work session ends, a sound will play and a notification pops up.
- After X cycles, you'll get a long break.

⚙️ Customizing Intervals
You can change durations anytime via the inputs above the timer.
- Work (min) – Set your work session duration
- Break (min) – Short break duration after each session
- Long break (min) – Longer rest after several cycles
- Long break cycles – How many sessions before a long break
- Click Apply after changing values to update the timer.


## ⚙️ Tech Stack
- React + TypeScript
- Plain CSS (no frameworks)
- Custom Hooks and Refs
- HTML Audio + Web Notifications API

## 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/EventHorizonChinmay/pomodoro-clock.git
cd pomodoro-clock

# Install dependencies
npm install

# Run in development mode
npm run dev
