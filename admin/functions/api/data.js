/*
    notes:


    naming convertion for KV stores.
    <methoddame><payloadname>]<payloadid>
*/

//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
//set data main to whatever is in env for consistency
const datamain = "data";
let dataSchema = { id: "", createdAt: "", elementData: [], paidData: [] }
let paidDataSchema = { paidAddress: "", confirmations: 0, amount: 0 }
//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
//unique uid module
var uuid = require('uuid');
//set up the data schema for the table.
//note we could extend this to have field types and other such nonsense for dynamic  rendering but I don't want to do that and you cannot make me.

//return the date
let getDate = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let formattedDate = `${date_ob.getDate()}/${date_ob.getMonth()+1}/${date_ob.getFullYear()}`
    return (formattedDate)
}

//decode the jwt token
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
        //get user

        //set up the kv data
        const KV = context.env.kvdata;
        let user = await KV.get("user" + details.payload.username);
        user = JSON.parse(user)
        //get the item
        let theItem = await KV.get(datamain + "-" + user.user.secret + "]" + payLoad.id);
        //console.log(datamain+  payLoad.oldname+"]" +payLoad.id)
        //parse it
        theItem = JSON.parse(theItem)
        //console.log(theItem)
        //check that they sent up the data
        //note : we could make this simplier by just parsing the payload array.

        //let elementSchema = {"type":"input","required":false,"placeholder":"","value":""}

        if (theItem != null) {
            let tmp = elementSchema;
            let value = "";
            if (payLoad.name != undefined)
                theItem.name = payLoad.name;
            if (payLoad.paymentAddress != undefined)
                theItem.paymentAddress = payLoad.paymentAddress;
            if (payLoad.amount != undefined)
                theItem.amount = payLoad.amount;
            if (payLoad.paid != undefined)
                theItem.paid = payLoad.paid;
            //console.log(datamain + payLoad.id)
            //delete the old one
            //await KV.delete(datamain + payLoad.oldname + "]" + payLoad.id);
            //put the new one.
            //console.log(datamain  +"-"+user.user.secret+  payLoad.id)
            await KV.put(datamain + "-" + user.user.secret + "]" + payLoad.id, JSON.stringify(theItem));
            return new Response(JSON.stringify({ message: "Item updated", data: JSON.stringify(theItem) }), { status: 200 });
        } else
            return new Response(JSON.stringify({ error: "item not found" }), { status: 400 });

    }

}

export async function onRequestDelete(context) {

    /*
    todo

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
        let user = await KV.get("user" + details.payload.username);
        user = JSON.parse(user)
        //console.log(payLoad)
        //console.log(datamain  "]" + payLoad.deleteid)
        await KV.delete(datamain + "-" + user.user.secret + "]" + payLoad.deleteid);
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
        //console.log(payLoad)
    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    const KV = context.env.kvdata;
    //get user
    let user = await KV.get("user" + details.payload.username);
    user = JSON.parse(user)
    let theCheck = await KV.list({ prefix: datamain + "-" + user.user.secret });
    let exists = 0;
    //generate a id
    let id = uuid.v4();
    //loop through the KV items 
    if (theCheck.keys.length > 0) {
        for (var i = 0; i < theCheck.keys.length; ++i) {
            //build the kv object we are trying to write
            let tmp = theCheck.keys[i].name.split(']')
            //check if matches the one we want to create
            if (tmp[0] == datamain + id)
                exists = 1;
        }
    }
    //it exists so return as we don't want to overwite do we? DO WE???
    if (exists == 1)
        return new Response(JSON.stringify({ error: "data name already exists" }), { status: 400 });
    else {
        //get the current date
        let fDate = getDate()
        //get the keys
        let keys = Object.keys(payLoad);
        //get the values
        let values = Object.values(payLoad);
        //set the data array schema
        //note : We don't really have to do this but it keeps things consistent.
        let theDataArray = dataSchema; 
        //set the created date
        theDataArray.createdAt = fDate;
        //set the kv id
        theDataArray.id = id;
        //build the form  objects
        for (var i = 0; i < keys.length; ++i) {
            theDataArray.elementData.push({ "type": "input", "required": false, "placeholder": "Please enter "+keys[i]+" value", "value": ""+values[i]+"", "name": ""+keys[i]+"" })
        }
        //put the KV object
        await KV.put(datamain + "-" + user.user.secret + "]" + id, JSON.stringify(theDataArray));
        //get the payment queue
        let queueData = await KV.get("paymentqueue");
        let paymentQueueArray = [];
        //check  it exists (maybe redundant but costs nothing to have)
        if (queueData == null) {
            //create a queue and add the data
            let tmp = { "kv": "" }
            tmp.kv = `${datamain}-${user.user.secret}]${id}`
            //create the first entry
            paymentQueueArray.push(tmp)
            //put the payment queue object
            await KV.put("paymentqueue", JSON.stringify(paymentQueueArray));
        } else {
            //add to the payment queue 
            let tmp = { "kv": "" }
            tmp.kv = `${datamain}-${user.user.secret}]${id}`
            queueData = JSON.parse(queueData)
            queueData.push(tmp)
            /*
            debug
            for (var i = 0; i < queueData.length; ++i) {
                console.log(queueData[i].kv)
            }
            */
            //put the payment queue object
            await KV.put("paymentqueue", JSON.stringify(queueData));
        }
        //sedt lowe
        return new Response(JSON.stringify({ message: "Item added", data: JSON.stringify(theDataArray) }), { status: 200 });

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
    //get user
    let user = await KV.get("user" + details.payload.username);
    user = JSON.parse(user)
    //get the projects based on the name
    let theData = await KV.list({ prefix: datamain + "-" + user.user.secret });
    let theDataArray = []
    if ((dataid != null) && (dataid != "")) {
        let pData = await KV.get(datamain + "-" + user.user.secret + dataid);
        theDataArray.data.push(JSON.parse(pData))
    } else {
        if (theData.keys.length > 0) {
            for (var i = 0; i < theData.keys.length; ++i) {
                //get the item
                let pData = await KV.get(theData.keys[i].name);
                //pData = JSON.parse(pData)
                console.log(pData)
                //debug for easy clean up
                //console.log(theData.keys[i].name);
                //await KV.delete(theData.keys[i].name);
                theDataArray.push(pData)
            }
        }
    }
    return new Response(theDataArray, { status: 200 });
}