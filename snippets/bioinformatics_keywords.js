

var biocider = require("biocider");

var divSearch = document.createElement('div');
divSearch.classList.add('userTextContainer');
divSearch.innerHTML = 'Bioinformatics';
document.body.appendChild(divSearch);


var divKeywords = document.createElement('div');
divKeywords.classList.add('userKeywordsContainer');
var list = document.createElement('ul');
var listElement1 = document.createElement('li');
var listElement2 = document.createElement('li');
var keywordBlock1 = document.createElement('p');
var keywordBlock2 = document.createElement('p');
keywordBlock1.innerHTML = 'Sequencing';
keywordBlock2.innerHTML = 'ngs';
listElement1.appendChild(keywordBlock1);
listElement2.appendChild(keywordBlock2);
list.appendChild(listElement1);
list.appendChild(listElement2);
divKeywords.appendChild(list);

var bioCiderInstance = new biocider('snippetDiv',{'userTextClassContainer':'userTextContainer','userKeywordsClassContainer':'userKeywordsContainer'},{},{});

bioCiderInstance.draw();