import { configureStore, combineReducers } from "./redux";

describe("configureStore", () => {
  it("is a function", () => {
    expect(configureStore).toBeInstanceOf(Function);
  });
  it("generates store with reducer", () => {
    const state = 2;
    const store = configureStore(() => state);
    expect(store.getState).toBeInstanceOf(Function);

    expect(store.dispatch).toBeInstanceOf(Function);

    expect(store.subscribe).toBeInstanceOf(Function);
    expect(store.subscribe(jest.fn())).toBeInstanceOf(Function);
  });
});

describe("functional interface", () => {
  it("returns state based on initial state", () => {
    const state = { name: "Bob" };
    expect(configureStore(() => null).getState()).toBe(undefined);
    expect(configureStore(() => null, state).getState()).toBe(state);
  });

  it("calculates new state with reducer call", () => {
    const action1 = { type: "xxx" };
    const action2 = { type: "yyyy" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = configureStore(reducer);
    store.dispatch(action1);
    expect(reducer).toHaveBeenCalledWith(undefined, action1);
    expect(store.getState()).toBe(2);
    store.dispatch(action2);
    expect(reducer).toHaveBeenCalledWith(2, action2);
    expect(store.getState()).toBe(3);
  });

  it("notifies listeners about updates", () => {
    const action1 = { type: "xxx" };
    const action2 = { type: "yyyy" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = configureStore(reducer);
    const spy = jest.fn();
    store.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    store.dispatch(action1);
    expect(spy).toHaveBeenCalled();
    store.dispatch(action2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("allows to unsubscribe from the events", () => {
    const action1 = { type: "xxx" };
    const action2 = { type: "yyyy" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = configureStore(reducer);
    const spy = jest.fn();
    const unsubscribe = store.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    store.dispatch(action1);
    expect(spy).toHaveBeenCalled();
    unsubscribe();
    store.dispatch(action2);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("combineReducers", () => {
  it("is a function", () => {
    expect(combineReducers).toBeInstanceOf(Function);
  });
  it("returns a function", () => {
    expect(combineReducers()).toBeInstanceOf(Function);
  });
  it("returns a reducer based on the config (initial state)", () => {
    const reducer = combineReducers({
      a: (state = 2) => state,
      b: (state = "hop") => state,
    });
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      a: 2,
      b: "hop",
    });
  });
  it("calls subreducers with proper values", () => {
    type State = { a: number; b: number };
    const config = {
      a: jest.fn((state = 5, action = {}) => state + action.payload),
      b: jest.fn((state = 6, action = {}) => state - action.payload),
    };
    const reducer = combineReducers<State, { payload: number }>(config);
    const state: State = {
      a: 55,
      b: 66,
    };
    const action1 = { payload: 1 };
    const newState1 = reducer(state, { payload: 1 });
    expect(config.a).toHaveBeenCalledWith(55, action1);
    expect(config.b).toHaveBeenCalledWith(66, action1);
    expect(newState1).toEqual({
      a: 56,
      b: 65,
    });
    const action2 = { payload: 2 };
    const newState2 = reducer(newState1, action2);
    expect(config.a).toHaveBeenCalledWith(56, action2);
    expect(config.b).toHaveBeenCalledWith(65, action2);
    expect(newState2).toEqual({
      a: 58,
      b: 63,
    });
  });
});
