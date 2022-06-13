addEventListener('scheduled', event => {
    event.waitUntil(triggerEvent(event.scheduledTime));
});

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

let  addToDataArray = (bData) => {
    //add to the array
    theDataArray.push(bData)
}


async function triggerEvent(scheduledTime) {
    try {
        console.log('cron started');
        queueData = await PAYME.get("paymentqueue");
        queueData = JSON.parse(queueData)
        if (queueData.length != 0) {
            for (var i = 0; i < 1; ++i) {
                //console.log(queueData[i].kv)
                //do a fetch request
                let bData = await PAYME.get(queueData[i].kv);
                bData = JSON.parse(bData);
                //console.log(bData);
                let url = `https://blockchain.info/q/addressbalance/${bData.paymentAddress}`
                // console.log(url)
                const response = await fetch(url);
                const results = await gatherResponse(response);
                //console.log(results)
                if (parseInt(results) > 0) {
                    //todo add the other payment data
                    bData.paid = 1
                    console.log(bData);
                    await PAYME.put(queueData[i].kv,JSON.stringify(bData))   
                    console.log('paid')
                    //update the payment ky object
                    //delete queueData[i];
                    //await PAYME.put("paymentqueue",JSON.stringify(queueData));
                }
                else
                {
                  //add it to the payment array
                  addToDataArray(bData)
                }
            }
            //save the paymet queue
            console.log('final data array')
            console.log(theDataArray)
            await PAYME.put("paymentqueue",JSON.stringify(theDataArray));
        } else {
            console.log('nothing in the queue')
        }
        console.log('cron finished')
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}