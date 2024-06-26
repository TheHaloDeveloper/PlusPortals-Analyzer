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
    
                    course.children[0].style.fontWeight = 'bold';
                    average.children[0].style.fontWeight = 'bold';
                    grade.children[0].style.fontWeight = 'bold';
                    course.children[0].style.color = 'black';
                    average.children[0].style.color = 'black';
                    grade.children[0].style.color = 'black';
            
                    if(gradeVal == 'A+' || gradeVal == 'A'){
                        course.style.backgroundColor = '#9bff94';
                        average.style.backgroundColor = '#9bff94';
                        grade.style.backgroundColor = '#9bff94';
                    } else if(gradeVal == 'A-'){
                        course.style.backgroundColor = 'yellow';
                        average.style.backgroundColor = 'yellow';
                        grade.style.backgroundColor = 'yellow';
                    } else if(gradeVal == '') {
                        course.style.backgroundColor = '#f1f1f1';
                        average.style.backgroundColor = '#f1f1f1';
                        grade.style.backgroundColor = '#f1f1f1';
                    } else {
                        course.style.backgroundColor = '#fc5d44';
                        average.style.backgroundColor = '#fc5d44';
                        grade.style.backgroundColor = '#fc5d44';
    
                        course.children[0].style.color = 'white';
                        average.children[0].style.color = 'white';
                        grade.children[0].style.color = 'white';
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
}
