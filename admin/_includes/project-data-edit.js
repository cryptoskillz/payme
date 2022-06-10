let fields;
let originalfields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let projectdata = getCurrentProjectData();
    let tmpd = Object.values(projectdata.data)
    let fields = Object.keys(projectdata.data)
    //loop through  the keys
    let inpHtml = "";
    for (var i = 0; i < fields.length; ++i) {
        //console.log(fields[i])
        if (fields[i] != "UNUSED") {

            inpHtml = inpHtml + `<div class="form-group" >
            <label>${fields[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${fields[i]}" aria-describedby="emailHelp" placeholder="Enter ${fields[i]}" value="${tmpd[i]}">
</div>`
        }
    }
    document.getElementById('formInputs').innerHTML = inpHtml
    //show the body
    document.getElementById('showBody').classList.remove('d-none');

})

document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1);
        updateProjectAllData(res.data);
    }
    let data = {};

    let currentproject = getCurrentProject();
        let currentprojectdata = getCurrentProjectData();

    let projectfields = currentproject.schema.fields.split(",");
    let projectoriginalfields = currentproject.schema.originalfields.split(",")
    for (var i = 0; i < projectfields.length; ++i) {
        let inpValue = "";
        if (projectfields[i] == "UNUSED") {
            data[projectoriginalfields[i]] = inpValue;

        } else {
            inpValue = document.getElementById("inp-" + projectfields[i]).value;
            data[projectfields[i]] = inpValue;

        }
    }
    let bodyobj = {
        data: data,
        projectid: currentproject.id,
        dataid: currentprojectdata.id
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `api/projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})