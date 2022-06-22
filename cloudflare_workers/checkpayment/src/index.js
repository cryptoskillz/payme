addEventListener('scheduled', event => {
    event.waitUntil(triggerEvent(event.scheduledTime));
});

let _paymentAddress

let processElementData = (elementData) => {
    for (var k = 0; k < elementData.length; ++k) {
        let tmp = elementData[k]
        //build a check button to see if we been paid or not
        if (tmp.name == "paymentAddress") {
            _paymentAddress = tmp.value;

        }

    }
}

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
//array for the data
let theDataArray = []

let addToDataArray = (bData) => {
    //add to the array
    theDataArray.push(bData)
}


addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});


//have this here just so we can test locally
async function handleRequest(request) {
   try {
        console.log('cron started');
        queueData = await PAYME.get("paymentqueue");
        queueData = JSON.parse(queueData)
        //console.log("queueData")
        if (queueData.length != 0) {
            for (var i = 0; i < 1; ++i) {
                if (queueData[i] != null) {
                    //console.log("queueData kv")
                    console.log("checking "+queueData[i].kv)
                    //do a fetch request
                    let bData = await PAYME.get(queueData[i].kv);
                    //console.log(bData)
                    bData = JSON.parse(bData);
                    //console.log(bData)
                    processElementData(bData.elementData)
                    //console.log(_paymentAddress);
                    let url = `https://blockchain.info/q/addressbalance/${_paymentAddress}`
                    console.log("check URL"+url)
                    const response = await fetch(url);
                    const results = await gatherResponse(response);
                    //console.log("results")
                    console.log("amount found"+results)
                    if (parseInt(results) > 0) {

                        //console.log('in')
                        //console.log(queueData[i].kv)

                        let elementData = updateElementData(bData.elementData, "1")
                        bData.elementData = elementData
                        //debug

                        for (var j = 0; j < bData.elementData.length; ++j) {
                            let tmp = bData.elementData[j]
                            //console.log(tmp)
                        }

                        //todo add the other payment data
                        await PAYME.put(queueData[i].kv, JSON.stringify(bData))
                        console.log('paid')
                        //update the payment ky object
                        queueData.splice(i, 1);;
                        await PAYME.put("paymentqueue", JSON.stringify(queueData));
                    } else {
                        //add it to the payment array
                        console.log('not paid')
                        addToDataArray(bData)
                    }
                } else {
                    console.log('you dirty son of a bitch how did NULL get in here.')
                }
            }

        } else {
            console.log('nothing in the queue')
        }
        console.log('cron finished')
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}



async function triggerEvent(scheduledTime) {
    try {
        console.log('cron started');
        queueData = await PAYME.get("paymentqueue");
        queueData = JSON.parse(queueData)
        //console.log("queueData")
        if (queueData.length != 0) {
            for (var i = 0; i < 1; ++i) {
                if (queueData[i] != null) {
                    //console.log("queueData kv")
                    console.log("checking "+queueData[i].kv)
                    //do a fetch request
                    let bData = await PAYME.get(queueData[i].kv);
                    //console.log(bData)
                    bData = JSON.parse(bData);
                    //console.log(bData)
                    processElementData(bData.elementData)
                    //console.log(_paymentAddress);
                    let url = `https://blockchain.info/q/addressbalance/${_paymentAddress}`
                    console.log("check URL"+url)
                    const response = await fetch(url);
                    const results = await gatherResponse(response);
                    //console.log("results")
                    console.log("amount found"+results)
                    if (parseInt(results) > 0) {

                        //console.log('in')
                        //console.log(queueData[i].kv)

                        let elementData = updateElementData(bData.elementData, "1")
                        bData.elementData = elementData
                        //debug

                        for (var j = 0; j < bData.elementData.length; ++j) {
                            let tmp = bData.elementData[j]
                            //console.log(tmp)
                        }

                        //todo add the other payment data
                        await PAYME.put(queueData[i].kv, JSON.stringify(bData))
                        console.log('paid')
                        //update the payment ky object
                        queueData.splice(i, 1);;
                        await PAYME.put("paymentqueue", JSON.stringify(queueData));
                    } else {
                        //add it to the payment array
                        console.log('not paid')
                        addToDataArray(bData)
                    }
                } else {
                    console.log('you dirty son of a bitch how did NULL get in here.')
                }
            }

        } else {
            console.log('nothing in the queue')
        }
        console.log('cron finished')
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}