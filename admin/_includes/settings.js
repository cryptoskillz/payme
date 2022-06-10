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
    //getprojects
    let projects = getCacheProjects();
    let secretexmp = `${apiUrl}api/export/?projectid=PROJECTID&secret=${user.secret}`;
    if (projects != false)
        secretexmp = `<a target="_blank" href="${apiUrl}api/export/export/?projectid=${projects.data[0].id}&secretid=${user.secret}">${apiUrl}api/export/export/?projectid=${projects.data[0].id}&secretid=${user.secret}</a>`;

    document.getElementById('secretexample').innerHTML = '<br>'+secretexmp
    document.getElementById('showBody').classList.remove('d-none')
    document.getElementById('copySecretIcon').addEventListener('click', function() {
        copySecret(`${user.secret}`)
    });
});