const baseUrl = window.location.origin+"/";
// document.getElementById('sendLink').style.display = "block";
// document.getElementById('pendingLink').style.display = "none";
function hanshakeSocketConnection(){
    var url = baseUrl+"sendLink"
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
            var obj = JSON.parse(evt.data);
            console.log("Receivied:" + JSON.stringify(obj));

            if (obj.op == 'sendLink')
            {
                console.log(obj.token)
                reqData = JSON.stringify({
                    phone: "+"+mobileNumber ,
                    token: obj.token
                });

                fetch(url,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
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
                window.location.replace(baseUrl+"dashboard?id=" + obj.face_id);
                ws.close();
            }
        };
    }
}
