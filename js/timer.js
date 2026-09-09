/**
 * ExamQuest Timer Engine
 * Accurate countdown timer with pause, resume, auto-submit, and formatted display
 */

class ExamTimer {
  constructor(initialSeconds = 18 * 60 + 35, options = {}) {
    this.remainingSeconds = initialSeconds;
    this.initialSeconds = initialSeconds;
    this.timerId = null;
    this.isRunning = false;
    this.onTick = options.onTick || null;
    this.onExpire = options.onExpire || null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timerId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        if (typeof this.onTick === 'function') {
          this.onTick(this.remainingSeconds, this.getFormattedTime());
        }
      } else {
        this.stop();
        if (typeof this.onExpire === 'function') {
          this.onExpire();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
  }

  pause() {
    this.stop();
  }

  resume() {
    this.start();
  }

  reset(seconds = null) {
    this.stop();
    this.remainingSeconds = seconds !== null ? seconds : this.initialSeconds;
    if (typeof this.onTick === 'function') {
      this.onTick(this.remainingSeconds, this.getFormattedTime());
    }
  }

  setSeconds(seconds) {
    this.remainingSeconds = Math.max(0, parseInt(seconds, 10));
    if (typeof this.onTick === 'function') {
      this.onTick(this.remainingSeconds, this.getFormattedTime());
    }
  }

  getSeconds() {
    return this.remainingSeconds;
  }

  /**
   * Format as HH:MM:SS matching reference screenshot ("00:18:35")
   */
  getFormattedTime() {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

if (typeof window !== 'undefined') {
  window.ExamTimer = ExamTimer;
}
