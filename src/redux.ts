export type Store<State = object, Action = { type: string }> = {
  getState(): State;
  dispatch(action: Action): void;
  subscribe(cb: () => void): () => void;
};

export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;

export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined
) => Store<State, Action>;

export function configureStore<State, Action>(
  reducer: Reducer<State, Action>,
  state?: State
) {
  let stateInner: State | undefined = state;
  /* eslint @typescript-eslint/ban-types: "off" */
  let funcs: Function[] = [];
  return {
    getState(): State {
      return stateInner as State;
    },

    dispatch(action: Action): void {
      stateInner = reducer(stateInner, action);
      funcs.forEach((func) => {
        func();
      });
    },

    subscribe(cb: () => void) {
      funcs.push(cb);

      return () => {
        funcs = funcs.filter((func) => func !== cb);
      };
    },
  };
}

export function combineReducers<State, Action>(config?: object) {
  return (state: State, action: Action) => {
    const result = {} as State;
    /* eslint no-restricted-syntax: "off" */
    for (const key in config) {
      if (config) {
        result[key as keyof State] = config[key as keyof object](
          state && state[key as keyof typeof state],
          action
        );
      }
    }
    return result;
  };
}
