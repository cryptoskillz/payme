/*
Playing with HDkey /   crypto and an alternatate secp256k1 implementation



var crypto = require('crypto')

*/
//var HDKey = require('hdkey')
import * as secp from "@noble/secp256k1";


async function handleRequest(request) {


/*
var key = 'xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt'
var hdkey = HDKey.fromExtendedKey(key)
console.log(hdkey)
*/
}

addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});