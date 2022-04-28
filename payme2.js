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

TODO

set time out / error trap qrcode 


*/

//this lets us use the xpuaas service to fetch a Bitcoin address if you want to just just use the backup address then set this to 0 
let useXpubaas = 1;
//hold the backup address
//note:  this is very exploitable if someone hijacks and chnages the address to one of their own, use this at your own risk.
let _backupAddress = "bc1q63vhza4jc7096w4skyzf6jtk30ylnf2ssmhpfj"
//Set a customers array. You could replace this with a XHR call if you want but we have very few customers so can keep it in an array.
var customers = [{ id: 1, name: "customer 1" }, { id: 2, name: "customer 2" }]

//get the paramaters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let buildPaymentPage = (theAddress) => {
    //show the qrcode image
    document.getElementById('qrcodeimg').innerHTML = `<img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theAddress}"/>`
    //show the btc address
    document.getElementById('btcaddress').innerHTML = `<a href="bitcoin:${theAddress}">${theAddress}</a>`
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
    //local url
    let url = "http://127.0.0.1:5001/xpub/"
    //demo url
    //let url  = "https://xpub.cryptoskillz.com/xpub"
    let xpuburl = `${url}?xpub=${xpub}&network=${network}&biptype=${biptype}&addresscheck=${addresscheck}&startaddress=${startaddress}&numberofaddresses=${numberofaddresses}&randomaddress=${randomaddress}`
    return await fetch(xpuburl)
        .then(function(response) {
            return (response.json());
        })
        .then(function(json) {
            return (json);
        })
        .catch((error) => {
            console.log(error)
        });
}

const addressFetch = async () => {
    //set the address to the backup address
    let _theAddress = _backupAddress
    //check if we are getting and address from the server
    if (useXpubaas == 1)
    {
        //show spinner
        document.getElementById('spinner').classList.remove('d-none')
        let _address = await getAddress()
        //check that we got an address from xpubaas
        if (_address.address != undefined)
            _theAddress = _address.address;
    }

    //build the payment page
    buildPaymentPage(_theAddress)
}

//address check boolean
let getAddressCheck = 1;
//check for an amount
let amount = urlParams.get('amount');
//check if it is blank
if (amount == null)
{
    getAddressCheck = 0;
    //check the customer id
    let customerId = urlParams.get('id');
    if (customerId == null)
        customerId = 0

    //check if the customer is in the array
    if (customerId != 0) {
        for (var i = 0; i < customers.length; i++) {
            if (customerId == customers[i].id) {
                console.log(customers[i])
                document.getElementById('exampleFormControlInput1').innerHTML = `${customers[i].name} please enter invoice amount`
                //alert('found it')
            }
        }

    }

    //show the input amount div
    document.getElementById('paymentinput').classList.remove('d-none');
    amount = 0;
}

//set the currency symbol
let currencySymbol = "£"
//get the currency type
let currencyType = urlParams.get('currencytype');
if (currencyType == null)
    currencyType = "GBP";
//we could make this dynamic
if (currencyType == "usd")
    currencySymbol = "$"

//there was an amount  passed in so we can fetch an address
if (getAddressCheck == 1)
    addressFetch();


/*

start of click events

*/

//add a listener event as want to know when it is been clicked
document.getElementById('inputAmountButton').addEventListener('click', function() {
    //get the amount
    let inputAmountEl = document.getElementById('inputAmount').value;
    //check the user is not an idiot
    //note : we should check they added a number
    //note : we could get the invoice id here as well for the webhook
    if (inputAmountEl != "") {
        //hide the spinner
        document.getElementById('paymentinput').classList.add('d-none');
        amount = inputAmountEl;
        addressFetch();
    } else
        alert('come on put in a value!')

})


/*

end of click events

*/