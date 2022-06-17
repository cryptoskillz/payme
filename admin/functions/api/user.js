/*
    This endpoin updates a user
    note: we could move login into here and  possible register

*/
var uuid = require('uuid');
//JWT 
const jwt = require('@tsndr/cloudflare-worker-jwt');

let settingsSchema = {  elementData: [] }


//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

//note do we even call this as we have the register endpoint?
//register the user
export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //set a valid boolean
    let valid = 1;
    const contentType = request.headers.get('content-type')
    let registerData;
    if (contentType != null) {
        //get the login credentials
        let payLoad = await request.json();
        //set up the KV
        const KV = context.env.kvdata;
        //see if the user exists
        let secretid = uuid.v4();
        let json = JSON.stringify({ "jwt": "", "user": {  "username": payLoad.username, "email": payLoad.username,"password":payLoad.password,"secret":secretid,payLoad:"0" },"settings":settingsSchema })
        //check if user exist
        const user = await KV.get("user" + payLoad.username);
        if (user == null)
        {
            //create a KV with the username and secret that we can use for any of the export functions.  If you are not going to have give you users API access then you will 
            //not require this.
            //await KV.put("user" + registerData.username+"]"+secretid,  JSON.stringify({username:registerData.username}));
            await KV.put("user" + payLoad.username, json);
            //create the settings file
            //await KV.put("settings" + secretid, JSON.stringify(settingsSchema));
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        else
            return new Response(JSON.stringify({ error: "email exists" }), { status: 400 });

    }
    else
        return new Response(JSON.stringify({ error: "register error" }), { status: 400 });
}

//note : as we only let them update the elementdata we will have to extend this if we want to let them update username / email etc.
export async function onRequestPut(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //set a valid boolean
    let valid = 1;
    //get the content type from the headers
    const contentType = request.headers.get('content-type')
    //cgeck  we got the correct headers
    if (contentType != null) {
        //get the payload
        let payLoad = await request.json();
        //get the detaild
        let details = await decodeJwt(request.headers, env.SECRET)
        //set up the KV
        const KV = context.env.kvdata;
        //check if user exist
        let user = await KV.get("user" + details.payload.username);
        if (user == null)
        {
            //the user does not exist, end this.
            return new Response(JSON.stringify({ status: "user  does not exist" }), { status: 400 });
        }
        else
        {
            //parse the user and payload
            user = JSON.parse(user);
            payLoad = JSON.parse(payLoad);
            //get the keys
            let keys = Object.keys(payLoad);
            //get the values
            let values = Object.values(payLoad);
            let theDataArray = []
            //blank the user settings.
            //note this could be  dangerous if the payload is malformed, will loop back and test this later. 
            user.settings.elementData =[]
            //copy in the current item
            theDataArray = user.settings;
            //loop  around the keys and build the settings element
            for (var i = 0; i < keys.length; ++i) {
                //store the new value
                theDataArray.elementData.push({"name":keys[i],"value":values[i]})
            }
            //update the user settings
            user.settings =  theDataArray
            //write the kv object
            KV.put("user" + details.payload.username,JSON.stringify(user));
            //return the response
            //note we are not returning  the  token here as they still have a valid one but we could for added security
            return new Response(JSON.stringify({ "jwt": "", "user": { "username": details.identifier, "email": details.identifier, "secret": user.secret,datacount:user.datacount },"settings":user.settings }), { status: 200 });

            //return new Response(JSON.stringify(user), { status: 200 });
        }

    }
    else
        return new Response(JSON.stringify({ error: "update user error" }), { status: 400 });
}