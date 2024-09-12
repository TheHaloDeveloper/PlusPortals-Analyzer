document.addEventListener('DOMContentLoaded', function() {
    let gpa = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'D-': 0.7,
        'F': 0.0
    };

    let a_gpa = {
        'A+': 5.0,
        'A': 5.0,
        'A-': 4.7,
        'B+': 4.3,
        'B': 4.0,
        'B-': 3.7,
        'C+': 3.3,
        'C': 3.0,
        'C-': 2.7,
        'D+': 1.3,
        'D': 1.0,
        'D-': 0.7,
        'F': 0.0
    };

    let advanced_titles = [' Hon', 'AP ', 'IB '];

    let urls = ['https://www.plusportals.com', 'https://plusportals.com']
    let tablebody = document.getElementById('table-body');
    let weighted = document.getElementById('weighted');
    let btns = document.getElementById('btns-container');
    let errorContainer = document.getElementById('error-container');

    function calculate_gpa(isWeighted) {
        let grades = [];
        let advanced = false;

        // Average
        for (let row of tablebody.children.length) {
            if (row.children.length == 3) {
                for (let x = 0; x < advanced_titles.length; x++) {
                    if (row.children[0].innerHTML.includes(advanced_titles[x])) {
                        advanced = true;
                    }
                }
                
                if (advanced && isWeighted) {
                    grades.push(a_gpa[row.children[2].innerHTML])
                } else {
                    grades.push(gpa[row.children[2].innerHTML])
                }

                advanced = false;
            }
        }

        let final_gpa = 0;
        let classes = 0;

        for (let i = 0; i < grades.length; i++) {
            if (grades[i]) {
                final_gpa += grades[i];
                classes += 1;
            }
        }

        return (Math.round((final_gpa / classes) * 100) / 100).toFixed(1);
    }

    function main() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tab = tabs[0];
            let currUrl = tab.url;
            let id = tab.id;
            let urlFound = false;
    
            for (let url of urls) {
                if (currUrl.includes(url) && !urlFound) {
                    urlFound = true;
                    errorContainer.style.display = 'none';
    
                    chrome.scripting.executeScript(
                        { target: { tabId: id }, function: getPageHTML },
                        function (results) {
                            if (results && results.length > 0) {
                                let html = results[0].result;
                                let parser = new DOMParser();
                                let doc = parser.parseFromString(html, 'text/html');
    
                                if (doc.getElementById('LOGIN')) {
                                    // Logged out
                                    errorContainer.style.display = 'block';
                                    errorContainer.children[0].innerHTML = 'Please login first!';
                                } else {
                                    let table = doc.getElementById('GridProgress').children[1].children[0];
    
                                    // Classes
                                    for (let row of table.children[1].children) {
                                        let elem = row.children;
                                        let course = elem[0].children[0].innerHTML.split('(')[0];
                                        let average = elem[1].children[0].innerHTML;
                                        let grade = elem[2].children[0].innerHTML.replace(/\s/g, '');
    
                                        if (grade == 'A+' || grade == 'A') {
                                            tablebody.innerHTML += `<tr><td class='green'>${course}</td><td class='green'>${average}</td><td class='green'>${grade}</td></tr>`;
                                        } else if (grade == 'A-') {
                                            tablebody.innerHTML += `<tr><td class='yellow'>${course}</td><td class='yellow'>${average}</td><td class='yellow'>${grade}</td></tr>`;
                                        } else if (grade == '' || grade == 'P') {
                                            tablebody.innerHTML += `<tr><td class='grey'>${course}</td><td class='grey'>${average}</td><td class='grey'>${grade}</td></tr>`;
                                        } else {
                                            tablebody.innerHTML += `<tr><td class='red'>${course}</td><td class='red'>${average}</td><td class='red'>${grade}</td></tr>`;
                                        }
                                    }
    
                                    chrome.storage.sync.get(['isWeighted'], function (result) {
                                        if (result.isWeighted == undefined) {
                                            chrome.storage.sync.set({"isWeighted": weighted.checked});
                                            weighted.checked = true;
                                        } else {
                                            weighted.checked = result.isWeighted;
                                        }

                                        let final_gpa = calculate_gpa(result.isWeighted !== undefined ? result.isWeighted : true);
                                        tablebody.innerHTML += `<tr><td class='final' colspan="2"><b>Final GPA:<b></td><td class='final' id='final_gpa'><b>${final_gpa}<b></td></tr>`;
                                    });
                                }
                            }
                        }
                    );
                }
            }
    
            if (urlFound == false) {
                chrome.tabs.create({url: 'https://plusportals.com'});
            }
        });
    }    

    main()

    function getPageHTML() {
        return document.documentElement.outerHTML;
    }
    
    function btnsClicked(event) {
        if (event.target.id == 'ungraded-classes') {
            if (btns.innerHTML.includes('<i id="ungraded-classes" class="fa-solid fa-eye"></i>')) {
                btns.innerHTML = btns.innerHTML.replace('<i id="ungraded-classes" class="fa-solid fa-eye"></i>', '<i id="ungraded-classes" class="fa-solid fa-eye-slash"></i>')

                for (let i = tablebody.children.length - 1; i >= 0; i--) {
                    if (tablebody.children[i].children[1].innerHTML == '') {
                        document.getElementsByClassName('GeneratedTable')[0].deleteRow(i + 1)
                    }
                }
            } else {
                btns.innerHTML = btns.innerHTML.replace('<i id="ungraded-classes" class="fa-solid fa-eye-slash"></i>', '<i id="ungraded-classes" class="fa-solid fa-eye"></i>');
                tablebody.innerHTML = '';

                main();
            }
        } else if (event.target.id == 'settings') {
            document.getElementById("settings-menu").style.display = "block";
        }
    }

    function redirectToChangelog() {
        chrome.tabs.create({ url: 'changelog.html' });
    }

    function toggleWeighted() {
        chrome.storage.sync.set({"isWeighted": weighted.checked});
        let gpa = calculate_gpa(weighted.checked);
        document.getElementById('final_gpa').innerHTML = `<b>${gpa}</b>`;
    }

    let pcc = document.getElementById("pcc-checkbox");
    let pai = document.getElementById("pai-checkbox");
    let color = document.getElementById("color");

    chrome.storage.sync.get(['pcc'], function (result) {
        if (result.pcc == undefined) {
            pcc.checked = true;
        } else {
            pcc.checked = result.pcc;
        }
    });

    chrome.storage.sync.get(['pai'], function (result) {
        if (result.pai == undefined) {
            pai.checked = true;
        } else {
            pai.checked = result.pai;
        }
    });
    
    document.getElementById("changelog").addEventListener("click", redirectToChangelog);
    weighted.addEventListener("change", toggleWeighted);
    btns.addEventListener('click', btnsClicked);

    document.getElementById('close').addEventListener("click", function() {
        document.getElementById('settings-menu').style.display = "none";
    });
    
    document.getElementById('save').addEventListener("click", function() {
        chrome.storage.sync.set({"pai": pai.checked});
        chrome.storage.sync.set({"pcc": pcc.checked});
        chrome.storage.sync.set({"color": color.value});
        chrome.tabs.reload();
    });

    chrome.storage.sync.get(['color'], function (result) {
        if (result.color == undefined) {
            color.value = "rgb(73, 155, 209)";
        } else {
            color.value = result.color;
        }
    });
});