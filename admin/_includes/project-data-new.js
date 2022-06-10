let fields;
let originalfields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        //get the project
        project = JSON.parse(project);
        fields = project.schema.fields.split(",");
        originalfields = project.schema.originalfields.split(",")

        //console.log(fields)

        //fields = Object.keys(fields);
        //loop through  the keys
        let inpHtml = "";
        for (var i = 0; i < fields.length; ++i) {

            if (fields[i] == "UNUSED") {
                inpHtml = inpHtml + `    <div class="form-group" >
            <label>${originalfields[i]} (note this is not used in the current schema)</label>
<input type="text" class="form-control form-control-user" id="inp-${originalfields[i]}" aria-describedby="emailHelp" placeholder="Enter ${originalfields[i]}" value="">
</div>`
            } else {


                inpHtml = inpHtml + `<div class="form-group" >
            <label>${fields[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${fields[i]}" aria-describedby="emailHelp" placeholder="Enter ${fields[i]}" value="">
</div>`
            }
            //console.log(inpHtml)
        }
        document.getElementById('formInputs').innerHTML = inpHtml
        //show the body
        document.getElementById('showBody').classList.remove('d-none');

    }

})

document.getElementById('btn-create').addEventListener('click', function() {
    let project = getCurrentProject()
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1, 0);
        addCachedProjectData(res, 0);
        document.getElementById('project-header').innerHTML = "Project record added";
        document.getElementById('formInputs').classList.add("d-none");
        document.getElementById('btn-create').classList.add("d-none");
    }
    let data = {};
    for (var i = 0; i < fields.length; ++i) {
        let inpValue = "";
        if (fields[i] == "UNUSED") {
            inpValue = document.getElementById("inp-" + originalfields[i]).value;
            data[originalfields[i]] = inpValue;

        } else {
            inpValue = document.getElementById("inp-" + fields[i]).value;
            data[fields[i]] = inpValue;

        }
    }
    //let project = window.localStorage.project
    //project = JSON.parse(project);
    let bodyobj = {
        data: data,
        projectid: project.id
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(0, `api/projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})