//hold the paid state
let isPaid = 0;
//hold the timer
let checkPaymentTimer;
//hold the secret
let secret = "";
//hold the id
let id = "";
//check payment timer
let checkPayment = () => {
    //debug
    //console.log('tick')
    //xhr call done
    let checkDone = (res) => {
        //parse the repsonse
        res = JSON.parse(res);
        //debug to check the not paid state
        //res.elementData[3].value = 0
        //check if its paid
        if (res.elementData[3].value == 1) {
            //update the html
            document.getElementById('paymentResult').innerHTML = "Payment has been made";
            //update the is paid boolean
            isPaid = 1;
            //stop the timer
            clearInterval(checkPaymentTimer);

        } else {
            //show it has not been paid
            document.getElementById('paymentResult').innerHTML = "Payment has not been made"
        }
    }
    //we will kill the timer but put this in for belts and braces innit.
    if (isPaid == 0) {
        //debug
        //http://localhost:8788/api/payment?s=ea5dbb7f-56d7-4d05-b1dd-486a2b9bdb95&l=1&i=8a3c0b7e-cd0a-43c4-9ffb-c980296673ef
        //update the html
        document.getElementById('paymentResult').innerHTML = "Checking..."
        //maket he xhrcall
        xhrcall(1, `api/payment?s=${secret}&l=1&i=${id}`, "", "json", "", checkDone);
    }
}
//get url paramter, nicked from app.js
let getUrlParamater = (param) => {
    let searchParams = new URLSearchParams(window.location.search)
    let res = searchParams.has(param) // true
    if (res != false)
        return (searchParams.get(param))
    else
        return ("");

}

//this function makes the XHR calls. nicked from app.js
let xhrcall = (type = 1, method, bodyObj = "", setHeader = "", redirectUrl = "", callback = '', auth = "") => {
    //debug
    //console.log(apiUrl)
    //console.log(bodyObj)
    //console.log(method)
    //console.log(callback)

    checkElement = document.getElementById("spinner");

    if (typeof(checkElement) != 'undefined' && checkElement != null) {
        document.getElementById("spinner").classList.remove("d-none");
    }
    let url = apiUrl + method;
    //store the type
    let xhrtype = '';
    switch (type) {
        case 0:
            xhrtype = 'POST';
            break;
        case 1:
            xhrtype = 'GET';
            break;
        case 2:
            xhrtype = 'PATCH';
            break;
        case 3:
            xhrtype = 'DELETE';
            break;
        case 4:
            xhrtype = 'PUT';
            break;
        default:
            xhrtype = 'GET';
            break;
    }

    //set the new http request
    let xhr = new XMLHttpRequest();
    xhr.open(xhrtype, url);

    //set the header if required
    //note (chris) this may have to be a switch
    if (setHeader == "json")
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (auth != "")
        xhr.setRequestHeader("Authorization", "Bearer " + auth);
    //send the body object if one was passed
    if (bodyObj !== '') {
        xhr.send(bodyObj);
    } else {
        xhr.send();
    }
    //result
    //todo (chris) make this eval back to a done function
    xhr.onload = function() {
        checkElement = document.getElementById("confirmation-modal-delete-button");

        if (typeof(checkElement) != 'undefined' && checkElement != null) {
            document.getElementById("spinner").classList.add("d-none");
        }
        //check if its an error
        let res = xhr.response;
        let errorMessage = "";

        //check for errors
        if ((xhr.status == 400) || (xhr.status == 403) || (xhr.status == 500)) {
            //process the response
            res = JSON.parse(res)
            errorMessage = res.error
            if (errorMessage == "")
                errorMessage = "Server Error"
        }
        if (xhr.status == 405) {
            errorMessage = res
        }

        if (xhr.status == 205) {
            errorMessage = res
        }

        if (errorMessage != "") {
            showAlert(errorMessage, 2)
        }


        //check if it was ok.
        if (xhr.status == 200) {
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                //console.log(res)
                //res = JSON.parse(res)
                //console.log(res)
                eval(callback(res));
            }

        }

    }
};


//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    secret = getUrlParamater("s");
    //get the id
    id = getUrlParamater("i");
    //start the timer
    checkPaymentTimer = setInterval(checkPayment, 10000);
    checkPayment();
});