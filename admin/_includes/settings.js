//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let copySecret = (text) => {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        showAlert('Secret copied to clipboard', 1)
    }
    document.getElementById('secret').innerHTML = `${user.secret} <i class="fas fa-copy" id="copySecretIcon"></i>`;
    //set an example  of how to use the secret, remove this if you are not going to have an API for your customers.
    let secretexmp = `${apiUrl}api/export/?projectid=PROJECTID&secret=${user.secret}`;
    document.getElementById('secretexample').innerHTML = '<br>'+secretexmp
    document.getElementById('showBody').classList.remove('d-none')
    document.getElementById('copySecretIcon').addEventListener('click', function() {
    copySecret(`${user.secret}`)
    });
});