//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the user
    let theUser = getUser(1, 0);
    //get the values
    let theValues = Object.values(theUser.settings);
    document.getElementById('generic-payment-link').innerHTML = `<a href="${paymentWorkerUrl}?s=${theUser.secret}" target="_blank">view</a>`

    //check if all of the array elements are empty
    let isEmpty = theValues.every(element => element == "");
    //its empty
    if (isEmpty == true) {
        //show settings  CTA
        document.getElementById('paymentlinkcard').classList.add('d-none')
        document.getElementById('settingscard').classList.remove('d-none')
    } else {
        //check  if we have a  btc address
        if (theValues[0] == "") {
            //show settings CTA
            document.getElementById('paymentlinkcard').classList.add('d-none')
            document.getElementById('settingscard').classList.remove('d-none')
        }
    }
    //get the data
    let theData = getData();
    //turn it into an array
    let tmp = JSON.parse(theData);
    //console.log(theData)
    //check there is something there.
    if (theData != false) {
        //check we have some data
        //console.log(tmp.data.length)

        //see if there is any data
        if (tmp.data.length == 0) {
            //set it to 0, this should never happen but it costs us nothing !
            document.getElementById("dashboardcounter").innerHTML = 0;
        } else {
            //set the length of the data
            document.getElementById("dashboardcounter").innerHTML = tmp.data.length;
        }
        //show it
        document.getElementById('showBody').classList.remove('d-none')

    } else {
        //process the repsonse from the API
        let xhrDone = (res) => {
            //store it in local storage
            storeData(res, 0);
            //get the data
            let theData = getData();
            //parse it
            theData = JSON.parse(theData)
            //let tmp = JSON.parse(theData);
            //update the counter
            document.getElementById("dashboardcounter").innerHTML = theData.data.length
            document.getElementById('showBody').classList.remove('d-none')

        }
        //build json object
        let bodyobj = {
            email: theUser.email,
        }
        //stringify it
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the data endpoint
        xhrcall(1, "api/" + dataMainMethod + "/", bodyobjectjson, "json", "", xhrDone, token)
    }

});