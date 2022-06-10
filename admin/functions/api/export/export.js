let dataArray = [];
let buildDataArray = (theData, theId = "") => {
    //console.log("theData");
    let id;
    if (theId == "")
        id = uuid.v4();
    else
        id = theId
    //console.log(theData);
    let projectData = { id: id, data: theData, createdAt: "21/12/2022" }
    //console.log(projectData)
    dataArray.push(projectData)
    return (projectData)
}

let buildTemplate = (project, projectdata) => {
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
        let element = `\{\{${theFields[i]}\}\}`
        theTemplate = theTemplate.replace(element, theData[i]);
    }
    //check we have data
    if (theData.length == "")
        theTemplate = "No data added for this project"

    //check we have a template
    if (theTemplate == "")
        theTemplate = "No template added for this project"
    return (theTemplate)
}


export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    const KV = context.env.backpage;

    //get the paramaters
    const { searchParams } = new URL(request.url)
    let projectid = searchParams.get('projectid')
    let secretid = searchParams.get('secretid')
    let showproject = searchParams.get('showproject')
    let showtemplate = searchParams.get('showtemplate')
    let showdata = searchParams.get('showdata')
    if (showproject == null)
        showproject = 1;
    if (showtemplate == null)
        showtemplate = 1;
    if (showdata == null)
        showdata = 1;
    //get the secret id
    let user = await KV.get("username" + secretid);
    user = JSON.parse(user);
    //tocheck if username matches

    //get the project
    let project = await KV.get("projects" + user.username + "*" + projectid);
    project = JSON.parse(project)

    //get the projects list
    let templates = []
    let projectdatalist = await KV.list({ prefix: "projects-data" + user.username + "*" + projectid + "*" });
    if (projectdatalist.keys.length > 0) {
        for (var i = 0; i < projectdatalist.keys.length; ++i) {
            //build the data object
            let tmp = projectdatalist.keys[i].name.split('*');
            let projectdata = await KV.get("projects-data" + user.username + "*" + projectid + "*" + tmp[2]);
            //parse it
            projectdata = JSON.parse(projectdata)
            //store it
            let pData2 = buildDataArray(projectdata.data, projectdata.id)
            let template;
            if (showtemplate == 1)
                template = buildTemplate(project, projectdata)
            else
                template = "";
            //console.log(projectdata)
            let tmpA = { template: template, project: project, data: pData2 }
            if (showproject == 0)
                delete tmpA.project;
            if (showtemplate == 0)
                delete tmpA.template;
            if (showdata == 0)
                delete tmpA.data;
            //console.log(tmpA)
            templates.push(tmpA)

        }
        //console.log(dataArray)
    }

    //merge it with the template
    //check we have template / name and schema (fields set)

    //return  it
    return new Response(JSON.stringify({ templates }), { status: 200 });



}