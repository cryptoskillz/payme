/*
    todo:

    

    notes:


    naming convertion for KV stores.

    projects<username>*<projectid>
*/

let projectId;
let payLoad;
let contentType;
//set data main to whatever is in env for consistency
const datamain = "data";
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
        //get the payload
        payLoad = await request.json();
        //console.log(payLoad)
        //get the details
        let details = await decodeJwt(request.headers, env.SECRET)
        //set up the kv data
        const KV = context.env.kvdata;
        //get the item
        let theItem = await KV.get(datamain + details.payload.username +  payLoad.oldname+"]" +payLoad.id);
        //console.log(datamain + details.payload.username + payLoad.oldname+"]"+payLoad.id)
        //parse it
        theItem = JSON.parse(theItem)
        //check that they sent up the data
        //note : we could make this simplier by just parsing the payload array.
        if (payLoad.name != undefined)
            theItem.name = payLoad.name;
        //console.log(datamain + details.payload.username + payLoad.id)
        //delete the old one
        await KV.delete(datamain + details.payload.username + payLoad.oldname +"]" +payLoad.id);
        //put the new one.
        await KV.put(datamain + details.payload.username + payLoad.name+ "]" +payLoad.id, JSON.stringify(theItem));
        return new Response(JSON.stringify({ message: "Item updated", data: JSON.stringify(theItem) }), { status: 200 });
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
        //console.log(payLoad)
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.kvdata;
        console.log(payLoad)
        console.log(datamain + details.payload.username +payLoad.name+ "]" +payLoad.deleteid)
        await KV.delete(datamain + details.payload.username +payLoad.name+ "]" +payLoad.deleteid);
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
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    //check for projects
    const KV = context.env.kvdata;
    //check if it exists
    //console.log(payLoad)
    let theCheck = await KV.list({ prefix: datamain + details.payload.username });
    let exists = 0;
    if (theCheck.keys.length > 0) {
        for (var i = 0; i < theCheck.keys.length; ++i) {
            let tmp = theCheck.keys[i].name.split(']')
            //console.log(datamain + details.payload.username +payLoad.name)
            //console.log(tmp[0])
            if (tmp[0] == datamain + details.payload.username +payLoad.name)
                exists = 1;
        }
    }

    if (exists == 1)
        return new Response(JSON.stringify({ error: "data name already exists" }), { status: 400 });
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
        //console.log(datamain + details.payload.username + payLoad.name + "]" + id)
        await KV.put(datamain + details.payload.username + payLoad.name + "]" + id, JSON.stringify(projectData));
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
    let dataid = searchParams.get('id')
    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.kvdata;
    //get the projects based on the name
    let theData = await KV.list({ prefix: datamain + details.payload.username });
    let theDataArray = { data: [] }
    if ((dataid != null) && (dataid != "")) {
        let pData = await KV.get(datamain + details.payload.username +   "]" +projectid);
        theDataArray.data.push(JSON.parse(pData))
    } else {
        if (theData.keys.length > 0) {
            for (var i = 0; i < theData.keys.length; ++i) {
                //get the item
                let pData = await KV.get(theData.keys[i].name);
                pData = JSON.parse(pData)
                //debug for easy clean up
                //console.log(theData.keys[i].name);
                //await KV.delete(theData.keys[i].name);
                theDataArray.data.push(pData)
            }
        }
    }
    return new Response(JSON.stringify(theDataArray), { status: 200 });
}