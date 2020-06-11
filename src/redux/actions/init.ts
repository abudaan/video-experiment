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
    } else {
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
  let numCanvases = 1;
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
