

async function handleRequest(request) {

    //get the parameter
    let tmp = request.url.split('=');
    //set the id
    let id = tmp[1]
    //get the details
    let details = await PAYME.get(ENV + id);
    //get the details
    details = JSON.parse(details);
    //debug
    //{address:"1234567890",amountbtc:1,customer:"the customer"}
    let _backupAddress = details.address;
    if ((details.address == "") || (details.address == null)) 
        _backupAddress = BTCADDRESS

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
                <div class="center">amount:${details.amountbtc} customer:${details.customer}</div>
                <div class="center">Click here to <a href="${URL}">check</a> for payment</div>`;

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