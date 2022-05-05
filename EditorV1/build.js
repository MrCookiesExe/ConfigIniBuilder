function SetWidth() {
    var b = document.getElementsByTagName("body")[0]
    for (e of document.getElementsByClassName("tooltip")) {
        e.style.width = Math.floor((b.scrollWidth - 46) * .8) + "px"
    }
    saveConf(false)
}

function generateId() {
    return Math.random().toString(36).substr(2);
}

config = {}

function addRow(table) {
    var output = document.getElementById(table)
    var key = document.getElementById(table + "K")
    if (!config[table.replace("-", "")]) {
        config[table.replace("-", "")] = {}
    }
    if (key.value == "" || typeof key == typeof undefined)
        return;
    var left = document.getElementById(table + "L")
    var right = document.getElementById(table + "R")
    if (typeof left == typeof undefined || typeof right == typeof undefined || left.value == "" || right.value == "")
        return;
    var ident = generateId()
    output.innerHTML += `<div style="display: table-row;" id="${table}${ident}">
    <div style="display: table-cell; width: 30%;"><b>${key.value}</b></div>
    <div style="display: table-cell; width: 30%;">${left.value}</div>
    <div style="display: table-cell; width: 30%;">${right.value}</div>
    <div style="display: table-cell; width: 10%;">
        <b style="cursor: pointer;" onclick="RemoveFromTable('${table}${ident}')">&times;</b>
    </div></div>`
    config[table.replace("-", "")][key.value] = [`${left.value},${right.value}`, `${table}${ident}`]
    key.value = ""
}

function addRowSmart(table) {
    var output = document.getElementById(table)
    var key = document.getElementById(table + "K")
    if (key.value == "" || typeof key == typeof undefined)
        return;

    if (!config[table.replace("-", "")]) {
        config[table.replace("-", "")] = {}
    }
    var d = document.getElementById(table + "D")
    var c = document.getElementById(table + "C")
    if (typeof d == typeof undefined || typeof c == typeof undefined || d.value == "" || c.value == "")
        return;
    var ident = generateId()
    output.innerHTML += `<div style="display: table-row;" id="${table}${ident}">
    <div style="display: table-cell; width: 30%;"><b>${key.value}</b></div>
    <div style="display: table-cell; width: 30%;">${d.value}</div>
    <div style="display: table-cell; width: 30%;">${c.value.replace(",", "<br>").replace("\n", "<br>")}</div>
    <div style="display: table-cell; width: 10%;">
        <b style="cursor: pointer;" onclick="RemoveFromTable('${table}${ident}')">&times;</b>
    </div></div>`
    config[table.replace("-", "")][key.value] = [`${d.value},${c.value.replace("\n", ",")}`, `${table}${ident}`]
    key.value = ""
    d.value = ""
    c.value = ""
}

function addRowTime(table) {
    var output = document.getElementById(table)
    var key = document.getElementById(table + "K")
    if (key.value == "" || typeof key == typeof undefined)
        return;

    if (!config[table.replace("-", "")]) {
        config[table.replace("-", "")] = {}
    }

    var t = document.getElementById(table + "T")
    if (typeof t == typeof undefined || t.value == "")
        return;
    var ident = generateId()
    var at = "", l = ""
    var x = { A: "All", S: "Start", M: "Middle", F: "Final" }
    for (el in x) {
        var temp = document.getElementById(table + el)
        if (temp.checked) {
            at += `${x[el]}<br>`
            l += el
        }
        temp.checked = false
    }
    output.innerHTML += `<div style="display: table-row;" id="${table}${ident}">
    <div style="display: table-cell; width: 20%;">${key.value}</div>
    <div style="display: table-cell; width: 20%;">${document.getElementById(table + "Mv").value}</div>
    <div style="display: table-cell; width: 20%;">${t.value}</div>
    <div style="display: table-cell; width: 20%;">${at}</div>
    <div style="display: table-cell; width: 20%;">
        <b style="cursor: pointer;" onclick="RemoveFromTable('${table}${ident}')">&times;</b>
    </div></div>`

    config[table.replace("-", "")][key.value] = [`${document.getElementById(table + "Mv").value},${t.value},${l}`, `${table}${ident}`]

    key.value = ""
    t.value = ""
}

