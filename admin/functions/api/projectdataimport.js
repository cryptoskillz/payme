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

let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

let dataArray = [];
let buildDataArray = (theData) => {
    let id = uuid.v4();
    let projectData = { id: id, data: theData, createdAt: "21/12/2022" }
    dataArray.push(projectData)
    return (projectData)
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

    try {
        dataArray = []
        let payLoad;
        let projectName = "";
        const contentType = request.headers.get('content-type')
        if (contentType != null) {
            //get the login credentials
            payLoad = await request.json();
        }
        //decode jwt
        let details = await decodeJwt(request.headers, env.SECRET)
        //check for projects
        const KV = context.env.backpage;
        //delete the data
        let kv = await KV.list({ prefix: "projects-data" + details.username + "*" + payLoad.projectid + "*" });
        //delte old records
        if (kv.keys.length > 0) {
            for (var i = 0; i < kv.keys.length; ++i) {
                await KV.delete(kv.keys[i].name);
            }
        }
        //add new records
        let projectsData = { data: [] }
        let pData;
        if (payLoad.data.length > 0) {
            dataArray = [];
            for (var i = 1; i < payLoad.data.length; ++i) {
                let pData = buildDataArray(payLoad.data[i])
                let kvname = "projects-data" + details.username + "*" + payLoad.projectid + "*" + pData.id;
                await KV.put(kvname, JSON.stringify(pData));
            }
        }
        //update the schema
        let project = await KV.get("projects" + details.username + "*" + payLoad.projectid);
        project = JSON.parse(project)
        let tmp = "";
        if (payLoad.fields.originalfields != "")
            tmp = payLoad.fields.originalfields.toString();
        let schemaJson = {
            "fields": tmp,
            "originalfields": tmp
        }
        project.schema = schemaJson
        await KV.put("projects" + details.username + "*" + payLoad.projectid, JSON.stringify(project));

        return new Response(JSON.stringify({ message: `${dataArray.length} records imported`, data: JSON.stringify(dataArray) }), { status: 200 });
    } catch (error) {
        return new Response(error, { status: 200 });
    }
}