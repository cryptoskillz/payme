//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let theItem = getUser(1);

    document.getElementById('generic-payment-link').innerHTML = `<a  href="${paymentWorkerUrl}?s=${theItem.secret}" target="_blank">${paymentWorkerUrl}?s=${theItem.secret}</a>`
    //show the page
    document.getElementById('showBody').classList.remove('d-none')
    //add the amount of data enteries they have added
    document.getElementById("dashboardcounter").innerHTML = theItem.datacount;

});