function getValuesMulti(base) {
    var v = []
    var s = document.getElementById(base + "-S")
    var m = document.getElementById(base + "-M")
    var f = document.getElementById(base + "-F")
    if (typeof s != "undefined") {
        v.push(s.value)
    } else {
        v.push("")
    }
    if (typeof m != "undefined") {
        v.push(m.value)
    } else {
        v.push("")
    }
    if (typeof f != "undefined") {
        v.push(f.value)
    } else {
        v.push("")
    }
    return v
}

function addRowMult(table) {
    var output = document.getElementById(table)
    var key = document.getElementById(table + "K")
    if (key.value == "" || typeof key == typeof undefined)
        return;

    if (!config[table.replace("-", "")]) {
        config[table.replace("-", "")] = {}
    }

    var left = document.getElementById(table + "L-S")
    if (typeof left == typeof undefined || left.value == "")
        return;
    var ident = generateId()
    var count = 0
    var l = getValuesMulti(table + "L").map(elem => {
        switch (count++) {
            case 0: return "Start: " + elem
            case 1: return "Middle: " + elem
            case 2: return "Final: " + elem
        }
    })
    count = 0
    var r = getValuesMulti(table + "R").map(elem => {
        switch (count++) {
            case 0: return "Start: " + elem
            case 1: return "Middle: " + elem
            case 2: return "Final: " + elem
        }
    })

    output.innerHTML += `<div style="display: table-row;" id="${table}${ident}">
    <div style="display: table-cell; width: 30%;"><b>${key.value}</b></div>
    <div style="display: table-cell; width: 30%;">${l.join("<br>")}</div>
    <div style="display: table-cell; width: 30%;">${r.join("<br>")}</div>
    <div style="display: table-cell; width: 10%;">
        <b style="cursor: pointer;" onclick="RemoveFromTable('${table}${ident}')">&times;</b>
    </div></div>`

    let temp = []

    for (let i = 0; i < 3; i++) {
        if (i < l.length)
            temp.push(l[i].replace(/(Start|Middle|Final): /, ""))
        if (i < r.length)
            temp.push(r[i].replace(/(Start|Middle|Final): /, ""))
    }

    let va = []

    for (let i = 5; i >= 0; i -= 2) {
        if (temp[i] != "" || temp[i - 1] != "") {
            va.push(temp[i])
            va.push(temp[i - 1])
        }
    }

    va.reverse()

    if (va.length == 2 && va[1] == "") {
        va.pop()
    }

    config[table.replace("-", "")][key.value] = [`${va.join()}`, `${table}${ident}`]

    key.value = ""
}

function addRowTwo(table) {
    var output = document.getElementById(table)
    var key = document.getElementById(table + "K")
    if (key.value == "" || typeof key == typeof undefined)
        return;

    if (!config[table.replace("-", "")]) {
        config[table.replace("-", "")] = {}
    }

    var value = document.getElementById(table + "V")
    if (typeof value == typeof undefined || value.value == "")
        return;
    var ident = generateId()
    output.innerHTML += `<div style="display: table-row;" id="${table}${ident}">
    <div style="display: table-cell; width: 30%;"><b>${key.value}</b></div>
    <div style="display: table-cell; width: 30%;">${value.value}</div>
    <div style="display: table-cell; width: 10%;">
        <b style="cursor: pointer;" onclick="RemoveFromTable('${table}${ident}')">&times;</b>
    </div></div>`

    config[table.replace("-", "")][key.value] = [`${value.value}`, `${table}${ident}`]

    key.value = ""
}

