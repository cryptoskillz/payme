let settingsSchema = '{"btcaddress":"","xpub":"","companyname":""}'
let _backupAddress = BTCADDRESS
let _companyName = COMPANYNAME;
let _customerName = "";
let _amount = 0;


//as this is used in workers and pages we should maybe make it an envvar
const datamain = "data";

let processElementData = (elementData) => {
    for (var i = 0; i < elementData.length; ++i) {
        let tmp = elementData[i]
        //console.log(tmp)
        //build a check button to see if we been paid or not
        if ((tmp.name == "btcaddress") || (tmp.name == "paymentAddress")) {
            _backupAddress = tmp.value;

        }
        if (tmp.name == "compnanyname") {
            _companyName = tmp.value;

        }
        if (tmp.name == "name") {
            _customerName = tmp.value;

        }
        if (elementData[i].name == "amount") {
            _amount = tmp.value;

        }
    }
}

async function handleRequest(request) {

    //build a new URL
    /*
    for some reason we  are getting ✘ [ERROR] Uncaught (in response) TypeError: URL is not a constructor
    have to figure out why but we will do it old school for now
    console.log(request.url)
    const { searchParams } = new URL(request.url);
    //get the data
    let s = searchParams.get('s');
    let i = searchParams.get('i');
    console.log(i)
    console.log(s)
    */


    //get the parameter
    let paymentType = "";
    let paymentKVName = "";
    let tmp = request.url.split('s=');
    let tmp2 = request.url.split('i=');

    let details = "";
    let _customerdetails = "";
    let _errormessage = ""
    let valid = 1;
    let secret = "";
    console.log(tmp[1] )
    if ((tmp[1] != undefined) && (tmp[1] != null)) {

        let stmp = tmp[1].split("&");
        secret = stmp[0];
        paymentType = "s"
        paymentKVName = `settings${secret}`
        details = await PAYME.get(paymentKVName);
        if (details != null) {
            details = JSON.parse(details)
            processElementData(details.settings.elementData)

        } else {
            _errormessage = "company id not found";
            valid = 0;
        }

    } 
    else {
        _errormessage = `Please note you did not add a company ID so it has defaulted to ${COMPANYNAME} if you do not want to pay us please do not send any Bitcoin`;
        //valid = 0;
    }

    

    if ((tmp2[1] != undefined) && (tmp2[1] != null) && (valid == 1)) {
        //naming convertion for KV stores <datamain><payloadname>]<payloadid>
        //datamain  +"-"+user.user.secret + "]"+payLoad.id
        paymentKVName = `${datamain}-${secret}]${tmp2[1]}`
        details = await PAYME.get(paymentKVName);
        if (details != null) {
            details = JSON.parse(details);
            processElementData(details.elementData)
            _customerdetails = `<div class="center">amount:${_amount} customer:${_customerName}</div>`
        } else {
            _errormessage = `Invoice id ${tmp2[1]} not found, showing generic payment address`
        }
    }

    let html = `<style>
                .center {
                  text-align: center;
                }
                .h2 {
                  padding:0px
                }
                img {
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 30%;
                }
                </style>
                <h1 class="center">${_errormessage}</h1>`

    //the html
    if (valid == 1) {
        html = `<style>
                .center {
                  text-align: center;
                }
                .h2 {
                  padding:0px
                }
                img {
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 30%;
                }
                </style>
                <img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${_backupAddress}"/>
                <h1 class="center">PAY ${_companyName} IN BITCOIN</h1>
                <h2 class="center">${_backupAddress}</h2>
                ${_customerdetails}
                <div class="center">Click here to <a href="https://mempool.space/address/${_backupAddress}" target="_blank">check</a> for payment</div>
                <div class="center">${_errormessage}</div>`;
    }
    //return it
    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    });

}


addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});