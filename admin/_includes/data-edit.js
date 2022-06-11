
//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the schema
    let dataitem = getCurrentDataItem();
     let bodyJson ;
    //build the elements
    document.getElementById('formInputs').innerHTML = buildForm(dataitem);
    //show the form
    document.getElementById('showBody').classList.remove('d-none')
    //create button click
    document.getElementById('btn-edit').addEventListener('click', function() {        //api call done
        let xhrDone = (res) => {
            let tmp = JSON.parse(bodyJson);
            dataitem.name = tmp.name;
            res = JSON.parse(res)
            showAlert(res.message, 1)
            document.getElementById('data-header').innerHTML = `Edit ${dataitem.name}`;

        }
        //get the form data
        bodyJson = getFormData()
        //check there is data to submit
        if (bodyJson != false) {
            bodyJson = JSON.parse(bodyJson);
            bodyJson.oldname = dataitem.name;
            bodyJson.id = dataitem.id;
            bodyJson = JSON.stringify(bodyJson);
            console.log(bodyJson)
            //call it
            xhrcall(4, `api/${dataMainMethod}/`, bodyJson, "json", "", xhrDone, token)
        }
    })
})