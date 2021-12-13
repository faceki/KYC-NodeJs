const baseUrl = window.location.origin+"/";
const pathUrl = window.location.pathname;
const pathUrlArray1 = pathUrl.split("/");
var pathUrlArray = pathUrlArray1.filter(function (el) {
    return el != '';
});
pathUrlArray.pop();
const newPath=pathUrlArray.join("/");

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

    sessionStorage.setItem("auth_token", res.token);

	let front_img = sessionStorage.getItem('front_img');
	let back_img = sessionStorage.getItem('back_img');
	let selfie_image = sessionStorage.getItem('selfie_image');

    console.log('front_img',front_img);
    console.log('back_img',back_img);
    console.log('selfie_image',selfie_image);

	if (front_img == '' || front_img == null) {
	    alert('Please take Id Card front image first!!');
	    window.location.href=baseUrl+newPath+"/index.html";
	}

    const frontImge = createFile(front_img);
    const backImg = createFile(back_img);
    const selfieImg = createFile(selfie_image);

    sendImgeToKyc(frontImge,backImg,selfieImg);

});

function createFile(imgData)
{
    var jpegFile64 = imgData.replace(/^data:image\/(png|jpeg);base64,/, "");
    var jpegBlob = base64ToBlob(jpegFile64, 'image/png');
    const imgFile = new File([jpegBlob], "filename-front.png",{ type: 'image/png' });
    return imgFile;
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

    let auth_token = sessionStorage.getItem('auth_token');

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
                     if(resp.verification.passed==true){
                         sessionStorage.setItem("score", resp.face.confidence);
                         sessionStorage.setItem("response_data", JSON.stringify(resp));
                         verifypage.style.opacity = 0;
                         successfullpage.style.display = "block";
                         location.href = "#successfullpage";
                     }else if(resp.face.isIdentical==false){
                         alert('Face not identical.');
                         verifypage.style.display = "none";
                         selfiepage.style.display = "block";
                         button_callback2();
                     }else{
                        window.location.href=baseUrl+"idscaner";
                     }
                 }

                if (resp.error.code) {
                    if (resp.error.code == 7) {
                        alert(resp.error.code);
                        alert(resp.error.message);
                        window.location.href=baseUrl+"take-selfie";
                    }

                    if (resp.error.code == 9) {
                        alert(resp.error.code);
                        alert(resp.error.message);
                        window.location.href=baseUrl+"take-selfie";
                    }
                }             
            }else {
                alert(resp.message);
                if(resp.message=='Face not matched!'){
                  window.location.href=baseUrl+"take-selfie";
                }else if(resp.message=='Photocopy document not allowed.'){
                  window.location.href=baseUrl+"idscaner";
                }else{
                  window.location.href=baseUrl+"take-selfie";
                }
            }
        }
    };
    req.send(data_auth);
}

     