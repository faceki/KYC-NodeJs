var video = document.getElementById('video-mobile'); 
button_callback()

function button_callback() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d'); 
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0); 
    imageData = canvas.toDataURL('image/jpeg', 1.0)
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg'); 
    });
}

function callApiMobile(img_type){
    if (img_type == 'front') {
        document.getElementById('capture-mobile').style.display = "none";
        document.getElementById('loader-mobile').style.display = "block";
        document.getElementById('video-mobile').style.display = "none";
        takeASnap(video).then(blob =>{
            localStorage.setItem("front_img", blob);
        });
        window.location.replace('file:///home/n2rtech/faceki-app/idscane-back.html');
    }else if (img_type == 'back') {
        document.getElementById('capture-mobile').style.display = "none";
        document.getElementById('loader-mobile').style.display = "block";
        document.getElementById('video-mobile').style.display = "none";
        takeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            localStorage.setItem("back_img", blob);    
        });
        window.location.replace('file:///home/n2rtech/faceki-app/take-selfie.html');
    }else{
        document.getElementById('capture-mobile').style.display = "none";
        document.getElementById('loader-mobile').style.display = "block";
        document.getElementById('video-mobile').style.display = "none";
        takeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            let back_img = localStorage.getItem('back_img');
            const frontImge = new File([front_img], "filename-front.jpeg");
            const backImg = new File([back_img], "filename-back.jpeg");
            const img = new File([blob], "filename-img.jpeg");
            sendImgeToKyc(frontImge,backImg,img);
        });
    }
}

const kycurl = 'https://app.faceki.com/bahrain-cpr';

function sendImgeToKyc(front_file,back_file,file_img) {
    const data = new FormData();
    data.append('image', front_file);
    // data.append('image', back_file);
    data.append('image', file_img);
    const req = new XMLHttpRequest();

    req.open('POST', kycurl, true);
    req.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            let resp = JSON.parse(this.response)
            if (this.status == "200") {
                alert('image saved sucessfully!')
                window.location.replace('file:///home/n2rtech/faceki-app/face-scane.html');
            }else {
                showAlert(resp.message+". Please try again!!")
                console.log('dd');
            }
        }
    };
    req.send(data);
}


function showAlert(msg){
    var r = confirm(msg)
    if(r){
        resetCamUI()
    }else{
        window.close();
    }
}

function resetCamUI(){
    document.getElementById('loader-mobile').style.display = "none";
    document.getElementById('video-mobile').style.display = "block";
    document.getElementById('capture-mobile').style.display = "block";
}


function resetCam(camView,video){
    camView.style.display = "none"
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    })
}
