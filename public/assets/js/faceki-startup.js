const pathUrl = window.location.pathname;
const baseUrl = window.location.origin+"/";
function getSdkSettings(){
    const pathUrlArray1 = pathUrl.split("/");
    const pathUrlArray = pathUrlArray1.filter(function (el) {
        return el != '';
    });
    const newPath=pathUrlArray.join("/");
    window.location.href=baseUrl+"idscaner";
}



    

