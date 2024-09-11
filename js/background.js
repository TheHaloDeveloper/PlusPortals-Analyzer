chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url && (tab.url.includes("https://www.plusportals.com") || tab.url.includes("https://plusportals.com")) && changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: applyModifications
        });
    }
});

function applyModifications() {
    chrome.storage.sync.get(['pcc'], function (result) {
        if(result.pcc == undefined){
            chrome.storage.sync.set({"pcc": true})
            color_code()
        } else if(result.pcc == true){
            color_code()
        }
    });

    function color_code() {
        let table = document.getElementById('GridProgress').children[1].children[0];

        function checkFlag() {
            if(table.children[1].children.length == 1) {
                window.setTimeout(checkFlag, 1000); 
            } else {
                // Grades color coding
                for(let i = 0; i < table.children[1].children.length; i++){
                    let elem = table.children[1].children[i].children;
                    let course = elem[0];
                    let average = elem[1];
                    let grade = elem[2];
                    let gradeVal = grade.children[0].innerHTML.trim()
    
                    for(let x = 0; x < elem.length; x++){
                        elem[x].style.border = "1.5px solid black";
                    }

                    function style(elems, types) {
                        for (let elem of elems) {
                            for (let type of types) {
                                elem.style[type[0]] = type[1]; 
                            }
                        }
                    }
    
                    style([course.children[0], average.children[0], grade.children[0]], [["fontWeight", "bold"], ["color", "black"]]);
            
                    if(gradeVal == 'A+' || gradeVal == 'A'){
                        style([course, average, grade], [["backgroundColor", "#9bff94"]]);
                    } else if(gradeVal == 'A-'){
                        style([course, average, grade], [["backgroundColor", "yellow"]]);
                    } else if(gradeVal == '' || gradeVal == 'P') {
                        style([course, average, grade], [["backgroundColor", "#f1f1f1"]]);
                    } else {
                        style([course, average, grade], [["backgroundColor", "#fc5d44"], ["color", "white"]]);
                    }
                }
            }
        }
        checkFlag();
    }
    
    let name_container = document.getElementsByClassName('re-blue-strip')[0].getElementsByTagName('label')[0];

    let name = name_container.innerHTML.split('<')[0]
    name_container.innerHTML = `${name} `;
    
    chrome.storage.sync.get(['pai'], function (result) {
        if(result.pai == undefined){
            chrome.storage.sync.set({"pai": true})
            name_container.innerHTML += '<img src="https://i.ibb.co/fFKTm9T/icon.png" width="20px" style="margin-top: -5px; border-radius: 5px;">'
        } else {
            if(result.pai == true){
                name_container.innerHTML += '<img src="https://i.ibb.co/fFKTm9T/icon.png" width="20px" style="margin-top: -5px; border-radius: 5px;">'
            }
        }
    });
    
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }      

    chrome.storage.sync.get(['color'], function (result) {
        let res = result.color;
        if (result.color == undefined){
            chrome.storage.sync.set({"color": "#499bd1"})
            res = "#499bd1";
        }
        
        let rgb = hexToRgb(res);
        let oldColor = window.getComputedStyle(document.getElementsByClassName("navbar-inner")[0]).backgroundColor;

        const elems = [...document.querySelectorAll('*')].filter(el => {
            return window.getComputedStyle(el).backgroundColor === oldColor;
        });
        
        for (let elem of elems) {
            elem.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
    });
}