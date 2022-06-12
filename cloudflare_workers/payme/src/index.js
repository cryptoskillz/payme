let settingsSchema = '{"btcaddress":"","xpub":"","companyname":""}'

async function handleRequest(request) {

    //get the parameter
    let tmp = request.url.split('=');
    //set the id
    let id = tmp[1]
    //create a detail JSON object
    let details = {address:"",amountbtc:"",customer:""};
    //store the address
    let _backupAddress = BTCADDRESS;
    //set a customer details
    let customerdetails = "";
    //check that there is an id passed in.
    if (id != undefined) {
        //get the details from the KV store
        let details = await PAYME.get(ENV + id);
        //parse the details
        details = JSON.parse(details);
        //update the address
        _backupAddress = details.address;
        //update the customer details
        customerdetails=`<div class="center">amount:${details.amountbtc} customer:${details.customer}</div>`
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
                <h1 class="center">PAY CRYPTOSKILLZ IN BITCOIN</h1>
                <h2 class="center">${_backupAddress}</h2>
                ${customerdetails}
                <div class="center">Click here to <a href="${URL}">check</a> for payment</div>`;
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