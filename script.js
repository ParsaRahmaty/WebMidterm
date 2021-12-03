var lastEnteredName;

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

function checkInputBox() {
    setInputFilter(document.getElementById("name"), function (value) {
        return /^[a-zA-Z\s]*$/i.test(value);
    });
}

function submit() {
    var name = document.getElementById('name').value;
    lastEnteredName = name;
    saveGender()
    let data = fetchAPI(name)
    data.then(response => response.json()).then(data => {
            if (data.gender !== null) {
                document.getElementById("gender").innerHTML = capitalizeFirstLetter(data.gender);
                document.getElementById("probability").innerHTML = data.probability;
            }
        })
        .catch(console.error);
    if (getSavedResult(name)) {
        document.getElementById("savedGender").innerHTML = getSavedResult(name);
    }
    else {
        document.getElementById("savedGender").innerHTML = "";
    }
}

function clearButton() {
    if (getSavedResult(lastEnteredName)) {
        localStorage.removeItem(lastEnteredName)
    }
    document.getElementById("savedGender").innerHTML = "";
}

function fetchAPI(name) {
    return fetch("https://api.genderize.io/?name=" + name)
}

function saveGender() {
    var name = document.getElementById('name').value;
    if (!name) {
        return
    }

    if (!document.querySelector('input[name="gender"]:checked')) {
        return
    }
    var gender = document.querySelector('input[name="gender"]:checked').value;

    if (getSavedResult(name)) {
        localStorage.removeItem(name);
    }
    localStorage.setItem(name, gender);
}

function getSavedResult(name) {
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) !== name) {
            return localStorage[name]
        } else {
            break
        }
    }
}

function addListener() {
    document.getElementById('inputForm').addEventListener('submit', function (e) {
        e.preventDefault();
        submit()
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
