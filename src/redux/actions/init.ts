import { Dispatch } from "redux";
import { VIDEO_STREAM } from "../../constants";

const createCanvases = (
  num: number,
  width: number,
  height: number,
  div: HTMLElement
): [HTMLCanvasElement, CanvasRenderingContext2D][] => {
  const canvases = [];

  const angle = 360 / num;
  const circleSize = 700;
  const scale = num <= 4 ? 1 : 1 - num / 50;
  console.log(scale);

  let rot = 0;
  for (let i = 0; i < num; i++) {
    let canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.id = `canvas-${i}`;
    canvas.className = "float";
    canvas.style.margin = `-${(width * scale) / 2}px`;
    if (num > 4) {
      // canvas.style.left = `${i * width * scale}px`;
      canvas.style.transform = `rotate(${rot}deg) translate(${circleSize / 2}px)`;
      rot = rot + angle;
    } else if (num === 2) {
      if (i === 0) {
        const h = div.getBoundingClientRect().height;
        canvas.style.transform = `translate(0px, ${h - height * 1.5}px)`;
      } else {
        canvas.style.transform = `rotate(180deg) translate(0px, ${height / 2}px)`;
      }
    } else if (num === 3) {
      if (i === 0) {
        const h = div.getBoundingClientRect().height;
        canvas.style.transform = `translate(0px, ${h - height * 1.5}px)`;
      } else if (i === 1) {
        canvas.style.transform = `rotate(180deg) translate(0px, ${height / 2}px)`;
      } else {
        const w = div.getBoundingClientRect().width;
        // canvas.style.transform = `rotate(90deg) translate(${-width}px, ${0}px)`;
        canvas.style.transform = `rotate(90deg) translate(${0}px, ${w / 2}px)`;
      }
    } else if (num === 4) {
      if (i === 0) {
        const h = div.getBoundingClientRect().height;
        console.log(h, window.innerHeight);
        // canvas.style.transform = `translate(0px, ${h - height * 1.5}px)`;
        // canvas.style.transform = `translate(0px, ${h / 2 - canvas.width / 2}px)`;
        canvas.style.transform = `translate(0px, ${canvas.width / 2}px)`;
      } else if (i === 1) {
        const h = div.getBoundingClientRect().height;
        // canvas.style.transform = `rotate(180deg) translate(0px, ${height / 2}px)`;
        canvas.style.transform = `rotate(180deg) translate(0px, ${h / 2 - canvas.width / 2}px)`;
      } else if (i === 2) {
        const w = div.getBoundingClientRect().width;
        // canvas.style.transform = `rotate(90deg) translate(${-width}px, ${0}px)`;
        canvas.style.transform = `rotate(90deg) 
        translate(${0}px, ${w / 2 - canvas.height / 2}px)`;
      } else {
        const w = div.getBoundingClientRect().width;
        // canvas.style.transform = `rotate(90deg) translate(${-width}px, ${0}px)`;
        canvas.style.transform = `rotate(-90deg) 
        translate(${0}px, ${w / 2 - canvas.height / 2}px)`;
      }
    }
    const context = canvas.getContext("2d");
    // context.scale(scale, scale);
    div.appendChild(canvas);
    canvases.push([canvas, context]);
  }
  // console.log(width, height);
  return canvases;
};

export const init = () => async (dispatch: Dispatch): Promise<void> => {
  const s = await navigator.mediaDevices.getUserMedia({
    // video: { width: 1280 / 2, height: 720 / 2, frameRate: { ideal: 10, max: 15 } },
    video: true,
    audio: true,
  });

  let videoWidth = 0;
  let videoHeight = 0;
  const video = document.createElement("VIDEO") as HTMLVideoElement;
  video.srcObject = s;
  s.getTracks().forEach(track => {
    if (track.kind === "video") {
      const settings = track.getSettings();
      videoWidth = settings.width;
      videoHeight = settings.height;
    }
  });

  const div = document.getElementById("videos");
  const range = document.getElementById("num");

  let canvases = [];
  let numCanvases = 4;
  canvases = createCanvases(numCanvases, videoWidth, videoHeight, div);

  range.addEventListener("change", (e: Event) => {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    numCanvases = (e.target as HTMLInputElement).valueAsNumber;
    canvases = createCanvases(numCanvases, videoWidth, videoHeight, div);
  });

  const render = () => {
    const scale = numCanvases <= 4 ? 1 : 1 - numCanvases / 50;
    canvases.forEach(([, context]) => {
      context.drawImage(video, 0, 0, videoWidth * scale, videoHeight * scale);
    });
    requestAnimationFrame(render);
  };

  video.play();
  render();

  dispatch({
    type: VIDEO_STREAM,
    payload: {
      stream: s,
    },
  });
};
