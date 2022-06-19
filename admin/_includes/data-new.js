/*

to do 

do not allow duplicate names

*/

//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {
    //build the elements
    document.getElementById('formInputs').innerHTML = buildForm();
    //show the form
    document.getElementById('showBody').classList.remove('d-none')
    //create button click
    document.getElementById('btn-create').addEventListener('click', function() {
        //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            addDataItem(res.data, 0);
            showAlert(res.message, 1, 0);
            //clear the form
            clearForm(res.data)
        }
        //get the form data
        let bodyJson = getFormData()
        let user = getUser()
        bodyJson.secret = user.secret;
        //check there is data to submit
        if (bodyJson != false) {
            //call it
            xhrcall(0, `api/${dataMainMethod}/`, bodyJson, "json", "", xhrDone, token)
        }
    })
})