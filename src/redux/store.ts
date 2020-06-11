import { compose, applyMiddleware, createStore, Store, AnyAction } from "redux";
import { createLogger } from "redux-logger";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { rootReducer } from "./reducer";
import { RootState } from "../types";
import { Observable, Subscriber } from "rxjs";

const initialState: RootState = { width: 0, height: 0 };

// const store: Store<any, AnyAction> = createStore(
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk as ThunkMiddleware<RootState, AnyAction>)
  // compose(applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })))
);

const state$ = new Observable((observer: Subscriber<RootState>) => {
  observer.next(store.getState());
  const unsubscribe = store.subscribe(() => {
    observer.next(store.getState());
  });
  return unsubscribe;
});

const getState$ = (): Observable<RootState> => {
  return state$;
};

export { getState$, store };
