const baseUrl = window.location.origin+"/";
var video = document.getElementById('video');
const messageOne = document.querySelector('#message-1');
const pathUrl = window.location.pathname;
debugger
if(pathUrl=='/idscane-front' || pathUrl == '/idscane-back'){
    document.querySelector('#page-title').textContent = "ID Card";
}else if(pathUrl=='/driving-front' || pathUrl == '/driving-back'){
    document.querySelector('#page-title').textContent = "Driving Licence";
}else if(pathUrl=='/passport-front' || pathUrl == '/passport-back'){
    document.querySelector('#page-title').textContent = "Passport";
}
if (localStorage.getItem('camera_type') == null) {
    localStorage.setItem("camera_type", 'front');
}

button_callback('user')

function button_callback(camera_type) {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        var flip_camera1 = localStorage.getItem('camera_type');
        if (flip_camera1 == 'front') {
            var options = {
                audio: false,
                video: {
                    facingMode: 'user',
                },
            };
        }else{
            var options = {
                audio: false,
                video: {
                    facingMode: 'environment',
                },
            };
        }

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



function flipCamera() {
    var flip_camera3 = localStorage.getItem('camera_type');
    if (flip_camera3 == 'front') {
        localStorage.setItem("camera_type", 'back');
        location.reload();
    }else{
        localStorage.setItem("camera_type", 'front');
        location.reload();
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
    localStorage.setItem("id_card_back_image",imageData);
    localStorage.setItem("back_img",imageData);
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg');
    });
}

function callApi(img_type){
    messageOne.textContent = 'Please wait we are verifying ...';
    if (img_type == 'front') {

        localStorage.removeItem("front_img");
        localStorage.removeItem("back_img");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("score");

        const BASE_URL = "https://app.faceki.com/";
        data = JSON.stringify({
            client_id:"68bc3750-1474-11ec-b791-31084c6a9e50",
            email:"zain@faceki.com",
        })
        fetch(BASE_URL+'getToken', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:data
        }).then(response=>{
            return response.json()
        }).then(function(res){
            localStorage.setItem("auth_token", res.token);
        });

        document.getElementById('capture').style.display = "none";
        video.pause();
        takeASnap(video).then(blob =>{
            localStorage.setItem("front_img", blob);
        });

        window.location.replace('/idscane-back');

    }else if (img_type == 'back') {
        document.getElementById('capture').style.display = "none";
        video.pause();
        takeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            if (front_img == '' || front_img == null) {
                alert('Please take Id Card front image first!!');
                window.location.replace('/idscane-front');
            }
            // localStorage.setItem("back_img", blob);
        });
        window.location.replace('/take-selfie');

    }else if (img_type == 'selfi') {
        document.getElementById('capture').style.display = "none";
        video.pause();
        takeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            let back_img = localStorage.getItem('back_img');

            if (front_img == '' || front_img == null) {
                alert('Please take Id Card front image first!!');
                window.location.replace('/idscane-front');
            }

            const frontImge = new File([front_img], "filename-front.jpeg");
            const backImg = new File([back_img], "filename-back.jpeg");
            const img = new File([blob], "filename-img.jpeg");
            sendImgeToKyc(frontImge,img);
        });
    }
}

const kycurl = 'https://app.faceki.com/kyc-verification';

function sendImgeToKyc(front_file,file_img) {

    const data_auth = new FormData();
    data_auth.append('image', front_file);
    data_auth.append('image', file_img);
    const req = new XMLHttpRequest();

    let auth_token = localStorage.getItem('auth_token');

    if (auth_token == '') {
        auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJrcmlzaG5hLW1pc2hyYS1wYXNzd29yZC1rcmlzaG5hIiwiZW1haWwiOiJlci5rcmlzaG5AZ21haWwuY29tIiwiaWF0IjoxNjE1ODkxOTIzLCJleHAiOjE2MTU4OTU1MjN9.-vzKN3v2iHbX7k5HCNs-QR-Ftu2NvMgIYqfcW8q76Qo';
    }

    req.open('POST', kycurl, true);
    req.setRequestHeader('Authorization','Bearer '+auth_token);
    req.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            let resp = JSON.parse(this.response)
            if (this.status == "200") {
                // alert(resp.message);
                debugger
                if(resp.face.confidence){
                    localStorage.setItem("score", resp.face.confidence);
                }else if(resp.face.error){
                    localStorage.setItem("face-error", 1);
                    localStorage.setItem("face-error-msg", resp.face.error_message);
                    localStorage.setItem("score", 0);
                }
                localStorage.removeItem("front_img");
                localStorage.removeItem("back_img");
                localStorage.removeItem("auth_token");
                window.location.replace('/kyc-result');
            }else {
                showAlert(resp.message);
            }
        }
    };
    req.send(data_auth);
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
    video.play();
    document.getElementById('capture').style.display = "block";
    messageOne.textContent = '';
}


function resetCam(camView,video){
    camView.style.display = "none"
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    })
}
