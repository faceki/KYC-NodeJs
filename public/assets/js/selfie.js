const pathUrl = window.location.pathname;
const baseUrl = window.location.origin+"/";
var video = document.getElementById("video");
const messageOne = document.querySelector("#message-1");
// const messageTwo = document.querySelector('#message-2');
button_callback();

function button_callback() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        video: {
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
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
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;
  ctx.drawImage(vid, 0, 0, 800, 600);
  imageData = canvas.toDataURL("image/jpeg", 1.0);
  sessionStorage.setItem("selfie_image", imageData);
  return new Promise((res, rej) => {
    canvas.toBlob(res, "image/jpeg");
  });
}

function callApi(img_type){
    document.getElementById('video').style.display = "none";
    document.getElementById('capture').style.display = "none";
    video.pause(); 
    takeASnap(video).then(blob =>{
        let selfie_image = sessionStorage.getItem('selfie_image');
        const pathUrlArray1 = pathUrl.split("/");
        var pathUrlArray = pathUrlArray1.filter(function (el) {
            return el != '';
        });
        pathUrlArray.pop();
        const newPath=pathUrlArray.join("/");
        window.location.href=baseUrl+newPath+"/verifying.html";
    });
}
