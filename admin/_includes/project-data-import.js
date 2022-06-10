//add a ready function

/*
todo

show a preview of the data before uploading
allow them to import aagin
*/

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    $("#csv-file").change(handleFileSelect);
    document.getElementById('showBody').classList.remove('d-none')
    function handleFileSelect(evt) {
        var file = evt.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                //update the fields
                let xhrDone = (res) => {
                    res = JSON.parse(res)
                    //console.log(res);
                    deleteProjectAlldata()
                    document.getElementById('uploadfile').classList.add('d-none')
                    showAlert(res.message, 1, 0);
                    //update local schema 
                    let project = getCurrentProject()
                    project.schema.fields = results.meta.fields.toString()
                    project.schema.originalfields = results.meta.fields.toString();
                    updateCacheProjects(project)
                    //update local all data
                    storeProjectAlldata(res,1)
                    //deleteProjectAlldata()

                }
                let project = getCurrentProject();
                let fields = { fields: results.meta.fields.toString(), originalfields: results.meta.fields.toString() }
                let bodyobj = {
                    projectid: project.id,
                    fields: fields,
                    data: results.data
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //send it
                xhrcall(0, `api/projectdataimport/`, bodyobjectjson, "json", "", xhrDone, token)

            }
        });
    }

})