const BASE_URL = "https://app.faceki.com/";
//const BASE_URL = "http://localhost:3000/";
function getToken(client_id, email, type){
    debugger;
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
        if(type=='login'){
            debugger
            showFacekiLoginWindow(type,res.token)
        }else if(type == 'signup'){
            showFacekiSignUpWindow(type,res.token)
        }else if(type=='request-login'){
            debugger
            hanshakeSocketConnection(res.token)
        }
    })
}
function showFacekiLoginWindow(type,token){
    url = window.location.origin+"/faceki-sign-in/?route=login&auth="+token
    window.location.replace(url);
}
function showFacekiSignUpWindow(type,token){
    url = window.location.origin+"/faceki-sign-up/?route=signup&auth="+token
    window.location.replace(url);
}

function hanshakeSocketConnection(authToken){
    var url = BASE_URL+"sendLink"
    var mobileNumber = document.querySelector('#mobileNumber').value
    if ("WebSocket" in window) {
        var ws = new WebSocket("wss://app.faceki.com:9090/gencode");
        ws.onopen = function() {
            var sendLink = {
                op: 'sendLink'
            };
            ws.send(JSON.stringify(sendLink));

        };
        ws.onmessage = function(evt) {
            //Call Api to sendlink
            var obj = JSON.parse(evt.data);
            console.log("Receivied:" + JSON.stringify(obj));

            if (obj.op == 'sendLink')
                {
                reqData = JSON.stringify({
                    phone: "+"+mobileNumber ,
                    socket_id: obj.socket_id
                });

                fetch(url,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': authToken
                        },
                        body: reqData
                    }).then(response=>{
                    return response.json()
                }).then(function(res){
                    debugger;
                    if(res.status==200){
                        document.getElementById('sendLink').style.display = "none";
                        document.getElementById('pendingLink').style.display = "block";
                    }
                }).catch(e=>{
                    debugger;
                    console.log(e)
                })
            }else if (obj.op == 'authdone') {
                window.location.replace(window.location.origin+"/dashboard?id=" + obj.face_id);
                ws.close();
            }
        };
    }
}

/*window.addEventListener('message', event => onFacekiResponse(event), false);
const onFacekiResponse = event => {
    const { data } = event;
    const redirectUrl = BASE_URL+`dashboard?id=${data}`;
    window.location.href = redirectUrl;
};*/
