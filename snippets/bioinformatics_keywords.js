

var biocider = require("biocider");


// TABLE1
var divTable1 = document.createElement('div');
divTable1.style.display = "table";
divTable1.style.width = "100px";

// row1
var divTableRow1 = document.createElement('div');
divTableRow1.style.display = "table-row";

var divTableCell11 = document.createElement('div');
divTableCell11.style.display = "table-cell";
divTableCell11.innerHTML = "Title: ";

var divSearch = document.createElement('div');
divSearch.style.display = "table-cell";
divSearch.classList.add('userTextContainer');
divSearch.innerHTML = 'Bioinformatics';

divTableRow1.appendChild(divTableCell11);
divTableRow1.appendChild(divSearch);
divTable1.appendChild(divTableRow1);

// row2
var divTableRow2 = document.createElement('div');
divTableRow2.style.display = "table-row";

var divTableCell21 = document.createElement('div');
divTableCell21.style.display = "table-cell";
divTableCell21.innerHTML = "Keywords: ";



var divKeywords = document.createElement('div');
divKeywords.classList.add('userKeywordsContainer');
divKeywords.style.display = "table-cell";
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


divTableRow2.appendChild(divTableCell21);
divTableRow2.appendChild(divKeywords);
divTable1.appendChild(divTableRow2);
document.body.appendChild(divTable1);



// TABLE2
var divTable2 = document.createElement('div');
divTable2.style.display = "table";

var divTableRow2 = document.createElement('div');
divTableRow2.style.display = "table-row";
divTableRow2.id = "snippetDiv";

divTable2.appendChild(divTableRow2);
document.body.appendChild(divTable2);



var bioCiderInstance = new biocider('snippetDiv',{'userTextClassContainer':'userTextContainer','userKeywordsClassContainer':'userKeywordsContainer'},{},{});

bioCiderInstance.draw();