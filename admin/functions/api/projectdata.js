/*
    todo:



    notes:


    naming convertion for KV stores.

    project-data<username>*<projectid>*<dataid>

*/

let projectId;
let payLoad;
let contentType;
const jwt = require('@tsndr/cloudflare-worker-jwt')
var uuid = require('uuid');

let dataArray = [];
let buildDataArray = (theData,theId="") => {
    let id;
    if (theId == "")
        id = uuid.v4();
    else
        id = theId
    let projectData = { id: id, data: theData, createdAt: "21/12/2022"}
    dataArray.push(projectData)
    return(projectData)
}

let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

export async function onRequestPut(context) {
    const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    let payLoad;
    let projectName = "";
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        payLoad = await request.json();

    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    let kvname = "projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid;

    let projectData = { data: "", id: "" }
    projectData.id = payLoad.dataid
    projectData.data = payLoad.data
    projectData = JSON.stringify(projectData)
    //await KV.delete(kvname);
    await KV.put(kvname, projectData);
    return new Response(JSON.stringify({ message: "Item updated", data: projectData }), { status: 200 });


}
export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    let payLoad;
    let projectName = "";
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        payLoad = await request.json();

    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    let id = uuid.v4();
    let projectData = { data: "", id: "" }
    projectData.id = id
    projectData.data = payLoad.data
    let kvname = "projects-data" + details.username + "*" + payLoad.projectid + "*" + id;
    //check it does not already exist
    projectData = JSON.stringify(projectData)
    //await KV.delete(kvname);
    await KV.put(kvname, projectData);
    return new Response(JSON.stringify({ message: "Item added", data: projectData }), { status: 200 });


}

export async function onRequestDelete(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    contentType = request.headers.get('content-type');
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        //console.log("projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid)
        await KV.delete("projects-data" + details.username + "*" + payLoad.projectid + "*" + payLoad.dataid);
        return new Response(JSON.stringify({ message: "item deleted" }), { status: 200 });
    }
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
    try {
        dataArray = []
        const { searchParams } = new URL(request.url)
        let projectid = searchParams.get('projectid')
        //console.log("projects" + details.username + "|" + tmp[1])
        let details = await decodeJwt(request.headers, env.SECRET)
        //set up the KV
        const KV = context.env.backpage;
        //get the project
        let project = await KV.get("projects" + details.username + "*" + projectid);
        project = JSON.parse(project)
        //get the projects based on the name
        let kv = await KV.list({ prefix: "projects-data" + details.username + "*" + projectid + "*" });
        if (kv.keys.length > 0) {
            for (var i = 0; i < kv.keys.length; ++i) {
                let tmp = kv.keys[i].name.split('*');
                //console.log("projects-data" + details.username + "*" + tmp[1] + "*" + tmp[2])
                let pData = await KV.get("projects-data" + details.username + "*" + tmp[1] + "*" + tmp[2]);
                pData = JSON.parse(pData)
                let pData2 = buildDataArray(pData.data,pData.id)
            }
        }

        return new Response(JSON.stringify({ message: "ok",data: JSON.stringify(dataArray)}), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}