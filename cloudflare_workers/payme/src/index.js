
let settingsSchema = '{"btcaddress":"","xpub":"","companyname":""}'
//as this is used in workers and pages we should maybe make it an envvar
const datamain = "data";

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
    let _backupAddress = "";
    let _companyName = "";
    //console.log(tmp[1])
    //console.log(tmp2[1])
  
    

    if (tmp[1] !=undefined) {
        let id= tmp[1].split("&");
        paymentType = "s"
        paymentKVName = `settings${id[0]}`
        //console.log(paymentKVName)
        details = await PAYME.get(paymentKVName);
        details =  JSON.parse(details)
        //console.log(details)
        _backupAddress = details.btcaddress;
        _companyName  = details.companyname;

    }

 if (tmp2[1] !=undefined) {        
        //naming convertion for KV stores <datamain><payloadname>]<payloadid>
        paymentKVName = `${datamain}chris]${tmp2[1]}`
        console.log("paymentKVName")
        console.log(paymentKVName)
        details = await PAYME.get(paymentKVName);
        details =  JSON.parse(details)
        console.log(details)
        _backupAddress = details.paymentAddress;
        _companyName  = details.companyname;
        _customerdetails = `<div class="center">amount:${details.amount} customer:${details.name}</div>`
        _companyName = "US";
    }

    //the html
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
                <img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${_backupAddress}"/>
                <h1 class="center">PAY ${_companyName} IN BITCOIN</h1>
                <h2 class="center">${_backupAddress}</h2>
                ${_customerdetails}
                <div class="center">Click here to <a href="${URL}">check</a> for payment</div>`;
    //return it
    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    });


    /*
    console.log(paymentType)
    //set the id
    let id = tmp[1]
    console.log(tmp[0])

    console.log(tmp[1])
    console.log(ENV + tmp[1])

    //create a detail JSON object
    let details = { address: "", amountbtc: "", customer: "" };
    //store the address
    let _backupAddress = BTCADDRESS;
    //set a customer details
    let customerdetails = "";
            customerdetails = `<div class="center">amount:${details.amountbtc} customer:${details.customer}</div>`

    //check that there is an id passed in.
    if (id != undefined) {
        //get the details from the KV store

        let details = await PAYME.get(ENV + id);
        //parse the details
        details = JSON.parse(details);
        //update the address
        _backupAddress = details.address;
        //update the customer details
        customerdetails = `<div class="center">amount:${details.amountbtc} customer:${details.customer}</div>`
    }
   
    */
}


addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});