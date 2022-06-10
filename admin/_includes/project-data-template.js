/*
    todo : render the unused fields better

*/

let html5layout = `<DOCTYPE! html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Basic html layout example</title>
</head>
<body class="hello">
  <header>
    <h1></h1>
  </header>
  <nav>
  </nav>
  <section>
    <header>Hello, friend this an example of how cool your backpage could look.</header>
    <article>
     [[ELEMENTS]]
    </article>
    <footer>@ whoever</footer>
  </section>
  <aside>
  </aside>
  <footer>
  </footer>
</body>
</html>`


var myCodeMirror;
var delay;
let project;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//add the key to the html template
let setKey = (theKey) => {
    //get the cursor position
    var cursor = myCodeMirror.getCursor();
    //add the formatting it make it work with nunjucks
    let param = `\{\{${theKey}\}\}`;
    //buil a poistion json
    var pos = {
        line: cursor.line,
        ch: cursor.ch
    }
    //add the paramater
    myCodeMirror.replaceRange(param, pos);
}

whenDocumentReady(isReady = () => {
    project = getCurrentProject()

    //let project = window.localStorage.project
    //if (project == undefined)
    //    showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    //else {
    document.getElementById('showBody').classList.remove('d-none')

    let fields = project.schema.fields
    let originalfields = project.schema.originalfields

    //debug 
    let keys = []
    if (fields != "")
        keys = fields.split(",");

    let originalkeys = []
    if (originalfields != "")
        originalkeys = originalfields.split(",")

    let elements2 = "";
    let elements = "";

    /*
    if (keys.length == 0)
    {
        keys.push('var 1')
        keys.push('var 2')
    }
    */


    for (var i = 0; i < keys.length; ++i) {
        //console.log(keys[i])

        if (keys[i] == "UNUSED")

            elements2 = elements2 + `<a href="javascript:setKey('${originalkeys[i]}')">${originalkeys[i]}</a> (not used in template)<br>`
        else {
            elements = elements + `\{\{${keys[i]}\}\}<br>`
            elements2 = elements2 + `<a href="javascript:setKey('${keys[i]}')">${keys[i]}</a><br>`
        }
    }

    //console.log(elements)
    //console.log(elements2)

    if ((project.schema.originalfields == "") || (project.schema.originalfields == null)) {
        showAlert(`No data has been added for this project, no schema generated to add some click <a href="/project/data/import/">here</a>`, 1, 0)
        //document.getElementById("projectkeys").innerHTML = "No data has been added for this project";
    } else {
        document.getElementById("projectkeys").innerHTML = "Variables: <br>" + elements2;
    }

    if ((project.templatename != "") && (project.templatename != null)) {
        let templatename = document.getElementById('inp-template-name');
        templatename.value = project.templatename;
    }
    let theCode = project.template;
    if ((theCode == null) || (theCode == "")) {
        theCode = html5layout
        theCode = theCode.replace("[[ELEMENTS]]", elements);
        document.getElementById("btn-template").innerHTML = "Create"
    } else {
        document.getElementById("btn-template").innerHTML = "Update"
    }

    let textArea = document.getElementById('inp-projectemplate');

    myCodeMirror = CodeMirror.fromTextArea(textArea, {
        mode: 'text/html',
        theme: 'monokai'
    });
    myCodeMirror.setSize(null, 700);

    myCodeMirror.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    });
    myCodeMirror.getDoc().setValue(theCode);
    myCodeMirror.refresh();

    // }







})

function updatePreview() {
    var previewFrame = document.getElementById('preview');
    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(myCodeMirror.getValue());
    preview.close();
}
setTimeout(updatePreview, 300);


document.getElementById('btn-template').addEventListener('click', function() {
    //replace with new functions
    //update  local storage

    let project = getCurrentProject()
    let template = myCodeMirror.getValue()
    let templatename = document.getElementById('inp-template-name');
    let valid = 1;
    let xhrDone = (res) => {
        //console.log(project)
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1)
        project.templatename = templatename.value;
        project.template = template;
        updateCacheProjects(project, 0)
        if (document.getElementById("btn-template").innerHTML == "Create")
            document.getElementById("btn-template").innerHTML = "Update"

    }

    let errorMesage;

    if (templatename.value == "") {
        errorMesage = "Template name cannot be blank"
        valid = 0;
    }

    if (template == "") {
        errorMesage = "Template cannot be blank"
        valid = 0;
    }

    if (valid == 1) {
        valid = 0;

        let bodyobj = {
            template: template,
            templatename: templatename.value,
            id: project.id
        }

        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)
    } else
        showAlert(errorMesage, 2)

});

//process the action drop down
document.getElementById('pageActionSelect').addEventListener('change', function() {
    switch (this.value) {
        case "1":
            let valid= 1
            if ((project.schema.originalfields == "") || (project.schema.originalfields == null)) {
                showAlert(`Unable to view template as no data has been added to add some click <a href="/project/data/import/">here</a>`, 2)
                valid = 0;
            }

            if ((project.template == "") || (project.template == null)) {
                showAlert(`Please save the template to view it`, 2)
                valid = 0;

            }
/*
            if ((project.templatename == "") || (project.templatename == null)) {
                showAlert(`Please add a template name to view it`, 2)
                valid = 0;

            }
*/

            if (valid == 1) {
                window.open(`/project/template/view/`, '_blank');
            }

            break;
        case "2":
            window.location.href = `/project/data/`
            break;

        default:
            // code block
    }
    this.value = 0;

})