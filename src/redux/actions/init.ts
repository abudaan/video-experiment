import { Dispatch } from "redux";
import { VIDEO_STREAM } from "../../constants";

const createCanvases = (
  num: number,
  scale: number,
  width: number,
  height: number,
  div: HTMLElement
): [HTMLCanvasElement, CanvasRenderingContext2D][] => {
  const canvases = [];
  for (let i = 0; i < num; i++) {
    const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    // context.scale(scale, scale);
    div.appendChild(canvas);
    canvases.push([canvas, context]);
  }
  console.log(width, height);
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

  let scale = 0.3;
  let canvases = [];
  let numCanvases = 1;
  canvases = createCanvases(numCanvases, scale, videoWidth, videoHeight, div);

  range.addEventListener("change", (e: Event) => {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    numCanvases = (e.target as HTMLInputElement).valueAsNumber;
    canvases = createCanvases(numCanvases, scale, videoWidth, videoHeight, div);
  });

  const render = () => {
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
