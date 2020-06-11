import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./styles/index.scss";
import { store } from "./redux/store";
import { RESIZE } from "./constants";

render(
  <Provider store={store}>
    <div className="top">YOLO!</div>
  </Provider>,
  document.getElementById("app")
);

window.addEventListener("resize", () => {
  store.dispatch({
    type: RESIZE,
    payload: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });
});
