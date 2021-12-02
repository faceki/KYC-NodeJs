const pathUrl = window.location.pathname;
const baseUrl = window.location.origin+"/";
var video = document.getElementById("video");
const messageOne = document.querySelector("#message-1");
// const messageTwo = document.querySelector('#message-2');

var widthOfCrop = 555; // width of frame where we have to fit ID for desktop
var heightOfCrop = 350; // height of frame where we have to fit ID for desktop
var xCrop = 355; // x axis distance of where we start cropping
var yCrop = 250; // y axis distance of where we start cropping
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
if(vw<768){
  widthOfCrop = 580; // width of frame where we have to fit ID for mobile
  heightOfCrop = 190; // height of frame where we have to fit ID for mobile
  xCrop = 40; // x axis distance of where we start cropping
  yCrop = 100; 
}

button_callback();

function button_callback() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        video: {
          width: {
            ideal: (is_mobile_device==true)?1024:1920
          },
          height: {
            ideal: (is_mobile_device==true)?768:1080
          },
          facingMode: "user",
        },
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("autoplay", "");
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.play();
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}

function stop(e) {
  var stream = video.srcObject;
  var tracks = stream.getTracks();

  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }

  video.srcObject = null;
}

let imageData = "";

function takeASnap(vid) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // canvas.width = vid.videoWidth;
  // canvas.height = vid.videoHeight;
  // ctx.drawImage(vid, 0, 0);
  // imageData = canvas.toDataURL("image/png", 1.0);

  canvas.width = widthOfCrop;// width and height of cropped image
  canvas.height = heightOfCrop;
  ctx.drawImage(video, xCrop, yCrop, widthOfCrop, heightOfCrop, 0, 0, widthOfCrop, heightOfCrop);
  var croppedData = canvas.toDataURL("image/png", 1.0);

  sessionStorage.setItem("selfie_image", croppedData);

  return new Promise((res, rej) => {
    canvas.toBlob(res, "image/png");
  });
}

function callApi(img_type){
    document.getElementById('video').style.display = "none";
    document.getElementById('capture').style.display = "none";
    video.pause(); 
    takeASnap(video).then(blob =>{
        const pathUrlArray1 = pathUrl.split("/");
        var pathUrlArray = pathUrlArray1.filter(function (el) {
            return el != '';
        });
        pathUrlArray.pop();
        const newPath=pathUrlArray.join("/");
        window.location.href=baseUrl+"verifying";
    });
}
