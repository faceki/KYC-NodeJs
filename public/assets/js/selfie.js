const pathUrl = window.location.pathname;
const baseUrl = window.location.origin+"/";
var video = document.getElementById("video");
const messageOne = document.querySelector("#message-1");
let is_mobile_device = false;

(function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        is_mobile_device = true;
})(navigator.userAgent || navigator.vendor || window.opera);

var widthOfCrop = 555; // width of frame where we have to fit ID for desktop
var heightOfCrop = 450; // height of frame where we have to fit ID for desktop
var xCrop = 355; // x axis distance of where we start cropping
var yCrop = 250; // y axis distance of where we start cropping

if(is_mobile_device==true){
  widthOfCrop = 650; // width of frame where we have to fit ID for mobile
  heightOfCrop = 500; // height of frame where we have to fit ID for mobile
  xCrop = 40; // x axis distance of where we start cropping
  yCrop = 200; 
}

button_callback();

function button_callback() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        video: {
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
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
  canvas.width = vid.videoWidth;
  canvas.height = vid.videoHeight;
  ctx.drawImage(vid, 0, 0);
  imageData = canvas.toDataURL("image/png", 1.0);

  // canvas.width = widthOfCrop;// width and height of cropped image
  // canvas.height = heightOfCrop;
  // ctx.drawImage(video, xCrop, yCrop, widthOfCrop, heightOfCrop, 0, 0, widthOfCrop, heightOfCrop);
  // var croppedData = canvas.toDataURL("image/png", 1.0);

  sessionStorage.setItem("selfie_image", imageData);

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
