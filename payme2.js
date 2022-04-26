/*
this is a slightly more advanced use case and uses our xpubaas REST API


CODE

https://github.com/cryptoskillz/xpubaas

URLS

https://xpub.cryptoskillz.com/xpub
http://127.0.0.1:5001/xpub/

https://jlopp.github.io/xpub-converter/
zpub6mdt5gwgL3FjtHAnbFBqj1Kip7vxwUu2TpWyt49uVHHn7MukkxkF1ut7k1PYzTNKR6eqePCnSFULySUVVdkVcKsqaL5MHTdn7a3rYdSEc2K
xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V


*/

let buildPaymentPage =  (theAddress) => {
	//debug
	//console.log(theAddress)

	//show the qrcode image
	document.getElementById('qrcodeimg').innerHTML = `<img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theAddress}"/>`
	//show the btc address
	document.getElementById('btcaddress').innerHTML  = `<a href="bitcoin:${theAddress}">${theAddress}</a>`
	//show the got payment
    document.getElementById('paymentqrcode').classList.remove('d-none');
    //hide the spinner
    document.getElementById('spinner').classList.add('d-none')
}


const getAddress = async () => {
    //build the REST call

    //xpub
    let xpub = "xpub67yMUMbr2gAnBgnYvXcbJq8iUBe54Ev2dbUYKGN8jGY21AHJFeR7mnZqhbUNze4UbpRE9S1fWvmFCsFN4EvU1rWdqegW7dzoa7vZmYCLAAy";
    //network to use mainnet / testnet
    let network = "bitcoin"
    //address type 44 / 49 /84
    let biptype = 84
    //boolean to find an address with no unspent transactions
    let addresscheck = 1
    //address to start at
    let startaddress = 0
    //number of address to loop through
    let numberofaddresses = 100
    //get a random address (overrides startaddress and uses this as the start of the loop if addresscheck is 1)
    let randomaddress = 0
    //local urk
    let url = "http://127.0.0.1:5001/xpub/"
    //demo url
    //let url  = "https://xpub.cryptoskillz.com/xpub"
    let xpuburl = `${url}?xpub=${xpub}&network=${network}&biptype=${biptype}&addresscheck=${addresscheck}&startaddress=${startaddress}&numberofaddresses=${numberofaddresses}&randomaddress=${randomaddress}`
    return await fetch(xpuburl)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            //console.log(json)
            return(json);
        });
}

const start = async () => {
   const _address = await getAddress()
   //build  QR
   buildPaymentPage(_address.address)
}

start()