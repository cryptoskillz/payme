//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    document.getElementById('btn-edit').addEventListener('click', function() { //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            //store the settings
            storeSettings(res.data)
            //show the message
            showAlert(res.message, 1)
        }
        let bodyJson =  getFormData(settingsSchema);
        console.log(bodyJson)
        /*
        //check there is data to submit
        let bodyJson = {
            btcaddress: document.getElementById('inp-btcaddress').value,
            xpub: document.getElementById('inp-xpub').value,
            companyname: document.getElementById('inp-companyname').value
        }
        */
        bodyJson = JSON.stringify(bodyJson);
        //call it
        xhrcall(4, `api/settings/`, bodyJson, "json", "", xhrDone, token);
    })

    //note: we could move this to app as its used in dashboard as well
    let settingsDone = (res) => {
        //if (update == 1)
        storeSettings(res)
        res = JSON.parse(res)
        console.log(res.btcaddress)
        document.getElementById('inp-btcaddress').value = res.btcaddress
        document.getElementById('inp-xpub').value = res.xpub
        document.getElementById('inp-companyname').value = res.companyname
    }

    let theUser = getUser(1, 0);
    let theValues = Object.values(theUser.settings)
    //let theSettings = theUser.settings;
    //console.log(theSettings[0])
    let keys = Object.keys(settingsSchema);
    let inpHtml = "";
    for (var i = 0; i < keys.length; ++i) {
        console.log(keys[i])
        inpHtml = inpHtml + `<div class="form-group" >
                                <label>${keys[i]}</label>
                                <input type="text" class="form-control form-control-user" id="inp-${keys[i]}" aria-describedby="emailHelp" placeholder="Enter ${keys[i]}" value="${theValues[i]}">
                              
                                <span class="text-danger d-none" id="error-${keys[i]}">${keys[i]} cannot be blank</span>  
                            </div>`
    }
    document.getElementById('formInputs').innerHTML = inpHtml;
});