import "./styles/index.scss";

const createCanvases = (
  num: number,
  width: number,
  height: number,
  div: HTMLElement
): [HTMLCanvasElement, CanvasRenderingContext2D][] => {
  const canvases = [];
  const angle = 360 / num;
  const circleSize = 700;
  let scale = 1;
  if (num > 4) {
    scale = 1 - num / 50;
  } else if (num > 2) {
    scale = 0.8;
  }
  // console.log(num, scale);

  let rot = 0;
  for (let i = 0; i < num; i++) {
    const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.id = `canvas-${i}`;
    canvas.className = "float";
    canvas.style.margin = `-${canvas.height / 2}px -${canvas.width / 2}px`;
    if (num > 4) {
      canvas.style.transform = `rotate(${rot}deg) translate(${circleSize / 2}px)`;
      rot = rot + angle;
    } else {
      const h = div.getBoundingClientRect().height;
      const w = div.getBoundingClientRect().width;
      const ch = canvas.height;
      // const cw = canvas.width;
      if (i === 0 && num !== 1) {
        canvas.style.transform = `translate(0px, ${h / 2 - ch / 2}px)`;
      } else if (i === 1) {
        const h = div.getBoundingClientRect().height;
        canvas.style.transform = `rotate(180deg) 
        translate(0px, ${h / 2 - ch / 2}px)`;
      } else if (i === 2) {
        canvas.style.transform = `rotate(90deg) 
        translate(${0}px, ${w / 2 - canvas.height / 2}px)`;
      } else if (i === 3) {
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

const init = async (): Promise<void> => {
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

  const div = document.getElementById("app");
  const range = document.getElementById("num") as HTMLInputElement;

  let canvases = [];
  let numCanvases = 1;
  range.valueAsNumber = numCanvases;
  canvases = createCanvases(numCanvases, videoWidth, videoHeight, div);

  range.addEventListener("change", (e: Event) => {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    numCanvases = (e.target as HTMLInputElement).valueAsNumber;
    canvases = createCanvases(numCanvases, videoWidth, videoHeight, div);
  });

  const render = (): void => {
    const scale = numCanvases <= 4 ? 1 : 1 - numCanvases / 50;
    canvases.forEach(([, context]) => {
      context.drawImage(video, 0, 0, videoWidth * scale, videoHeight * scale);
    });
    requestAnimationFrame(render);
  };

  video.play();
  render();

  document.addEventListener("click", () => {
    range.focus();
  });
};

document.addEventListener("DOMContentLoaded", init);
