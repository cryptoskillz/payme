    //Set a customers array. You could replace this with a XHR call if you want but we have very few customers so can keep it in an array.
    var customers = [{ id: 1, name: "customer 1" }, { id: 2, name: "customer 2" }]
    //move these to env vars maybe?
    //set the bitcoin address
    //note : we could use a xpub to generate the address. 
    let btcAddress = "bc1q63vhza4jc7096w4skyzf6jtk30ylnf2ssmhpfj";
    //note : we could update address here and generate the QR code would make changing it easier in the future.
    let currentBalance = 0;

    //get the paramaters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //check for an amount
    let amount = urlParams.get('amount');
    if (amount == null)
        amount = 0;
    //set the currency symbol
    let currencySymbol = "£"
    //get the currency type
    let currencyType = urlParams.get('currencytype');
    if (currencyType == null)
        currencyType = "GBP";
    //we could make this dynamic
    if (currencyType == "usd")
        currencySymbol = "$"

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

    //add a listener event as want to know when it is been clicked
    document.getElementById('inputAmountButton').addEventListener('click', function() {
        //get the amount
        let inputAmountEl = document.getElementById('inputAmount').value;
        //check the user is not an idiot
        //note : we should check they added a number
        //note : we could get the invoice id here as well for the webhook
        if (inputAmountEl != "") {
            amount = inputAmountEl;
            showQrCode()
        } else
            alert('come on put in a value!')

    })

    //show the qr payment element
    //note we could generate this from the address
    let showQrCode = () => {
    	//set the invoice amount
        let invoiceAmount = 0;

        //get the current price
        fetch("https://blockchain.info/tobtc?currency=" + currencyType + "&value=" + amount)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                //console.log(json)
                invoiceAmount = json
                //get the 5% discount amoount
                let discount = invoiceAmount * 0.05;
                //apply the discount
                let invoiceAmountWithDiscount = invoiceAmount - discount;
                //get the message
                let message = `Invoice of ${currencySymbol}${amount} with 5% discount please pay ${invoiceAmountWithDiscount} BTC`
                //set the mesage
                document.getElementById('paymentamount').innerHTML = message;
                //show the qr code
                document.getElementById('paymentqrcode').classList.remove('d-none');
                //hide the got payment
                document.getElementById('paymentinput').classList.add('d-none')
            });
    }

    //check balance function, pretty crude but good enough for us today, right now.
    let checkBalance = () => {
        console.log('checking balance')
        fetchBalace(btcAddress, 1)
    }


    //this function gets the current balance
    let fetchBalace = (address, first = 0) => {
        //get the current balance 
        fetch("https://blockchain.info/q/addressbalance/" + btcAddress)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                //check if it was the first call and store the current balance
                if (first == 0) {
                    currentBalance = parseInt(json, 10);
                    console.log("current balance " + currentBalance)
                    //set the exchange
                    exchangRate()
                    //set the timer to check every 2 minutes
                    setInterval(checkBalance, 120000);
                } else {
                    //store the new balance
                    newBalance = parseInt(json, 10)
                    //check if is if it is higer
                    if (currentBalance < newBalance) {
                        //get the amount received
                        let paymentReceived = newBalance - currentBalance;
                        //turn the sats into BTC
                        paymentReceived = paymentReceived / 100000000;
                        //set the messages
                        document.getElementById('gotpayment').innerHTML = `<br><br>We have a payment for the amount of ${paymentReceived} BTC, we assume it was you, if so thankyou<br><br>`
                        //hide the qr code
                        document.getElementById('paymentqrcode').classList.add('d-none');
                        //show the got payment
                        document.getElementById('gotpayment').classList.remove('d-none')

                    }


                }
            });
    }

    //set the amount to pay
    let exchangRate = () => {
        if (amount == 0) {
            //show the input amount div
            document.getElementById('paymentinput').classList.remove('d-none');
            //hide the qr code div
            document.getElementById('paymentqrcode').classList.add('d-none');

        } else {
            //we have an amount so show calcualte ansd show the qr code div 
            showQrCode();
        }
    }

    fetchBalace(btcAddress)