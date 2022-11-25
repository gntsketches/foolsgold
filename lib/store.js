class Store {
  constructor() {
    this.state = null;
    this.stateRegistered = {};
    this.registered = {};
  }

  initState(initialState) {
    this.state = initialState;
  }

  setState(key, val) {
    this.state[key] = val;

    this.statePublish(key);
  }

  stateRegister(field, callback) {
    this.stateRegistered[field] = callback;
  }

  statePublish(field) {
    if (this.stateRegistered[field]) this.stateRegistered[field]();
  }

  register(field, callback) {
    this.registered[field] = callback;
  }

  publish(field) {
    if (this.registered[field]) this.registered[field]();
  }
}

const store = new Store();
export default store;
