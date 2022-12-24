/**
this worker interacts with the cryptoAPI to get a public key
 */


/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */

 // /market-data/exchange-rates/by-symbols/{fromAssetSymbol}/{toAssetSymbol}

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
    let fromAssetSymbol = searchParams.get('fromAssetSymbol');
    let toAssetSymbol = searchParams.get('toAssetSymbol');
    //debug
    console.log(fromAssetSymbol)
    console.log(toAssetSymbol)
    const url = `https://rest.cryptoapis.io/v2/market-data/exchange-rates/by-symbols/${fromAssetSymbol}/${toAssetSymbol}`;
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