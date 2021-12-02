const pathUrl = window.location.pathname;
const baseUrl = window.location.origin+"/";
var video = document.getElementById("video");
const messageOne = document.querySelector("#message-1");

button_callback();

function button_callback(camera_type) {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var options = {
                audio: false,
                video: {
                    facingMode: 'user',
                },
        };
        navigator.mediaDevices.getUserMedia(options).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.play();
        }).catch(function (err0r) {
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

let imageData = ''

function takeASnap(vid){
    let canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d'); 
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0); 
    imageData = canvas.toDataURL('image/jpeg', 1.0)
    sessionStorage.setItem("selfie_image",imageData);
    console.log('selfie_image',sessionStorage.getItem('selfie_image'));
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg'); 
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
        window.location.href=baseUrl+"verifying";
    });
}
