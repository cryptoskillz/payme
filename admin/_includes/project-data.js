/*

todo 

remove the data-import-data code and replace with just data import
when we do the csv import it goes back to poject-data
schema editing moving to project-data-schema

we will store all the data from the import and then look at the fields paramater to decide if we are to use the data or not
we can do this front or backend I think backend is best that way we can prefilter the data 

add record will rely on the schema to be set


*/
let backpages;

let loadURL = (theUrl, theId, blank = 0) => {
    //update this to use generic finctions
    //console.log(backpages)
    getProjectAlldata(theId, 0)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;

}

//table render
let renderTable = (data, actions = [], method = "") => {

    //get the project
    let project = window.localStorage.project
    project = JSON.parse(project);
    //set the arrays for the table
    let columns = []
    let dataresult = []
    //get the keys from the schema and move into an array
    var keys = project.schema.fields.split(",")
    let unusedFields = []

    //loop through the keys and build the columns
    for (var i = 0; i < keys.length; ++i) {
        if (keys[i] != "UNUSED") {
            colJson = { title: keys[i] }
            //add it it the columns object
            columns.push(colJson)

        } else
            unusedFields.push(i)
    }
    //console.log(unusedFields)

    //add the actions column
    if (actions.length != 0) {
        columns.push({ title: "actions" })
    }


    let tableRowCount = 0;

    //check for the first column with a number to set as the ids for row deletion in the table
    let foundIt = 0
    //console.log(data[0].data)
    //console.log("render table data")
    //console.log(data)

    let tmpd = Object.values(data[0].data)

    for (var i = 0; i < tmpd.length; ++i) {
        if ((!isNaN(tmpd[i]) && foundIt == 0)) {
            foundIt = 1;
            tableRowCount = i
        }

    }
    //loop through the data
    for (var i = 0; i < data.length; ++i) {
        if (i == 0)
            getProjectAlldata(data[i].id, 0)


        //pull out the values and store in the array
        let tmp = data[i].data;


        //remove unused fields
        for (var i2 = 0; i2 < unusedFields.length; ++i2) {
            delete tmp[Object.keys(tmp)[unusedFields[i2]]]
        }

        // console.log(tmp)



        //the field values
        let tableId;
        tableId = Object.values(tmp)




        //tableDeleteId =data.data[i].bpid
        if (actions.length != 0) {
            let buttons = "";

            //edit button
            if (actions[0] == 1)
                buttons = buttons + `<a href="javascript:loadURL('/project/data/edit/','${data[i].id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            //publish button
            if (actions[1] == 1)
                buttons = buttons + `<a href="/project/data/?id=${data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-globe fa-sm text-white-50"></i> Publish</a>`
            //view button
            if (actions[2] == 1)
                buttons = buttons + `<a  href="javascript:loadURL('/project/template/view/','${data[i].id}',1)" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50" ></i> View</a>`
            //delete button
            if (actions[3] == 1)
                buttons = buttons + `<a href="javascript:deleteTableItem('${data[i].id}','${tableId[tableRowCount]}','${method}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            tmp.actions = buttons;
        }
        //console.log(tmp)
        dataresult.push(Object.values(tmp))
    }
    //render the table
    //console.log(dataresult)
    table = $('#dataTable').DataTable({
        data: dataresult,
        rowId: tableRowCount,
        columns: columns,

    });


}

let zipBackPages = () => {
    let projectdata = getProjectAlldata()
    let project = getCurrentProject();
    let theCode = project.template;
    let theTemplateName = project.templatename;
    valid = 1;
    //console.log(projectdata)

    if ((projectdata.length == "") || (projectdata == null) || (projectdata == null)) {
        showAlert('No data for this project add some here <a href="/project/data/import/">here</a>', 2)
        valid = 0;
    }

    if ((theCode == "") || (theCode == null)) {
        showAlert('Template is not set set it <a href="/project/data/template">here</a>', 2)
        valid = 0;
    }
    if ((theTemplateName == "") || (theTemplateName == null)) {
        showAlert('Template name is not set set it <a href="/project/data/template">here</a>', 2)
        valid = 0;
    }

    if (valid == 1) {
        //process the data
        let keys;
        let theData;
        let theName
        //init the zipper
        let zip = new JSZip();
        //loop through the pages
        for (var i = 0; i < projectdata.length; ++i) {
            let tmpCode = theCode;
            //the keys should not be different so we could move this out of the loop
            theKeys = Object.keys(projectdata[i].data)
            //console.log(theKeys)
            //get the data
            theData = projectdata[i].data
            //console.log(theData)
            //set the template
            theName = theTemplateName
            //loop through the data
            for (var key in theData) {
                //loop through the keys
                for (var key2 in theKeys) {

                    //check if we have a matching key
                    if (key == theKeys[key2]) {
                        //set it up to suport liqiud
                        let keyReplace = `\{\{${key}\}\}`
                        //replace the key in the template with the data
                        tmpCode = tmpCode.replace(keyReplace, theData[key])
                        //check it is not blank
                        if (theData[key] != "")
                            theName = theName.replace(keyReplace, theData[key])
                        else
                            theName = theName.replace(keyReplace, "")
                    }
                }
            }
            //console.log(tmpCode)
            //add the zip file
            zip.file(`backpages/${theName}/index.html`, tmpCode);
        }
        //create the zip
        zip.generateAsync({
            type: "base64"
        }).then(function(content) {
            window.location.href = "data:application/zip;base64," + content;
        });
    }


}

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let xhrDone = (res, local = 0) => {
        //if 0 its live not from the cache so we have to save it. 
        //console.log(res)
        let data = "";
        if (local == 0) {
            console.log('not cached')
            res = JSON.parse(res)
            data = JSON.parse(res.data)
            //console.log(data)
            storeProjectAlldata(res, 0);

        } else {
            //cached
            console.log(' cached')
            data = res
        }

        if (res.length == 0)
            showAlert(`No data added, click <a href="/project/data/import/">here<a/> to import from a CSV`, 2, 0)
        else {
            document.getElementById("showBody").classList.remove('d-none')
            //console.log(data)
            if ((data.length != 0) && (data != "") && (data != null))
                renderTable(data, [1, 0, 1, 1], "api/projectdata")

        }

    }
    //get all the data
    projectAllData = getProjectAlldata("", 0);
    //console.log(projectAllData)
    //check if it is false
    if (projectAllData != false) {
        xhrDone(projectAllData, 1);
    } else {
        //if (projectAllData == false) {
        let projectid = getProjectId()
        xhrcall(1, `api/projectdata/?projectid=${projectid}`, "", "json", "", xhrDone, token)
    }
})

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            window.location.href = `/project/data/import/`
            break;
        case "2":
            let valid = 1
            project = getCurrentProject()
            if ((project.schema.originalfields == "") || (project.schema.originalfields == null)) {
                showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                valid = 0;
            }

            if ((project.template == "") || (project.template == null)) {
                showAlert(`Please save the template to view it`, 2)
                valid = 0;

            }

            if ((project.templatename == "") || (project.templatename == null)) {
                showAlert(`Please add a template name to view it`, 2)
                valid = 0;

            }
            if (valid == 1) {
                let url = `/api/export/export/?projectid=${project.id}&secretid=${user.secret}`
                window.open(`${url}`, '_blank');

            }

            break;
        case "3":
            window.location.href = `/project/data/schema/`
            break;
        case "4":
            window.location.href = `/project/data/template/`
            break;
        case "5":
            zipBackPages()
            break;
        case "6":
            projectAllData = getProjectAlldata("", 0);
            if ((projectAllData.length != 0) && (projectAllData != "") && (projectAllData != null))
                window.location.href = `/project/data/new/`
            else
                showAlert(`No data added, click <a href="/project/data/import/">here<a/> to import from a CSV before you can add records`, 2)
            break;
        case "7":
            window.location.href = `/projects/`
            break;
        default:
            // code block
    }
    this.value = 0;

})