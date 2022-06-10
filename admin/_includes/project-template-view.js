/*
when we have done the data import we have to rebuild this


*/
let projectid = 0;
let dataid = 0


let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the project
    let project = getCurrentProject();
        //get he prpject data
        //note could add a flag to the get all that just returns first
        projectdata = getCurrentProjectData(0)
        //hold the fields
        let theFields;
        ////hold the template
        let theTemplate;
        //hold the data
        let theData;
        //set the template
        theTemplate = project.template;
        //get the fields
        theFields = Object.keys(projectdata.data)
        //get the data
        theData = Object.values(projectdata.data)
        //loop through the data
        for (var i = 0; i < theFields.length; ++i) {
            element = `\{\{${theFields[i]}\}\}`
            theTemplate = theTemplate.replace(element, theData[i]);
        }
        //check we have data
        if (theData.length == "")
            theTemplate = "No data added for this project"

        //check we have a template
        if (theTemplate== "")
            theTemplate = "No template added for this project"
        document.open();
        document.write(theTemplate);
        document.close();

})