const baseUrl = window.location.origin+"/";
var video = document.getElementById('video');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
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
    localStorage.setItem("selfie_image",imageData);
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg');
    });
}

function callApi(img_type){
    messageOne.textContent = 'Please wait we are verifying ...';
    messageTwo.textContent = '';
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
            localStorage.setItem("back_img", blob);
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
        takeASnap(video).then(blob =>{
            let front_img = localStorage.getItem('front_img');
            let back_img = localStorage.getItem('back_img');

            if (front_img == '' || front_img == null) {
                alert('Please take Id Card front image first!!');
                window.location.replace('/idscane-front');
            }
            var jpegFile64 = front_img.replace(/^data:image\/(png|jpeg);base64,/, "");
            var jpegBlob = base64ToBlob(jpegFile64, 'image/jpeg');

            const frontImge = new File([jpegBlob], "filename-front.jpeg");
            const backImg = new File([back_img], "filename-back.jpeg");
            const img = new File([blob], "filename-img.jpeg");
            sendImgeToKyc(frontImge,backImg,img);
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

                // window.location.replace('/kyc-result');
            }
        }
    };
    req.send(data_auth);
}


function showAlert(msg){
    messageTwo.textContent = msg;
    // var r = confirm(msg)
        resetCamUI()
}

function resetCamUI(){

    // document.getElementById('loader').style.display = "none";
    // document.getElementById('video').style.display = "block";
    // document.getElementById('show-hide-dekstop').style.display = "block";
    // document.getElementById('show-hide-mobile').style.display = "block";
    video.play();
    // document.getElementById('capture').style.display = "block";
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



