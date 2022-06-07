addEventListener('fetch', event => {
    try {
        console.log(BTCADDRESS);

        //setInterval(function () {"Hello"}, 1000);

        let _backupAddress = BTCADDRESS

        let htmlContent = `<style>
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
}</style>
<img src="https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${_backupAddress}"/>
<h1 class="center">PAY CRYPTOSKILLZ IN BITCOIN</h1>
<h2 class="center">${_backupAddress}</h2>
<div class="center">Click here to <a href="${URL}">check</a> for payment</div>`;
        return event.respondWith(new Response(htmlContent, { headers: { 'content-type': 'text/html;charset=UTF-8', }, }));
    } catch (e) {
        return event.respondWith(new Response('Error thrown ' + e.message));
    }
});