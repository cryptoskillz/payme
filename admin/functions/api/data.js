/*
    todo:

    

    notes:


    naming convertion for KV stores.

    projects<username>*<projectid>
*/

let projectId;
let payLoad;
let contentType;
const jwt = require('@tsndr/cloudflare-worker-jwt')
var uuid = require('uuid');

let getDate = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let formattedDate = `${date_ob.getDate()}/${date_ob.getMonth()+1}/${date_ob.getFullYear()}`
    return (formattedDate)
}

let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}



export async function onRequestPut(context) {
    //const jwt = require('@tsndr/cloudflare-worker-jwt')
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
        payLoad = await request.json();
        let details = await decodeJwt(request.headers, env.SECRET)

        //let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        let projectData = await KV.get("projects" + details.username + "*" + payLoad.id);
        //console.log("projects" + details.username + "*" + payLoad.id)
        projectData = JSON.parse(projectData)
        if (payLoad.name != undefined)
            projectData.name = payLoad.name;
        if (payLoad.template != undefined) {
            projectData.template = payLoad.template;
        }
        if (payLoad.templatename != undefined)
            projectData.templatename = payLoad.templatename;
        if (payLoad.schema != undefined)
            projectData.schema = payLoad.schema;
        await KV.put("projects" + details.username + "*" + payLoad.id, JSON.stringify(projectData));
        return new Response(JSON.stringify({ message: "Item updated", data: JSON.stringify(projectData) }), { status: 200 });


    }

    return new Response({ message: "put" }, { status: 200 });

}

export async function onRequestDelete(context) {

    /*
    todo

    remove the data for any project when you delete it

    */
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    //return new Response({message:"delete"}, { status: 200 });
    contentType = request.headers.get('content-type');
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.backpage;
        await KV.delete("projects" + details.username + "*" + payLoad.dataid);
        return new Response(JSON.stringify({ message: "item deleted" }), { status: 200 });
    }
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
        //get the login credentials
        payLoad = await request.json();
    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.backpage;
    //check if it exists
    let exists = await KV.get("data" + details.username + "|" + payLoad.name);
    if (exists != null)
        return new Response(JSON.stringify({ error: "Item exists" }), { status: 400 });
    else {
        //alternate key method
        //let projects = await KV.list({ prefix: "projects" + details.username + "*" });
        //console.log(projects.keys.length)
        //let projectsData = {data: []}
        //let id = projects.keys.length+1

        let id = uuid.v4();
        let schemaJson = {
            "fields": "",
            "originalfields": ""
        }
        let fDate = getDate()
        let projectData = { id: id, name: payLoad.name, templatename: "", template: "", schema: schemaJson, createdAt: fDate }

        await KV.put("projects" + details.username + "*" + id, JSON.stringify(projectData));
        return new Response(JSON.stringify({ message: "Item added", data: JSON.stringify(projectData) }), { status: 200 });

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

    const { searchParams } = new URL(request.url)
    let projectid = searchParams.get('id')

    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.backpage;
    //get the projects based on the name
    //console.log("projects" + details.username + "*")
    let projects = await KV.list({ prefix: "data" + details.username + "*" });

    let projectsData = { data: [] }
    if ((projectid != null) && (projectid != "")) {
        let pData = await KV.get("projects" + details.username + "*" + projectid);
        //console.log("projects" + details.username + "*" + projectid)
        //debug for easy clean up
        //await KV.delete("projects-" + details.username+"*"+tmp[2]);
        projectsData.data.push(JSON.parse(pData))
    } else {
        if (projects.keys.length > 0) {
            for (var i = 0; i < projects.keys.length; ++i) {
                let tmp = projects.keys[i].name.split('*');
                //console.log("projects" + details.username + "|" + tmp[1])
                let pData = await KV.get("projects" + details.username + "*" + tmp[1]);
                pData = JSON.parse(pData)
                //debug for easy clean up
                //console.log("projects" + details.username + "*" + tmp[1]);
                //await KV.delete("projects" + details.username+"*"+tmp[1]);
                projectsData.data.push(pData)
            }
        }
    }
    return new Response(JSON.stringify(projectsData), { status: 200 });
}