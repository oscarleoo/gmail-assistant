// Thread detection and monitoring for Gmail

export class ThreadMonitor {
  constructor(onThreadChange) {
    this.currentThreadId = null;
    this.onThreadChange = onThreadChange;
    this.currentUrl = window.location.href;
  }

  start() {
    this.checkForThreadInDOM();
    this.startUrlMonitoring();
  }

  startUrlMonitoring() {
    setInterval(() => {
      if (window.location.href !== this.currentUrl) {
        this.currentUrl = window.location.href;
        setTimeout(() => this.checkForThreadInDOM(), 500);
      }
    }, 1000);
  }

  async checkForThreadInDOM(retries = 10) {
    const msgElements = document.querySelectorAll("h2[data-legacy-thread-id]");

    if (msgElements.length === 0 && retries > 0) {
      setTimeout(() => this.checkForThreadInDOM(retries - 1), 1000);
      return;
    }

    if (msgElements.length > 0) {
      const threadId = msgElements[0].getAttribute("data-legacy-thread-id");

      if (threadId !== this.currentThreadId) {
        this.currentThreadId = threadId;
        this.onThreadChange(threadId);
      }
    }
  }

  getCurrentThreadId() {
    return this.currentThreadId;
  }
}
