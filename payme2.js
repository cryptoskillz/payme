/*
this is a slightly more advanced use case and uses our xpubaas REST API

https://github.com/cryptoskillz/xpubaas


https://xpubaas.herokuapp.com/xpub/?xpub=&network=ffff&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=10&randomaddress=0

https://xpub.cryptoskillz.com/xpub
*/




let getAddress = () => {
    //build the REST call
    let xpub = "xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V";
    let network = "bitcoin"
    let biptype = 84
    let addresscheck = 1
    let startaddress = 0
    let numberofaddresses = 100
    let randomaddress = 0
    let url = "http://127.0.0.1:5001/xpub/"
    //let url  = "https://xpub.cryptoskillz.com/xpub"
    let xpuburl = `${url}?xpub=${xpub}&network=${network}&biptype=${biptype}&addresscheck=${addresscheck}&startaddress=${startaddress}&numberofaddresses=${numberofaddresses}&randomaddress=${randomaddress}`
    fetch(xpuburl)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(json)
        });
}

getAddress()