const baseUrl = window.location.origin+"/";
const BASE_URL = "https://app.faceki.com/";
var video = document.getElementById('video');
const messageOne = document.querySelector('#message-1')
let token = ''
if(document.querySelector('#token') && document.querySelector('#token').value){
    token = document.querySelector('#token').value
}
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
    const canvas = document.createElement('canvas'); // create a canvas
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0,0); // the video
    imageData = canvas.toDataURL('image/jpeg', 1.0)
    return new Promise((res, rej)=>{
        canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
    });
}

function download(blob){
        debugger
    // uses the <a download> to download a Blob
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'screenshot.jpg';
    document.body.appendChild(a);
    a.click();
}
function callApi(){
        let type = localStorage.getItem("type")
    document.getElementById('loader').style.display = "block";
    document.getElementById('video').style.display = "none";
    document.getElementById('Faceframe').style.display = "none";
    document.getElementById('capture').style.display = "none";
    takeASnap(video).then(blob =>{
        const file = new File([blob], "filename.jpeg");
        debugger
        checkLiveness(file,type)
    })
    // var can = document.getElementsByTagName('canvas')[0]
    // var img = new Image();
    // img.src = can.toDataURL('image/jpeg', 1.0);
    // fetch(img.src)
    //     .then(res => res.blob())
    //     .then(blob => {
    //         debugger
    //         //download(blob)
    //         const file = new File([blob], "filename.jpeg");
    //
    //         checkLiveness(file,type)
    // })
}

function blobCreationFromURL(inputURI) {

    var binaryVal;

    // mime extension extraction
    var inputMIME = inputURI.split(',')[0].split(':')[1].split(';')[0];

    // Extract remaining part of URL and convert it to binary value
    if (inputURI.split(',')[0].indexOf('base64') >= 0)
        binaryVal = atob(inputURI.split(',')[1]);

    // Decoding of base64 encoded string
    else
        binaryVal = unescape(inputURI.split(',')[1]);

    // Computation of new string in which hexadecimal
    // escape sequences are replaced by the character
    // it represents

    // Store the bytes of the string to a typed array
    var blobArray = [];
    for (var index = 0; index < binaryVal.length; index++) {
        blobArray.push(binaryVal.charCodeAt(index));
    }

    return new Blob([blobArray], {
        type: inputMIME
    });
}
//const livenessurl = 'http://localhost:8080/check_liveness';
const livenessurl = 'https://api.faceki.com/check_liveness';

function checkLiveness(file,type) {
    const data = new FormData();
    data.append('key', file);
    const req = new XMLHttpRequest();

    req.open('POST', livenessurl, true);
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resp = JSON.parse(this.response)
            if(resp && resp.score  /*&& resp.score>=0.50&& resp.quality>=0.60*/ && resp.probability>0.5 && resp.error==undefined){
                AuthenticateUser()
            }else if(resp && /*resp.score && resp.score<=0.50 &&*/ resp.probability<0.5 && resp.error==undefined){
                showAlert("Please try again!!")
            }else if(resp && resp.error_code=="FACE_CROPPED" && resp.error){
                showAlert(resp.error+", Try Again!!")
            }else if(resp && resp.error_code=="FACE_TOO_CLOSE" && resp.error){
                showAlert(resp.error+",Please keep your face more closer to your camera, Try Again!!")
            }else if(resp && resp.error_code=="FACE_NOT_FOUND" && resp.error){
                showAlert(resp.error+",Please make sure face should be completely inside camera frame, Try Again!!")
            }else if(resp && resp.error_code=="FACE_CLOSE_TO_BORDER" && resp.error){
                showAlert(resp.error+", Try Again!!")
            }else if(resp && resp.error_code=="FACE_TOO_SMALL" && resp.error){
                showAlert(resp.error+", Try Again!!")
            }else if(resp && resp.error_code=="UNKNOWN" && resp.error){
                showAlert("Something went wrong!!")
            }else{
                console.log(resp)
                showAlert("Image quality is not good, Make sure you are under proper lights, Try again!!")
            }

        }
    };
    req.send(data)
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
    document.getElementById('loader').style.display = "none";
    document.getElementById('video').style.display = "block";
    document.getElementById('Faceframe').style.display = "block";
    document.getElementById('capture').style.display = "block";
}

function AuthenticateUser(){
   /* if(localStorage.getItem("type")){
            type = localStorage.getItem("type")
      }*/
    const urlParams = new URLSearchParams(window.location.search);
    const jwt_token = urlParams.get('auth');
    let type = urlParams.get('route');
    var data = JSON.stringify({
        image: imageData
    });
    var url = BASE_URL+"verify"
    if(type == 'signup'){
        var mobile_number = localStorage.getItem("mobile_number")
        const name = localStorage.getItem("firstname")+" "+localStorage.getItem("lastname")
        const email_id = localStorage.getItem("email_id")

        data = JSON.stringify({
            image: imageData ,
            email:email_id,
            mobile_number:mobile_number,
            name: name
            //client_id:"af7d4790-04a9-11ec-aecf-1dca4d5eaaf0"
        });
        url = BASE_URL+"enroll"
    }
    if(token && type!='signup'){
        url = BASE_URL+"request-login"
        data = JSON.stringify({
            image: imageData ,
            token: token
        });
    }
    messageOne.textContent = 'Please wait we are verifying your identity...'
    if(type){
            fetch(url, {
                            method: "POST",
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': jwt_token
                        },
                            body: data
                        }).then(response=>{
                           return response.json()
                    })
                    .then(function(res){
                        debugger;
                        if(res.status==200){

                            var id = res.data.face_id
                            if(res.data.face_id){
                                id = res.data.face_id
                            }
                            //localStorage.setItem("firstname", '');
                            //localStorage.setItem("lastname", '');
                            //localStorage.setItem("email_id", '');
                            //localStorage.setItem("mobile_number",'');
                            window.location.replace(baseUrl+"dashboard?id=" + id);
                            /*if (window.opener) {
                                // send them to the opening window
                                window.opener.postMessage(id);
                                // close the popup
                                window.close();
                            }*/
                            // window.opener.location.href=baseUrl+"dashboard?id=" + id;
                            // self.close();
                        }else if(res.status==4001){
                            window.location.replace(baseUrl+"error");
                        }else if(res.status==5001){
                            window.location.replace(baseUrl+"lowquality");
                        }else if(res.status==6001){
                            window.location.replace(baseUrl+"loginfailed");
                            messageOne.textContent = "Login Failed."
                        }else if(res.status==6002){
                            showAlert("Keep your face more closer to camera.")
                        }else if(res.status==5004){
                            showAlert("No Account found.")
                        }else if(res.status==401){
                            showAlert(""+res.data);
                        }else if (res.status==422){
                            showAlert(""+res.message);
                        }else if(res.status==1000){
                            window.location.replace(baseUrl+"faceki-request-a-sign-in-pending");
                        }
                    }).catch(e=>{
                    debugger;
                    console.log(e)
                })
            }
        }



function resetCam(camView,video){
    camView.style.display = "none"
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    })
}

