import { useEffect, useRef } from "react";
import "./App.css";

let cam = null;
let photo = null;
let canvas = null;
let context = null;
let size = { x: 0, y: 0, width: 0, height: 0 };

function App() {
  const canvasRef = useRef(null);
  const camRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    canvas = canvasRef.current;
    cam = camRef.current;
    photo = photoRef.current;
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  let mediaStream = navigator.mediaDevices.getUserMedia({
    video: {
      width: { exact: 400 },
      height: { exact: 300 },
    },
  });
  mediaStream
    .then((signal) => {
      cam.srcObject = signal;
      cam.play();
      cam.onloadeddata = () => {
        let resize =
          0.6 *
          Math.min(
            window.innerWidth / cam.videoWidth,
            window.innerHeight / cam.videoHeight
          );
        size.width = resize * cam.videoWidth;
        size.height = resize * cam.videoHeight;
        size.x = window.innerWidth / 3 - cam.videoWidth / 3;
        size.y = window.innerHeight / 3 - cam.videoHeight / 3;

        updateCanvas();
      };
    })
    .catch((error) => alert(error));

  const updateCanvas = () => {
    context.drawImage(cam, size.x, size.y, size.width, size.height);
    window.requestAnimationFrame(updateCanvas);
  };

  const takePicture = () => {
    const height = cam.videoHeight;
    const width = cam.videoWidth;

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(cam, 0, 0, width, height);
      var data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    } else {
      clearPhoto();
    }
  };

  const clearPhoto = () => {
    let canvas = document.getElementById("canvas");
    let photo = document.getElementById("photo");
    let context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  };

  return (
    <div className="App">
      <video ref={camRef} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        ref={photoRef}
        src="https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg"
        alt="The screen capture will appear in this box."
        width={400}
        height={300}
      />
      <br />
      <button onClick={takePicture}>capture</button>
    </div>
  );
}

export default App;