function RemoveFromTable(id) {
    var el = document.getElementById(id)
    el.parentNode.removeChild(el)

    let temp = {}
    for (let sec in config) {
        if (typeof config[sec] != "object") {
            temp[sec] = config[sec]
            continue;
        }
        temp[sec] = {}
        for (let key in config[sec]) {
            if (typeof config[sec][key] != "object") {
                temp[sec][key] = config[sec][key]
                continue;
            }
            if (config[sec][key][1] != id) {
                temp[sec][key] = config[sec][key]
                continue;
            }
        }
    }

    config = temp
}

function ChangeToIds(sec) {
    switch (sec) {
        case "Settings": return "settings";
        case "ConsonantsAuto": return "Smart";
        case "ConsonantsTime": return "Time";
        case "Smart": return "ConsonantsAuto";
        case "Time": return "ConsonantsTime";
        default: return sec;
    }
}
function ChangeToValues(value) {
    switch (value) {
        case "local": case "Local": return "L"
        case "global": case "Global": return "G"
        case "plugin": case "Plugin": return "P"
        case "resources": case "Resources": return "R"
        case "L": return "local"
        case "G": return "global"
        case "P": return "plugin"
        case "R": return "resources"
        default: return value;
    }
}


document.getElementById('file').onchange = function a() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        let ini = {}
        let lines = this.result.split(/\r?\n/)
        let sec = ""
        lines.forEach(line => {
            if (line.startsWith(";") || line.startsWith("#")) return
            if (line.startsWith("[")) {
                line = line.slice(1, -1)
                ini[line] = {}
                sec = line
            } else {
                let data = line.split("=")
                ini[sec][data.shift()] = data.join("=")
            }
        });

        for (sec in ini) {
            for (let key in ini[sec]) {
                if (key == "") continue;
                let c;
                switch (ChangeToIds(sec)) {
                    case "settings":
                        switch (key) {
                            case "regex":
                                document.getElementById(`${ChangeToIds(sec)}/${key}`).value = ini[sec][key].split(",").join("\n")
                                break;
                            default:
                                if (document.getElementById(`${ChangeToIds(sec)}/${key}`) == null)
                                    break;
                                let data = ini[sec][key].split(",")
                                document.getElementById(`${ChangeToIds(sec)}/${key}`).value = data[0]
                                if (data.length > 1) {
                                    document.getElementById(`${ChangeToIds(sec)}/${key}/where`).value = ChangeToValues(data[1])
                                }
                                break;
                        }
                        break;
                    case "Replace": case "ReplacePieces":
                        document.getElementById(`${ChangeToIds(sec)}-K`).value = key
                        document.getElementById(`${ChangeToIds(sec)}-V`).value = ini[sec][key]
                        document.getElementById(`${ChangeToIds(sec)}-Add`).click()
                        break;
                    case "Vowels":
                        document.getElementById(`${ChangeToIds(sec)}-K`).value = key
                        document.getElementById(`${ChangeToIds(sec)}-L`).value = ini[sec][key].split(",")[0]
                        document.getElementById(`${ChangeToIds(sec)}-R`).value = ini[sec][key].split(",")[1]
                        document.getElementById(`${ChangeToIds(sec)}-Add`).click()
                        break;
                    case "Consonants":
                        c = ini[sec][key].split(",")
                        let clean = [
                            "Consonants-L-S",
                            "Consonants-R-S",
                            "Consonants-L-M",
                            "Consonants-R-M",
                            "Consonants-L-F",
                            "Consonants-R-F"
                        ]
                        clean.forEach(cl => {
                            document.getElementById(cl).value = ""
                        })
                        document.getElementById(`${ChangeToIds(sec)}-K`).value = key
                        for (let i = 0; i < c.length; i++) {
                            document.getElementById(clean[i]).value = c[i]
                        }
                        document.getElementById(`${ChangeToIds(sec)}-Add`).click()
                        break;
                    case "Smart":
                        document.getElementById(`${ChangeToIds(sec)}-K`).value = key
                        c = ini[sec][key].split(",")
                        document.getElementById(`${ChangeToIds(sec)}-D`).value = c.shift()
                        document.getElementById(`${ChangeToIds(sec)}-C`).value = c.join("\n")
                        document.getElementById(`${ChangeToIds(sec)}-Add`).click()
                        break;
                    case "Time":
                        if (key == "IsMs") {
                            document.getElementById(`ConsonantsTime/IsMs`).value = ini[sec][key];
                            break;
                        }
                        document.getElementById(`${ChangeToIds(sec)}-K`).value = key
                        c = ini[sec][key].split(",")
                        document.getElementById(`${ChangeToIds(sec)}-Mv`).value = c.shift()
                        document.getElementById(`${ChangeToIds(sec)}-T`).value = c.shift()

                        c = c[0]

                        let at = ["A", "S", "M", "F"]

                        at.forEach(a => {
                            if (c.includes(a)) {
                                document.getElementById(`${ChangeToIds(sec)}-${a}`).checked = true
                            } else {
                                document.getElementById(`${ChangeToIds(sec)}-${a}`).checked = false
                            }
                        })

                        document.getElementById(`${ChangeToIds(sec)}-Add`).click()
                        break;
                    default:
                        let elem = document.getElementById(`${ChangeToIds(sec)}/${key}`)
                        if (elem != null)
                            elem.value = ini[sec][key];
                        break;
                }
            }
        }
    };
    reader.readAsText(file);
};
function openConf() {
    document.getElementById("file").click()
}
function saveConf(save = true) {

    config["settings"] = {}
    config["settings"]["dic_file"] = document.getElementById("settings/dic_file").value
    if (document.getElementById("settings/dic_file/where").value != "") {
        config["settings"]["dic_file"] += "," + ChangeToValues(document.getElementById("settings/dic_file/where").value)
    }
    config["settings"]["g2p"] = document.getElementById("settings/g2p").value
    if (document.getElementById("settings/g2p/where").value != "") {
        config["settings"]["g2p"] += "," + ChangeToValues(document.getElementById("settings/g2p/where").value)
    }

    config["settings"]["regex"] = document.getElementById("settings/regex").value.split("\n").join()
    config["settings"]["DicCaseSense"] = document.getElementById("settings/DicCaseSense").value


    let secs = ["-v", "v", "v v", "v-", "-cv", "v c", "cv", "vcv", "vc-", "-cc", "cc", "cc F", "cc-", "vcc", "vc", "-c", "c-"]

    for (let s in secs) {
        config[secs[s]] = {}
        config[secs[s]]["pattern"] = document.getElementById(`${secs[s]}/pattern`).value
    }

    secs = ["v c", "vcv", "vcc", "vc", "-c", "c-"]
    for (let s in secs) {
        if (document.getElementById(`${secs[s]}/use`).value != "")
            config[secs[s]]["use"] = document.getElementById(`${secs[s]}/use`).value
    }

    config["cc"]["vc_exception"] = document.getElementById("cc/vc_exception").value.split("\n").join()
    if (document.getElementById("v/use_always").value != "")
        config["v"]["use_always"] = document.getElementById("v/use_always").value
    if (config["ConsonantsTime/IsMs"])
        config["ConsonantsTime"]["IsMs"] = document.getElementById("ConsonantsTime/IsMs").value

    let out = ""

    for (let secs in config) {
        out += `[${ChangeToIds(secs)}]\n`
        for (let keys in config[secs]) {
            if (typeof config[secs][keys] == "object") {
                out += `${keys}=${config[secs][keys].join().split(/,(Time|Repl|Cons|Vowels)/)[0]}\n`
            } else {
                out += `${keys}=${config[secs][keys].split(/,(Time|Repl|Cons|Vowels)/)[0]}\n`
            }
        }
    }

    
    if (save) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(out));
        element.setAttribute('download', "config.ini");
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
        console.clear()
        console.log(out)
    }
}
