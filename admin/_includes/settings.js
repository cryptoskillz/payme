//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    document.getElementById('btn-edit').addEventListener('click', function() { //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            //get the user
            let user = getUser(1);
            //set the  settings
            //note : if we have to update username / email then we will have to expand this
            user.settings = res.settings;
            //tore the user
            storeUser(user, "", 1)
            //note we are not using a server message as it is coming from the user endpoint and we are in settings, you don't like come at me!
            showAlert("settings updated", 1);
        }
        //get the form data
        let bodyJson = getFormData(settingsSchema);
        //string  it
        bodyJson = JSON.stringify(bodyJson);
        //call it
        xhrcall(4, `api/user/`, bodyJson, "json", "", xhrDone, token);
    })
    //get the user
    let theUser = getUser(1, 0);
    //get the values
    let theValues = Object.values(theUser.settings.elementData)
    //get the keys
    let keys = Object.keys(settingsSchema);
    //set a html  input
    let inpHtml = "";
    //loop the  keys
    for (var i = 0; i < keys.length; ++i) {
        //hold the value
        let theValue = ""
        //check we have a value (if it is the first time them it will be blank)
        if (theValues[i] != undefined)
            theValue = theValues[i].value
        //create the element
        inpHtml = inpHtml + `<div class="form-group" >
                                <label>${keys[i]}</label>
                                <input type="text" class="form-control form-control-user" id="inp-${keys[i]}" aria-describedby="emailHelp" placeholder="Enter ${keys[i]}" value="${theValue}">
                              
                                <span class="text-danger d-none" id="error-${keys[i]}">${keys[i]} cannot be blank</span>  
                            </div>`
    }
    //render it
    document.getElementById('formInputs').innerHTML = inpHtml;
});