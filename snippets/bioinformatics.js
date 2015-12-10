

var biocider = require("biocider");

var divTable1 = document.createElement('div');
divTable1.style.display = "table";

var divTableRow1 = document.createElement('div');
divTableRow1.style.display = "table-row";
divTableRow1.style.width = "100px";

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
document.body.appendChild(divTable1);


var divTable2 = document.createElement('div');
divTable2.style.display = "table";

var divTableRow2 = document.createElement('div');
divTableRow2.style.display = "table-row";
divTableRow2.id = "snippetDiv";

divTable2.appendChild(divTableRow2);
document.body.appendChild(divTable2);

var bioCiderInstance = new biocider('snippetDiv',{'userTextClassContainer':'userTextContainer'},{},{});

bioCiderInstance.draw();

