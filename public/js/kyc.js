const baseUrl = window.location.origin+"/";
var video = document.getElementById('video');
const messageOne = document.querySelector('#message-1');
const pathUrl = window.location.pathname;
if(pathUrl=='/idscane-front' || pathUrl == '/idscane-back'){
    document.querySelector('#page-title').textContent = "ID Card";
}else if(pathUrl=='/driving-front' || pathUrl == '/driving-back'){
    document.querySelector('#page-title').textContent = "Driving Licence";
}else if(pathUrl=='/passport-front' || pathUrl == '/passport-back'){
    document.querySelector('#page-title').textContent = "Passport";
    document.querySelector('#id-side').textContent = "";
}
if (localStorage.getItem('camera_type') == null) {
    localStorage.setItem("camera_type", 'front');
}

if(pathUrl=='/take-selfie'){
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

function frontTakeASnap(vid){
    //const canvas = document.createElement('canvas');
    let canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0);
    imageData = canvas.toDataURL('image/jpeg', 1.0)
    localStorage.setItem("id_card_image",imageData);
    localStorage.setItem("front_img",imageData);
    if(pathUrl == '/passport-front'){
        localStorage.setItem("back_img",imageData);
    }
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg');
    });
}

function backTakeASnap(vid){
    //const canvas = document.createElement('canvas');
    let canvas = document.querySelector("#canvas");
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

function selfieTakeASnap(vid){
    //const canvas = document.createElement('canvas');
    let canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0);
    imageData = canvas.toDataURL('image/jpeg', 1.0)
    localStorage.setItem("selfie_image",imageData);
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
            email:"demo@faceki.com",
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
            document.getElementById('capture').style.display = "none";
            video.pause();
            frontTakeASnap(video).then(blob =>{
                // localStorage.setItem("front_img", blob);
            });
            if(pathUrl=='/idscane-front'){
                window.location.replace('/idscane-back');
            }else if(pathUrl=='/driving-front'){
                window.location.replace('/driving-back');
            }else if(pathUrl=='/passport-front'){
                window.location.replace('/take-selfie');
            }
        });



    }else if (img_type == 'back') {
        document.getElementById('capture').style.display = "none";
        video.pause();
        backTakeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            if (front_img == '' || front_img == null) {
                alert('Please take Id Card front image first!!');
                window.location.replace('/idscane-front');
            }
            //localStorage.setItem("back_img", blob);
        });
        window.location.replace('/take-selfie');

    }else if (img_type == 'selfi') {

        document.getElementById('loader').style.display = "block";
        document.getElementById('noFace').style.display = "none";
        // document.getElementById('HideColors').style.display = "none";
        document.getElementById('video').style.display = "none";
        document.getElementById('show-hide-dekstop').style.display = "none";
        document.getElementById('show-hide-mobile').style.display = "none";

        document.getElementById('capture').style.display = "none";
        video.pause();
        selfieTakeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            let back_img = localStorage.getItem('back_img');
            let selfie_image = localStorage.getItem('selfie_image');

            if (front_img == '' || front_img == null) {
                alert('Please take Id Card front image first!!');
                window.location.replace('/idscane-front');
            }

            if (back_img == '' || back_img == null) {
                alert('Please take Id Card back image first!!');
                window.location.replace('/idscane-back');
            }

            var jpegFile64 = front_img.replace(/^data:image\/(png|jpeg);base64,/, "");
            var jpegBlob = base64ToBlob(jpegFile64, 'image/jpeg');
            const frontImge = new File([jpegBlob], "filename-front.jpeg",{ type: 'image/jpeg' });

            var bjpegFile64 = back_img.replace(/^data:image\/(png|jpeg);base64,/, "");
            var bjpegBlob = base64ToBlob(bjpegFile64, 'image/jpeg');
            const backImg = new File([bjpegBlob], "filename-back.jpeg",{ type: 'image/jpeg' });

            var sjpegFile64 = selfie_image.replace(/^data:image\/(png|jpeg);base64,/, "");
            var sjpegBlob = base64ToBlob(sjpegFile64, 'image/jpeg');
            const selfieImg = new File([sjpegBlob], "filename-selfie.jpeg",{ type: 'image/jpeg' });

            //const file = document.querySelector('#fileInput').files[0];
            sendImgeToKyc(frontImge,backImg,selfieImg);
        });

    }
}

function base64ToBlob(base64, mime)
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

const kycurl = 'https://app.faceki.com/kyc-verification';

function sendImgeToKyc(front_file,back_file,file_img) {

    const data_auth = new FormData();
    data_auth.append('doc_front_image', front_file);
    data_auth.append('doc_back_image', back_file);
    data_auth.append('selfie_image', file_img);
    const req = new XMLHttpRequest();

    let auth_token = localStorage.getItem('auth_token');

    if (auth_token == '') {
        auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJrcmlzaG5hLW1pc2hyYS1wYXNzd29yZC1rcmlzaG5hIiwiZW1haWwiOiJlci5rcmlzaG5AZ21haWwuY29tIiwiaWF0IjoxNjE1ODkxOTIzLCJleHAiOjE2MTU4OTU1MjN9.-vzKN3v2iHbX7k5HCNs-QR-Ftu2NvMgIYqfcW8q76Qo';
    }

    req.open('POST', kycurl, true);
    req.setRequestHeader('Authorization','Bearer '+auth_token);
    req.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            console.log('server_response',this.response);
            var resp = JSON.parse(this.response);
            if (this.status == "200") {
                if (resp.result) {
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
                    localStorage.setItem("response_data", JSON.stringify(resp));
                    window.location.replace('/kyc-result');
                    return;
                }

                if (resp.error.code) {
                    if (resp.error.code == 7) {
                        showAlert(resp.error.message);
                        return;
                    }

                    if (resp.error.code == 9) {
                        showAlert(resp.error.message);
                        return;
                    }
                }
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
    messageOne.textContent = '';
     setTimeout(function(){
        location.reload();
    }, 1000)
}


function resetCam(camView,video){
    camView.style.display = "none"
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    })
}
