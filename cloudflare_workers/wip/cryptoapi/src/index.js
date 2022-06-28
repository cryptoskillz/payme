/**
this worker interacts with the cryptoAPI to get a public key
 */


/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
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

async function handleRequest(request) {
    //build a new URL
    const { searchParams } = new URL(request.url);
    //get the data
    let key = searchParams.get('key');
    let btcNetwork = searchParams.get('btcNetwork');
    let startIndex = searchParams.get('startIndex');
    let addressFormat = searchParams.get('addressFormat');
    let isChange = searchParams.get('isChange');
    let change = searchParams.get('change');
    let addressCount = searchParams.get('addressCount');
    //move this a KV so we can  use the secret key to control  it.
    let xpub = "zpub6mdt5gwgL3FjtHAnbFBqj1Kip7vxwUu2TpWyt49uVHHn7MukkxkF1ut7k1PYzTNKR6eqePCnSFULySUVVdkVcKsqaL5MHTdn7a3rYdSEc2K";


    //add this
    let eText = "";
    //let addressFormat = "p2sh"
    //let isChange = "1";
    //debug
    console.log(xpub)
    console.log(request.url)
    console.log(btcNetwork)
    console.log(startIndex)
    console.log(change)
    console.log(addressCount)


    //https://rest.cryptoapis.io/v2/blockchain-tools/bitcoin/testnet/hd/upub5Ei6bRNneqozk6smK7dvtXHC5PjUyEL4ynCfMKvjznLcXi9DQaikETzQjHvJC43XexMvQs64jxB1njM
    //jCHpRZ4xQWAmv3ge9cVtjfsHmbvQ/addresses/derive-address?context=yourExampleString&addressFormat=p2sh&addressesCount=2&isChange=1&startIndex=3
    const url = `https://rest.cryptoapis.io/v2/blockchain-tools/bitcoin/${btcNetwork}/hd/${xpub}/addresses/derive-address?context=${eText}
&addressFormat=${addressFormat}&addressesCount=${addressCount}&isChange=${isChange}&startIndex=${startIndex}`;
    console.log(url)

    //let tmp = request.url.split('/');
    //console.log(tmp)
    const init = {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'X-Api-Key': APIKEY
        },
    };
    
    const response = await fetch(url, init);
    const results = await gatherResponse(response);
    return new Response(results, init);
    
}

addEventListener('fetch', event => {
    event.passThroughOnException()

    return event.respondWith(handleRequest(event.request));
});