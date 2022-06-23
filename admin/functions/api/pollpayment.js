/*
todo: debug all this we moved this from payment.js as we only required that to
      process a single paymnet.
*/

let processElementData = (elementData,theElement="") => {

    for (var k = 0; k < elementData.length; ++k) {
        let tmp = elementData[k]
        //build a check button to see if we been paid or not
        if (tmp.name == theElement) {
            return(tmp.value)
        }
    }
    return("")
}



let getPaymentStatus = (elementData) => {

    for (var k = 0; k < elementData.length; ++k) {
        let tmp = elementData[k]
        //build a check button to see if we been paid or not
        if (tmp.name == "paid") {
            if (tmp.value == "1")
                return(1)
            else
                return(0)

        }
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
    try {
        let paidArray=[]
        //set a payload var
        let payLoad;
        //set up the kv store
        const KV = context.env.kvdata;
        //get the content type
        const contentType = request.headers.get('content-type')
        //check it is something
        if (contentType != null) {
            //get the payload
            payLoad = await request.json();
            //console.log(payLoad)
        }
        //loop through the payment data
        for (var i = 0; i < payLoad.paymentData.length; ++i) {
            //get the payment data
            let tmp = payLoad.paymentData[i]
            console.log(tmp)
            //get the data store
            let pData = await KV.get(tmp);
            //parse it
            pData = JSON.parse(pData);
            //console.log(pData);
            //check if its paid
            let isPaid = getPaymentStatus(pData.elementData);
            let paymentId = tmp.split(']');
            paymentId = paymentId[1];
            console.log(paymentId) 
            //note: We could easily check for payment here but I think its better to leave to the the check payment worker for 
            //        simplification stakes
            //console.log(isPaid)
            //add  it  to  the paid array
            let btcAddress =  processElementData(pData.elementData,"paymentAddress")
            console.log(btcAddress)
            paidArray.push({"paid":isPaid,"paymentId":paymentId,"btcAddress":btcAddress})
        }
        //console.log(paidArray)
        //return it
        return new Response(JSON.stringify(paidArray), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
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
        theDataArray = []
        //set a valid flag
        let valid = 1;
        //set an error message
        let _errormessage = "";
        //get the paramates
        const { searchParams } = new URL(request.url)
        //set a limit
        let limit = 1;
        //get the secret
        let secret = searchParams.get('s');
        //get the payment id
        let paymentid = searchParams.get('i')
        //check if a limit was passed
        let tmp = searchParams.get('l');
        if ((tmp != undefined) && (tmp != "") && (tmp != null))
            limit = tmp;
        //debug
        //console.log(secret);
        //console.log(paymentid);
        //console.log(limit)
        //set up the KV
        const KV = context.env.kvdata;
        //get the settings based on the name
        if ((secret != undefined) && (secret != "") && (secret != null)) {
            let queueData = await KV.get("paymentqueue");
            //console.log(queueData)
            //check  we have a payment queue
            if ((queueData != undefined) && (queueData != "") && (queueData != null)) {
                //parse the queue
                queueData = JSON.parse(queueData);
                ///console.log(queueData)
                let counter = 1;
                let addedIt = 0;
                //loop  it
                for (var i = 0; i < queueData.length; ++i) {
                    //check for an id 
                    if ((paymentid != undefined) && (paymentid != "") && (paymentid != null)) {
                        if (addedIt == 0) {
                            //check if the id matches and checks
                            //get the object
                            console.log(datamain + "-" + secret + "]" + paymentid)
                            let pData = await KV.get(datamain + "-" + secret + "]" + paymentid);

                            pData = JSON.parse(pData)
                            console.log(pData)
                            addedIt = 1;
                            //get the balance
                            //bc1qxphczudn8retcx0umz3pf2xuwpaxwmeslwugvm
                            //console.log(pData.elementData[0])
                            //console.log(pData.elementData[0].value)

                            let url = `https://blockchain.info/q/addressbalance/${pData.elementData[0].value}`
                            console.log(url)
                            const response = await fetch(url);
                            const results = await gatherResponse(response);
                            console.log(results)
                            if (parseInt(results) > 0) {
                                //todo add the other payment data
                                pData.elementData[3].value = 1
                                //addToDataArray(JSON.stringify(pData))   
                                //update the payment ky object
                            }
                            addToDataArray(JSON.stringify(pData))
                            await KV.put(datamain + "-" + secret + "]" + paymentid, JSON.stringify(pData));
                        }
                    } else {
                        if (limit >= counter) {
                            console.log(counter)
                            //get the object
                            let pData = await KV.get(queueData[i].kv);
                            addToDataArray(pData)
                            counter++;
                        }
                    }
                }
            } else {
                valid = 0;
                _errormessage = 'id not found'
            }
        } else {
            valid = 0;
            _errormessage = 'id not set'
        }
        if (valid == 1) {
            //console.log(theDataArray)
            return new Response(JSON.stringify(theDataArray), { status: 200 });
        } else
            return new Response(JSON.stringify({ error: _errormessage }), { status: 400 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}