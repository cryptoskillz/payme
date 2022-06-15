/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let checkPayment = (secret, id) => {
    //debug
    //console.log(secret);
    //console.log(id)
    let checkDone = (res) => {
        res = JSON.parse(res)
        //check for the  payment response
        //we could just use the first element as the return is always going to be 1 item
        for (var i = 0; i < res.length; ++i) {
            //check if it is 0
            if (res[i].paid == "0") {
                //not paid
                showAlert(`${res[i].id} has not been yet.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res[i].paymentAddress}" target="_blank">here</a>`, 2, 0)
            } else {
                //paid
                let theItem = getData(res[i].id);
                //update the paid object
                theItem.paid = res[i].paid;
                //update the data
                updateData(theItem, 0);
                //show the payment has been made
                //table.row( '#'+res[i].id ).data( theItem ).draw();
                document.getElementById(`payid-${res[i].id}`).innerHTML = res[i].paid;
                //table.row('#' + res[i].id).remove().draw()
                showAlert(`${res[i].id} has been paid.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res[i].paymentAddress}" target="_blank">here</a>`, 1, 0)

            }
        }
    }
    xhrcall(1, `api/payment?s=${secret}&l=1&i=${id}`, "", "json", "", checkDone, token);

}

let loadURL = (theUrl, theId, blank = 0) => {

    //store the current item so we can use it later.
    let theData = getData(theId)
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
            storeData(res);
            res = JSON.parse(res)
        }

        let columns = []
        let dataresult = []
        let tableRowCount;
        let foundIt = 0;


        //let keys = Object.keys(res.elementData[0]);
        //get the values
        let values = Object.values(res.elementData[0]);

        //loop through the keys and build the columns
        columns.push({ title: "id" })
        for (var i = 0; i < res.elementData.length; ++i) {
            colJson = { title: res.elementData[i].name }
            columns.push(colJson)

        }
        columns.push({ title: "actions" })

        //set the key for deleting etc
        for (var i = 0; i < values.length; ++i) {
            if ((!isNaN(values[i]) && foundIt == 0)) {
                foundIt = 1;
                tableRowCount = i
            }

        }
        //todo : render multipile data
        //render data 
        let theData = []
        theData.push(res.id);
        let checkbutton = "";
        let paymentlink = "";
        let editbutton = "";
        let deletebutton = "";
        let paid = 0;
        let paymentAddress = "";
        for (var i = 0; i < res.elementData.length; ++i) {
            //build a check button to see if we been paid or not
            if (res.elementData[i].name == "paid") {
                if (res.elementData[i].value != "0")
                    paid = 1
            }
            //get the payment address
            if (res.elementData[i].name == "paymentAddress")
                paymentAddress = res.elementData[i].name;
            //add the elements
            theData.push(res.elementData[i].value)
        }
        //if it was checked so the mempool otherwise add the checkpayment option
        if (paid == 0)
            checkbutton = `<a href="javascript:checkPayment('${user.secret}','${res.id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> <i class="fas fa-globe fa-sm text-white-50"></i> Check</a>`
        else
            checkbutton = `<a href="https://mempool.space/address/${paymentAddress}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank"> <i class="fas fa-globe fa-sm text-white-50"></i> View</a>`

        //build the other buttons
        paymentlink = `<a href="${paymentWorkerUrl}?s=${user.secret}&i=${res.id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank">
    <i class="fas fa-globe fa-sm text-white-50"></i> Link</a>`

        editbutton = `<a href="javascript:loadURL('/${dataMainMethod}/edit/','${res.id}')" id="ep-${res.id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
        

        deletebutton = `<a href="javascript:deleteTableItem('${res.id}','${res.id}','api/${dataMainMethod}/')" id="dp-${res.id}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

        //add the buttons
        theData.push(`${checkbutton} ${paymentlink} ${editbutton} ${deletebutton}`);

        //console.log(theData)
        //add it to the data array
        dataresult.push(theData)

        //render table
        table = $('#dataTable').DataTable({
            data: dataresult,
            rowId: tableRowCount,
            columns: columns,

        });

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