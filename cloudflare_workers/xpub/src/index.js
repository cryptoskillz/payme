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

import { addressFromExtPubKey } from '@swan-bitcoin/xpub-lib';


async function handleRequest(request) {
    let theResponse = {}
    const { searchParams } = new URL(request.url);
    const xpub = searchParams.get('xpub');
    const network = searchParams.get('network');
    /*
     const key = searchParams.get('key');
    const biptype = searchParams.get('biptype');
    const newaddresscheck = searchParams.get('newaddresscheck');
    const startaddress = searchParams.get('startaddress');
    const numberofaddresses = searchParams.get('numberofaddresses');
    const randomaddress = searchParams.get('randomaddress');
    */
    //const xpub = "xpub67yMUMbr2gAnBgnYvXcbJq8iUBe54Ev2dbUYKGN8jGY21AHJFeR7mnZqhbUNze4UbpRE9S1fWvmFCsFN4EvU1rWdqegW7dzoa7vZmYCLAAy"
    //const network = "mainnet";
    const address = addressFromExtPubKey({ extPubKey: xpub, network: network });
    console.log(address);
    theResponse.address = address.address
    theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
    theResponse.path = address.path;
    theResponse.network = network

    return new Response(JSON.stringify(theResponse));

}

addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});
