export default class EventEmitter {
  #events;
  constructor() {
    this.#events = {};
  }

  on(event, listener) {
    if (!this.#events[event]) this.#events[event] = [];
    this.#events[event].push(listener);
  }
  emit(event, ...args) {
    if (this.#events[event]) this.#events[event].forEach(listener => listener(...args));
  }
}
