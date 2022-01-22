import "regenerator-runtime";

const recoderBTN = document.querySelector("button.recoder_btn");
const video = document.querySelector("video.recoder_preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = `MyRecording${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}.webm`;
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  recoderBTN.innerText = "Download Recording";
  recoderBTN.removeEventListener("click", handleStop);
  recoderBTN.addEventListener("click", handleStart);
  recoderBTN.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  recoderBTN.innerText = "Stop Recording";
  recoderBTN.removeEventListener("click", handleStart);
  recoderBTN.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

recoderBTN.addEventListener("click", handleStart);
