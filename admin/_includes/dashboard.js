//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    projects = getCacheProjects()
    //if we havent cached it yet we could pull it down. 
    if (projects == false) {

        let xhrDone = (res, local = 0) => {
            //store it in local storage
            storeCacheProjects(res);
            res = JSON.parse(res)
            document.getElementById("backpageprojects").innerHTML = res.data.length
        }
        //build the json
        let bodyobj = {
            email: user.email,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, "api/projects/", bodyobjectjson, "json", "", xhrDone, token)
        
    } else
        document.getElementById("backpageprojects").innerHTML = projects.data.length;

});