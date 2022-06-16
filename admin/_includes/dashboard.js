//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the user
    let theUser = getUser(1, 0);
    //get the values
    let theValues = Object.values(theUser.settings)
    //check if any of the array elements are false
    let isEmpty = theValues.every(element => element == "")
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
    //set a vlaid falg
    let validData = 1;
    //check there is something there.
    if (theData != false) {
        //check we have some data
        if (tmp.data.length != 0)
            validData = 0;
    } else {
        validData = 0;
    }
    //render it
    if (validData == 1)
        document.getElementById("dashboardcounter").innerHTML = tmp.data.length;
    else
        document.getElementById("dashboardcounter").innerHTML = 0;
    document.getElementById('showBody').classList.remove('d-none')

});