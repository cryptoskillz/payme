/**

This is a xpub as a service clourflare worker.  Currently it calls out to my legacy xpub server which is a 
traditional node js service until our 100% serverless implementation is ready. 

xoub service

https://xpubaas.herokuapp.com/xpub/?xpub=xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V&network=ffff&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=10&randomaddress=0


xpub = xpub key (required)

network = bitcoin / testnet (network) defaults to mainnet

biptype = 44,49,84 (address type) defaults to 84

newaddresscheck = 0 / 1 boolean (loop until we get an address with a 0 balance) defaults to 1

startaddress = start address defaults to 0

numberofaddresses = max number of addresses to check defaults to 1000

randomaddress = 0 / 1 boolean (get a random address between paramter 5 and 6 if paramater 4 is 1 then it will use this as the start for the loop) 

http://localhost:8787/?key=test12345&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=1&randomaddress=0

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
    let biptype = searchParams.get('biptype');
    let newaddresscheck = searchParams.get('newaddresscheck');
    let startaddress = searchParams.get('startaddress');
    let numberofaddresses = searchParams.get('numberofaddresses');
    let randomaddress = searchParams.get('randomaddress');
    //move this a KV so we can  use the secret key to control  it.
    let xpub = "xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V";
    //debug
    console.log(request.url)
    console.log(key)
    console.log(biptype)
    console.log(newaddresscheck)
    console.log(startaddress)
    console.log(numberofaddresses)
    console.log(randomaddress)
    const url = `https://xpubaas.herokuapp.com/xpub/?xpub=${xpub}&network=ffff&biptype=${biptype}&newaddresscheck=${newaddresscheck}&startaddress=${startaddress}&numberofaddresses=${numberofaddresses}&randomaddress=${randomaddress}&key=12345`;
    //console.log(url)
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