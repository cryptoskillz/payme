let projectid = 0;
let projectname = "";

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
            //let tmp = getCurrentDataItem();
             //           console.log("1")

            //console.log(tmp)
            let tmp = JSON.parse(bodyJson);
            dataitem.name = tmp.name;
            console.log("2")

            console.log(dataitem)
            updateData(dataitem,0)
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

/*
    let dataitem = getCurrentDataItem();
    //console.log(project)
    document.getElementById('inp-dataname').value = dataitem.name;
    document.getElementById('data-header').innerHTML = `Edit ${dataitem.name}`;
    document.getElementById('showBody').classList.remove('d-none')
    document.getElementById('btn-edit').addEventListener('click', function() {
        let xhrDone = (res) => {
            res = JSON.parse(res)
            updateData(dataitem)
            console.log(res)
            showAlert(res.message, 1)
            document.getElementById('project-header').innerHTML = `Edit ${dataitem.name}`;
        }
        //set the valid var
        let valid = 1;
        //get the details
        let dataname = document.getElementById('inp-dataname');
        if (dataname.value == "") {
            valid = 0;
            showAlert(dataMainMethod + " name cannot be blank", 2);
        }
        if (valid == 1) {
            let bodyobj = {
                name: dataname.value,
                oldname: dataitem.name,
                id: dataitem.id
            }
            dataitem.name = dataname.value
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(4, `api/${dataMainMethod}/`, bodyobjectjson, "json", "", xhrDone, token)
        }
    });

    */
})