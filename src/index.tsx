import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./styles/index.scss";
import { store } from "./redux/store";
import { RESIZE } from "./constants";
import { init } from "./redux/actions/init";

render(
  <Provider store={store}>
    <div id="videos"></div>
  </Provider>,
  document.getElementById("app"),
  () => {}
);

store.dispatch(init());

window.addEventListener("resize", () => {
  store.dispatch({
    type: RESIZE,
    payload: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });
});
