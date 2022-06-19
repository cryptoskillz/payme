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
                //console.log(res[i])
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
    let theData = getData(0,theId)
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

                //build a check button to see if we been paid or not
                if (tmp.elementData[j].name == "paid") {
                    if (tmp.elementData[j].value != "0")
                        paid = 1
                }
                //get the payment address
                if (tmp.elementData[j].name == "paymentAddress")
                    paymentAddress = tmp.elementData[j].value;
                //add the elements
                theData.push(tmp.elementData[j].value)

            }

            if (paid == 0)
                checkbutton = `<a href="javascript:checkPayment('${user.secret}','${tmp.id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> <i class="fas fa-globe fa-sm text-white-50"></i> Check</a>`
            else
                checkbutton = `<a href="https://mempool.space/address/${paymentAddress}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank"> <i class="fas fa-globe fa-sm text-white-50"></i> View</a>`

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