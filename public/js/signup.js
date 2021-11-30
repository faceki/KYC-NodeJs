const baseUrl = window.location.origin+"/";

function onSignupFormNext(){

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
            //localStorage.setItem("auth_token", res.token);
            localStorage.setItem("firstname", document.querySelector('#fname').value);
            localStorage.setItem("lastname", document.querySelector('#lname').value);
            localStorage.setItem("email_id", document.querySelector('#email_id').value);
            localStorage.setItem("mobile_number", document.querySelector('#mobile_number').value);
            localStorage.setItem("type","signup");
            if(document.querySelector('#fname').value!='' &&
                document.querySelector('#lname').value!='' &&
                document.querySelector('#email_id').value!='' &&
                document.querySelector('#mobile_number').value!=''){
                window.location.href = baseUrl+"faceki-sign-in/?route=signup&auth="+res.token;
            }else{
                alert("fill all information.")
            }
           
        });
    
}
