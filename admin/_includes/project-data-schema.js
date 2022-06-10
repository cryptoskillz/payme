/*

when you update, refresh the form (chnage the label)
*/
let newfields;
let fields;
let originalfields;
let projectid;
let project;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    projectid = getProjectId();
    project = getCacheProjects(projectid)
    if (project.schema.fields == "") {
        showAlert(`No schema for this project, click here to import <a href="/project/data/import/data/?projectid=${projectid}">data</a>`, 2, 0)

    } else {
        let fields = project.schema.fields.split(",")
        let originalfields = project.schema.originalfields.split(",")
        //console.log(fields);
        let inpHtml = "";
        document.getElementById('originalschema').innerHTML = `Leave fields blank to remove<br>Fields in the imported data ${project.schema.originalfields}`
        for (var i = 0; i < fields.length; ++i) {
            //console.log(fields[i])
            //let theData = res.data.attributes.data[keys[i]]
            let tmpvalue = ""
            let tmpmessage = `unused field ${originalfields[i]} from  the imported data`
            if (fields[i] != "UNUSED") {
                tmpvalue = fields[i]
                tmpmessage = `Schema field ${i+1} (original name ${originalfields[i]})`
            }

            inpHtml = inpHtml + `    <div class="form-group" >
            <label>${tmpmessage}</label>
<input type="text" class="form-control form-control-user" id="inp-${originalfields[i]}" aria-describedby="emailHelp" placeholder="Enter ${originalfields[i]} " value="${tmpvalue}">
</div>`
        }
        document.getElementById('formInputs').innerHTML = inpHtml
        document.getElementById('showBody').classList.remove('d-none')
    }

})

document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1);

    }
    

    let inpValue = "";
    let originalfields = project.schema.originalfields.split(",")

    for (var i = 0; i < originalfields.length; ++i) {
        tmpvalue = document.getElementById("inp-" + originalfields[i]).value;
        if (tmpvalue == "")
            tmpvalue = "UNUSED"
        if (inpValue == "")
            inpValue = inpValue + tmpvalue
        else
            inpValue = inpValue + ',' + tmpvalue
        //console.log(inpValue)
    }

    let ofields = originalfields.join(",")
    newfields = { fields: inpValue, originalfields: ofields }

    let bodyobj = {
        schema: newfields,
        id: project.id
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)

})