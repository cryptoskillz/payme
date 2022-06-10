//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //show the page
    document.getElementById('showBody').classList.remove('d-none')
    //add the amount of data enteries they have added
    document.getElementById("dashboardcounter").innerHTML = user.datacount;

});