//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
//hold a payment addres
let _paymentAddress
//get the data
let processElementData = (elementData) => {
    for (var k = 0; k < elementData.length; ++k) {
        let tmp = elementData[k]
        //build a check button to see if we been paid or not
        if (tmp.name == "paymentAddress") {
            _paymentAddress = tmp.value;

        }

    }
}

//update the data
let updateElementData = (elementData, theValue) => {
    for (var j = 0; j < elementData.length; ++j) {
        let tmp = elementData[j]
        //build a check button to see if we been paid or not
        if (tmp.name == "paid") {
            tmp.value = "1"
            elementData[j] = tmp
        }

    }
    return (elementData)
}



//add to the data array
let addToDataArray = (pData) => {
    //console.log(queueData[i].kv)
    ///console.log(pData)
    //parse it
    pData = JSON.parse(pData);
    //build the   object
    paymentResponse.id = pData.id;
    paymentResponse.paid = pData.elementData[3].value;
    paymentResponse.confirmations = "0";
    paymentResponse.paymentAddress = pData.elementData[0].value;
    paymentResponse.paymentUrl = "";
    //add to the array
    theDataArray.push(paymentResponse)
}

async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
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
        //get the url paramaters
        const { searchParams } = new URL(request.url);
        //set a data var
        let pData;
        //set an error object
        let _errormessage = "";
        //set a is it paid boolean
        let itsPaid = 0;
        //set a limit
        //note : depericate this
        let limit = 1;
        //get the secret
        let secret = searchParams.get('s');
        //get the payment id
        let paymentid = searchParams.get('i')
        //check if a limit was passed
        let tmp = searchParams.get('l');
        if ((tmp != undefined) && (tmp != "") && (tmp != null))
            limit = tmp;
        //get the kvname
        let kvname = `data-${secret}]${paymentid}`;
        //console.log(kvname)
        const KV = context.env.kvdata;
        //get the settings based on the name
        if ((secret != undefined) && (secret != "") && (secret != null)) {
            //get the data object
            pData = await KV.get(kvname);
            //parse it
            pData = JSON.parse(pData)
            //get the address
            processElementData(pData.elementData);
            //debug
            //console.log(_paymentAddress)
            let url = `https://blockchain.info/q/addressbalance/${_paymentAddress}`
            //console.log(url)
            //fetch the url
            const response = await fetch(url);
            const results = await gatherResponse(response);
            //console.log(results)
            //check if there is BTC there
            if (parseInt(results) > 0) {
                //it is update the boomean
                itsPaid = 1;
                //update the payment data
                let elementData = updateElementData(pData.elementData, "1")
                //update the object
                pData.elementData = elementData
                //debug
                /*
                for (var j = 0; j < pData.elementData.length; ++j) {
                    let tmp = pData.elementData[j]
                    //console.log(tmp)
                }
                */
                //update the payment object
                //note: we may not want to do this and just wait for the payment queue to process it naturally.
                await KV.put(kvname, JSON.stringify(pData))
            }
        }
        //return it
        return new Response(JSON.stringify(pData), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}

