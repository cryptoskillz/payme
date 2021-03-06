//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//poll server function
let pollServer = () => {
    //hold the unpaid data
    let paymentArray = [];
    //get the data
    let theItems = getData();
    //let get the user
    let theUser = getUser(1);
    //parse the items
    theItems = JSON.parse(theItems);
    //loop through the items
    for (var i = 0; i < theItems.data.length; ++i) {
        //get the data
        let tmp = theItems.data[i];
        //parse it
        tmp = JSON.parse(tmp)
        //debug 
       // tmp.paid=1
        //console.log(tmp);
        //loop through the element data
        for (var j = 0; j < tmp.elementData.length; ++j) {
            //get the element
            let theElement = tmp.elementData[j];
            //check if it is the paid element
            if (theElement.name == "paid") {
                //check if it has not been paid
                if (theElement.value == "0") {
                    //console.log('add  to payment array')
                    //console.log(theElement)
                    paymentArray.push(`data-${theUser.secret}]${tmp.id}`)
                }
            }
        }
    }

    //console.log("paymentArray");
    //console.log(paymentArray);
    let pollDone = (res) => {
        res = JSON.parse(res)
        //console.log(res)
        for (var i = 0; i < res.length; ++i) {
            let tmp = res[i];
            //debug
            //console.log(tmp);
            //tmp.paid =1;
            if (tmp.paid == 1) {
                let theItem = getData(0, tmp.paymentId);
                //console.log(theItem)
                //update it
                theItem.elementData[3].value = 1;
                //update the data
                updateData(JSON.stringify(theItem), 0);
                //udpate the table
                document.getElementById(`payid-${tmp.paymentId}`).innerHTML = 1;
                //remove the check button
                document.getElementById(`check-${tmp.paymentId}`).classList.add('d-none')
                let alertMessage = `${tmp.paymentId} has been paid, yay.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${tmp.btcAddress }" target="_blank">here</a>`;
                //let paymentId = tmp.DatasetControll
                showAlert(alertMessage, 1);
            }
        }
    }

    //check if there is anything to send
    if (paymentArray.length > 0) {
        let bodyobj = {
            paymentData: paymentArray,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(0, "api/pollpayment/", bodyobjectjson, "json", "", pollDone, token);
    } else {
        //console.log('no payments to check')
    }
}

let checkPayment = (secret, id) => {
    let checkDone = (res) => {
        //parse the repsonse
        res = JSON.parse(res)
        //set some vars
        let alertMessage = "";
        let alertType = 1
        //get the paid status
        //note: I am being lazy here we should loop through the array and find it
        if (res.elementData[3].value == 0) {
            //not paid
            alertType = 2;
            alertMessage = `${res.id} has not been yet.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res.elementData[0].value }" target="_blank">here</a>`;
        } else {
            //get the item
            let theItem = getData(0, res.id);
            //update it
            theItem.elementData[3].value = 1
            //update the data
            updateData(JSON.stringify(theItem), 0);
            //udpate the table
            document.getElementById(`payid-${res.id}`).innerHTML = 1;
            //set the alert message
            alertMessage = `${res.id} has been paid, yay.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res.elementData[0].value }" target="_blank">here</a>`;
        }
        //show the alert
        showAlert(alertMessage, alertType, 0)
    }
    //call the server
    xhrcall(1, `api/payment?s=${secret}&l=1&i=${id}`, "", "json", "", checkDone, token);

}

let loadURL = (theUrl, theId, blank = 0) => {

    //store the current item so we can use it later.
    let theData = getData(0, theId)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    let xhrDone = (res, local = 0) => {
        //store it in local storage
        if (local == 0) {
            storeData(res, 0);

        }
        res = getData();
        res = JSON.parse(res)
        let columns = []
        let dataresult = []
        let tableRowCount;
        let foundIt = 0;
        let checkbutton = "";
        let paymentlink = "";
        let editbutton = "";
        let deletebutton = "";
        let paid = 0;

        for (var i = 0; i < res.data.length; ++i) {
            tmp = res.data[i]
            tmp = JSON.parse(tmp)
            paid = 0;
            //console.log(tmp)
            if (i == 0) {
                //loop through the keys and build the columns
                columns.push({ title: "id" })
                for (var j = 0; j < tmp.elementData.length; ++j) {
                    colJson = { title: tmp.elementData[j].name }
                    columns.push(colJson)
                }
                columns.push({ title: "actions" })
                //console.log(columns)
                let values = Object.values(tmp.elementData[0]);
                //set the key for deleting etc
                for (var j = 0; j < values.length; ++j) {
                    if ((!isNaN(values[j]) && foundIt == 0)) {
                        foundIt = 1;
                        tableRowCount = i
                    }
                }

            }
            let theData = []
            theData.push(tmp.id);
            for (var j = 0; j < tmp.elementData.length; ++j) {
                let theValue = tmp.elementData[j].value
                //build a check button to see if we been paid or not
                if (tmp.elementData[j].name == "paid") {
                    theValue = `<span id="payid-${tmp.id}">${theValue}</span>`
                    //console.log(tmp.elementData[j])
                    if (tmp.elementData[j].value != "0")
                        paid = 1
                }
                //get the payment address
                if (tmp.elementData[j].name == "paymentAddress")
                    paymentAddress = tmp.elementData[j].value;
                //add the elements
                theData.push(theValue)

            }

            if (paid == 0)
                checkbutton = `<span id="check-${tmp.id}" ><a href="javascript:checkPayment('${user.secret}','${tmp.id}')" class=" d-sm-inline-block btn btn-sm btn-primary shadow-sm"> 
                                <i class="fas fa-globe fa-sm text-white-50"></i> Check</a></span>
<span><a href="https://mempool.space/address/${paymentAddress}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank">
                 <i class="fas fa-globe fa-sm text-white-50"></i> View</a></span>`
            else
               checkbutton = `<span id="check-${tmp.id}" class="d-none"><a href="javascript:checkPayment('${user.secret}','${tmp.id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> 
                                <i class="fas fa-globe fa-sm text-white-50"></i> Check</a></span>
<span><a href="https://mempool.space/address/${paymentAddress}" class=" d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank">
                 <i class="fas fa-globe fa-sm text-white-50"></i> View</a></span>`


            //build the other buttons
            paymentlink = `<a href="${paymentWorkerUrl}?s=${user.secret}&i=${tmp.id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank">
    <i class="fas fa-globe fa-sm text-white-50"></i> Link</a>`

            editbutton = `<a href="javascript:loadURL('/${dataMainMethod}/edit/','${tmp.id}')" id="ep-${tmp.id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`


            deletebutton = `<a href="javascript:deleteTableItem('${tmp.id}','${tmp.id}','api/${dataMainMethod}/')" id="dp-${res.id}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //add the buttons
            theData.push(`${checkbutton} ${paymentlink} ${editbutton} ${deletebutton}`);
            dataresult.push(theData)
        }

        table = $('#dataTable').DataTable({
            data: dataresult,
            rowId: tableRowCount,
            columns: columns,

        });

        ///start the timer to check every minute
        setInterval(pollServer, 60000);
        //do a initial check
        pollServer()

    }

    theData = getData();
    if (theData != false) {
        xhrDone(theData, 1);
    } else {
        //build the json
        let bodyobj = {
            email: user.email,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, "api/" + dataMainMethod + "/", bodyobjectjson, "json", "", xhrDone, token)

    }


})