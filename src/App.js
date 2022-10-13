import { useEffect, useRef } from "react";
import "./App.css";

let video = null;
let canvas = null;
let context = null;

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.height;
  }, []);

  let promise = navigator.mediaDevices.getUserMedia({ video: true });
  promise
    .then((signal) => {
      video = document.createElement("video");
      video.srcObject = signal;
      video.play();
      video.onloadeddata = () => {
        context.drawImage(video, 0, 0);
      };
    })
    .catch((error) => alert(error));

  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
